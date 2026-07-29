"use client";

import { OrderDTO, OrderStatus } from "@/lib/api";

export default function KitchenOrderCard({
  order,
  action,
  onAction,
}: {
  order: OrderDTO;
  action?: { label: string; next: OrderStatus };
  onAction?: (id: number, next: OrderStatus) => void;
}) {
  return (
    <div className="bg-paper text-ink rounded-xl p-3 font-mono text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">#{String(order.id).padStart(4, "0")}</span>
        <span className="text-xs text-muted">
          {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <ul className="mb-3 space-y-0.5">
        {order.items.map((it) => (
          <li key={it.id}>
            {it.qty}x {it.name}
          </li>
        ))}
      </ul>
      {action && onAction && (
        <button
          onClick={() => onAction(order.id, action.next)}
          className="w-full py-2 rounded-lg bg-accent text-paper text-xs font-semibold font-body"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
