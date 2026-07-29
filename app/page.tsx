"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import CartPanel from "@/components/CartPanel";
import PaymentOverlay from "@/components/PaymentOverlay";
import ReceiptScreen from "@/components/ReceiptScreen";
import HistoryScreen from "@/components/HistoryScreen";
import OrderDetailOverlay from "@/components/OrderDetailOverlay";
import PrintableReceipt from "@/components/PrintableReceipt";
import {
  loadHistory,
  saveHistory,
  clearHistory as clearHistoryStorage,
  loadTicketNo,
  saveTicketNo,
} from "@/lib/storage";
import { fetchMenu, createOrder } from "@/lib/api";
import { printViaRawBT } from "@/lib/receiptText";
import { CartLine, Category, MenuItem, Order, PaymentMethod, Stage } from "@/lib/types";

export default function Page() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const [category, setCategory] = useState<Category | "All">("All");
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [stage, setStage] = useState<Stage>("order");
  const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState("");
  const [ticketNo, setTicketNo] = useState(1);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [history, setHistory] = useState<Order[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Load the live menu from the server.
  useEffect(() => {
    fetchMenu().then((items) => {
      setMenu(items);
      setMenuLoading(false);
    });
  }, []);

  // Load local receipt history + the next-ticket display hint.
  useEffect(() => {
    setHistory(loadHistory());
    setTicketNo(loadTicketNo());
    setHistoryLoaded(true);
  }, []);

  function persist(nextHistory: Order[], nextTicketNo: number) {
    const ok1 = saveHistory(nextHistory);
    const ok2 = saveTicketNo(nextTicketNo);
    setStorageError(!(ok1 && ok2));
  }

  function handleClearHistory() {
    setHistory([]);
    clearHistoryStorage();
  }

  const cartLines: CartLine[] = useMemo(
    () =>
      cart
        .map((c) => {
          const item = menu.find((m) => m.id === c.id);
          return item ? { ...item, qty: c.qty } : null;
        })
        .filter((x): x is CartLine => x !== null),
    [cart, menu]
  );

  const total = useMemo(() => cartLines.reduce((sum, l) => sum + l.price * l.qty, 0), [cartLines]);

  function addItem(id: string) {
    setCart((prev) => {
      const found = prev.find((c) => c.id === id);
      if (found) return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id, qty: 1 }];
    });
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function resetOrder() {
    setCart([]);
    setPayMethod(null);
    setCashReceived("");
    setStage("order");
  }

  async function confirmPayment() {
    setSubmitting(true);
    const method = payMethod as PaymentMethod;
    const cashReceivedNum = method === "cash" ? Number(cashReceived || 0) : null;
    const timeIso = new Date().toISOString();

    // The server is the source of truth for the order id now. If it's
    // unreachable, fall back to the local counter so the register still
    // works offline — just without kitchen/admin visibility for that sale.
    const created = await createOrder({
      items: cartLines.map((l) => ({ name: l.name, price: l.price, qty: l.qty, menuItemId: l.id })),
      total,
      method,
      time: timeIso,
    });

    const orderNo = created?.id ?? ticketNo;

    const order: Order = {
      no: orderNo,
      lines: cartLines,
      total,
      method,
      cashReceived: cashReceivedNum,
      time: timeIso,
    };

    const nextTicketNo = created ? created.id + 1 : ticketNo + 1;
    const nextHistory = [order, ...history];

    setLastOrder(order);
    setHistory(nextHistory);
    setTicketNo(nextTicketNo);
    setSubmitting(false);
    setStage("done");
    persist(nextHistory, nextTicketNo);

    // Reflect stock decrements locally without waiting for a full menu refetch.
    if (created) {
      setMenu((prev) =>
        prev.map((m) => {
          const line = cartLines.find((l) => l.id === m.id);
          if (!line || m.stockQty === null || m.stockQty === undefined) return m;
          return { ...m, stockQty: Math.max(0, m.stockQty - line.qty) };
        })
      );
    }
  }

  function triggerPrint(order: Order) {
    setPrintOrder(order);
    setTimeout(() => window.print(), 60);
  }

  return (
    <div className="min-h-screen w-full">
      <Header
        ticketNo={ticketNo}
        stage={stage}
        onToggleHistory={() => setStage(stage === "history" ? "order" : "history")}
      />

      {(stage === "order" || stage === "pay") && (
        <div className="flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 68px)" }}>
          <ProductGrid
            menu={menu}
            menuLoading={menuLoading}
            category={category}
            setCategory={setCategory}
            cart={cartLines}
            onAdd={addItem}
          />
          <CartPanel
            ticketNo={ticketNo}
            cartLines={cartLines}
            total={total}
            onChangeQty={changeQty}
            onRemove={removeItem}
            onCharge={() => setStage("pay")}
          />
        </div>
      )}

      {stage === "pay" && (
        <PaymentOverlay
          total={total}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          cashReceived={cashReceived}
          setCashReceived={setCashReceived}
          onBack={() => setStage("order")}
          onConfirm={confirmPayment}
          submitting={submitting}
        />
      )}

      {stage === "done" && lastOrder && (
        <ReceiptScreen
          order={lastOrder}
          onNewOrder={resetOrder}
          onPrint={() => triggerPrint(lastOrder)}
          onPrintBluetooth={() => printViaRawBT(lastOrder)}
        />
      )}

      {stage === "history" && (
        <HistoryScreen
          history={history}
          loaded={historyLoaded}
          storageError={storageError}
          onBack={() => setStage("order")}
          onView={(o) => setViewingOrder(o)}
          onClear={handleClearHistory}
        />
      )}

      {viewingOrder && (
        <OrderDetailOverlay
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          onPrint={() => triggerPrint(viewingOrder)}
          onPrintBluetooth={() => printViaRawBT(viewingOrder)}
        />
      )}

      {printOrder && <PrintableReceipt order={printOrder} />}
    </div>
  );
}
