"use client";

import { useEffect, useState } from "react";
import { ChefHat, Check, Flame } from "lucide-react";
import { fetchOrders, updateOrderStatus, clearCompletedOrders, OrderDTO } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import KitchenColumn from "@/components/kitchen/KitchenColumn";

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchOrders().then((all) => setOrders(all.filter((o) => !o.kitchenCleared)));

    const socket = getSocket();
    setConnected(socket.connected);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleNew = (order: OrderDTO) =>
      setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
    const handleUpdated = (order: OrderDTO) =>
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    const handleClearedCompleted = () =>
      setOrders((prev) => prev.filter((o) => o.status !== "completed"));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("order:new", handleNew);
    socket.on("order:updated", handleUpdated);
    socket.on("orders:cleared-completed", handleClearedCompleted);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("order:new", handleNew);
      socket.off("order:updated", handleUpdated);
      socket.off("orders:cleared-completed", handleClearedCompleted);
    };
  }, []);

  async function handleAction(id: number, next:"new" | "in_progress" | "ready_to_pick_up" | "completed") {
    // Optimistic update — the socket event confirms/corrects it moments later.
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
    await updateOrderStatus(id, next);
  }

  const newOrders = orders.filter((o) => o.status === "new");
  const inProgress = orders.filter((o) => o.status === "in_progress");
  const readyToPickUp = orders.filter((o) => o.status === "ready_to_pick_up");
  const completed = orders.filter((o) => o.status === "completed");

  return (
    <div className="min-h-screen bg-panel text-paper">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ChefHat size={20} />
          <div className="font-display text-lg">Kitchen Display</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-accent" : "bg-accent2"}`} />
          {connected ? "Live" : "Reconnecting…"}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <KitchenColumn
          title="New"
          icon={<Flame size={15} />}
          orders={newOrders}
          action={{ label: "Start", next: "in_progress" }}
          onAction={handleAction}
        />
        <KitchenColumn
          title="In Progress"
          icon={<Flame size={15} />}
          orders={inProgress}
          action={{ label: "Ready", next: "ready_to_pick_up" }}
          onAction={handleAction}
        />
        <KitchenColumn
          title="Ready"
          icon={<ChefHat size={15} />}
          orders={readyToPickUp}
          action={{ label: "Complete", next: "completed" }}
          onAction={handleAction}
        />
        <KitchenColumn
          title="Completed"
          icon={<Check size={15} />}
          orders={completed}
          onClear={() => clearCompletedOrders()}
        />
      </div>
    </div>
  );
}
