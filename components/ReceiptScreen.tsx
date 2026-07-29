"use client";

import { Check, Bluetooth, Printer, Receipt as ReceiptIcon } from "lucide-react";
import ReceiptLines from "./ReceiptLines";
import { Order } from "@/lib/types";

export default function ReceiptScreen({
  order,
  onNewOrder,
  onPrint,
  onPrintBluetooth,
}: {
  order: Order;
  onNewOrder: () => void;
  onPrint: () => void;
  onPrintBluetooth: () => void;
}) {
  return (
    <div className="flex items-center justify-center px-6" style={{ minHeight: "calc(100vh - 68px)" }}>
      <div className="w-full max-w-sm font-mono rounded-2xl overflow-hidden bg-white border border-line">
        <div className="flex flex-col items-center py-6 bg-accent text-paper">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-white/20">
            <Check size={22} />
          </div>
          <div className="font-body font-semibold">Payment complete</div>
          <div className="text-xs opacity-80 mt-0.5">
            {order.method === "cash" ? "Paid with cash" : "Paid with QRIS"}
          </div>
        </div>

        <div className="px-6 py-5">
          <ReceiptLines order={order} />

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={onPrintBluetooth}
              className="py-3 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 bg-accent text-paper"
            >
              <Bluetooth size={15} />
              Print to Bluetooth printer
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onPrint}
                className="py-3 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 bg-white border border-line text-ink"
              >
                <Printer size={15} />
                Browser print
              </button>
              <button
                onClick={onNewOrder}
                className="py-3 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 bg-panel text-paper"
              >
                <ReceiptIcon size={15} />
                New order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
