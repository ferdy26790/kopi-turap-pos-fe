"use client";

import { ArrowLeft, Bluetooth, Printer } from "lucide-react";
import ReceiptLines from "./ReceiptLines";
import { Order } from "@/lib/types";

export default function OrderDetailOverlay({
  order,
  onClose,
  onPrint,
  onPrintBluetooth,
}: {
  order: Order;
  onClose: () => void;
  onPrint: () => void;
  onPrintBluetooth: () => void;
}) {
  return (
    <div className="fixed inset-0 z-20 flex justify-center items-start lg:items-center px-6 bg-black/50">
      <div className="font-body w-full max-w-sm mt-10 lg:mt-0 rounded-2xl overflow-hidden bg-white">
        <div className="flex items-center gap-3 px-5 py-4 bg-panel text-paper">
          <button onClick={onClose} className="opacity-80">
            <ArrowLeft size={18} />
          </button>
          <div className="font-display text-base">Ticket #{String(order.no).padStart(4, "0")}</div>
        </div>
        <div className="px-6 py-5 font-mono">
          <ReceiptLines order={order} />
          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={onPrintBluetooth}
              className="w-full py-3 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 bg-accent text-paper"
            >
              <Bluetooth size={15} />
              Print to Bluetooth printer
            </button>
            <button
              onClick={onPrint}
              className="w-full py-3 rounded-lg font-body font-semibold text-sm flex items-center justify-center gap-2 bg-panel text-paper"
            >
              <Printer size={15} />
              Browser print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
