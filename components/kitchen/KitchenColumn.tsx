"use client";

import { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { OrderDTO, OrderStatus } from "@/lib/api";
import KitchenOrderCard from "./KitchenOrderCard";

export default function KitchenColumn({
  title,
  icon,
  orders,
  action,
  onAction,
  onClear,
}: {
  title: string;
  icon: ReactNode;
  orders: OrderDTO[];
  action?: { label: string; next: OrderStatus };
  onAction?: (id: number, next: OrderStatus) => void;
  onClear?: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
          <span className="text-xs font-mono opacity-60">({orders.length})</span>
        </div>
        {onClear && orders.length > 0 && (
          <button onClick={onClear} className="text-xs opacity-70 flex items-center gap-1">
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>
      <div className="space-y-3">
        {orders.length === 0 && <div className="text-xs opacity-50 py-6 text-center">No orders</div>}
        {orders.map((o) => (
          <KitchenOrderCard key={o.id} order={o} action={action} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}
