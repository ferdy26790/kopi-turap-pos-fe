"use client";

import { rp } from "@/lib/format";
import { Order } from "@/lib/types";

export default function ReceiptLines({ order }: { order: Order }) {
  const time = new Date(order.time);
  return (
    <>
      <div className="flex items-center justify-between text-xs mb-3 text-muted">
        <span>Ticket #{String(order.no).padStart(4, "0")}</span>
        <span>{time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="border-t border-dashed border-line mb-3" />
      {order.lines.map((l) => (
        <div key={l.id} className="flex justify-between text-sm py-1">
          <span>
            {l.qty}x {l.name}
          </span>
          <span className="tabular">{rp(l.price * l.qty)}</span>
        </div>
      ))}
      <div className="border-t border-dashed border-line my-3" />
      <div className="flex justify-between font-bold text-sm">
        <span>Total</span>
        <span className="tabular">{rp(order.total)}</span>
      </div>
      {order.method === "cash" && order.cashReceived !== null && (
        <>
          <div className="flex justify-between text-sm mt-1 text-muted">
            <span>Cash received</span>
            <span className="tabular">{rp(order.cashReceived)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Change</span>
            <span className="tabular">{rp(order.cashReceived - order.total)}</span>
          </div>
        </>
      )}
    </>
  );
}
