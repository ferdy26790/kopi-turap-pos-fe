"use client";

import { Plus, Minus, X } from "lucide-react";
import { rp } from "@/lib/format";
import { CartLine } from "@/lib/types";

export default function CartPanel({
  ticketNo,
  cartLines,
  total,
  onChangeQty,
  onRemove,
  onCharge,
}: {
  ticketNo: number;
  cartLines: CartLine[];
  total: number;
  onChangeQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCharge: () => void;
}) {
  return (
    <div className="lg:w-[360px] w-full flex flex-col font-mono bg-white border-l border-line">
      <div className="ticket-edge h-3 bg-white" />
      <div className="px-5 pt-2 pb-3 flex items-center justify-between">
        <div className="font-display text-base">Order Ticket</div>
        <div className="text-xs text-muted">#{String(ticketNo).padStart(4, "0")}</div>
      </div>
      <div className="border-t border-dashed border-line mx-5" />

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3" style={{ minHeight: 180 }}>
        {cartLines.length === 0 ? (
          <div className="text-xs text-center py-10 text-muted">
            No items yet.
            <br />
            Tap a menu item to add it.
          </div>
        ) : (
          cartLines.map((line) => (
            <div key={line.id} className="flex items-center justify-between py-2 text-sm">
              <div className="flex-1 min-w-0">
                <div className="truncate font-body">{line.name}</div>
                <div className="text-xs tabular text-muted">
                  {rp(line.price)} x {line.qty}
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => onChangeQty(line.id, -1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-paper"
                >
                  <Minus size={12} />
                </button>
                <span className="w-4 text-center tabular">{line.qty}</span>
                <button
                  onClick={() => onChangeQty(line.id, 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-paper"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={() => onRemove(line.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center ml-1 text-accent2-dark"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-dashed border-line mx-5" />

      <div className="px-5 py-4">
        <div className="flex items-center justify-between text-base mb-4">
          <span className="font-body font-semibold">Total</span>
          <span className="tabular font-bold">{rp(total)}</span>
        </div>
        <button
          disabled={cartLines.length === 0}
          onClick={onCharge}
          className="w-full py-3 rounded-lg font-body font-semibold text-sm bg-accent text-paper disabled:opacity-40 transition-opacity"
        >
          Charge {cartLines.length > 0 ? rp(total) : ""}
        </button>
      </div>
    </div>
  );
}
