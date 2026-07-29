"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOrders, OrderDTO } from "@/lib/api";
import { rp } from "@/lib/format";

export default function SalesView() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then((all) => {
      setOrders(all);
      setLoading(false);
    });
  }, []);

  const today = new Date().toDateString();

  const summary = useMemo(() => {
    const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const revenue = todays.reduce((s, o) => s + o.total, 0);
    const itemCount = todays.reduce((s, o) => s + o.items.reduce((s2, it) => s2 + it.qty, 0), 0);
    return {
      orderCount: todays.length,
      revenue,
      avgTicket: todays.length > 0 ? revenue / todays.length : 0,
      itemCount,
    };
  }, [orders, today]);

  if (loading) {
    return <div className="text-sm text-muted font-body">Loading sales…</div>;
  }

  return (
    <div className="font-body">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard label="Today's revenue" value={rp(summary.revenue)} />
        <SummaryCard label="Orders today" value={String(summary.orderCount)} />
        <SummaryCard label="Items sold today" value={String(summary.itemCount)} />
        <SummaryCard
          label="Avg. ticket"
          value={summary.orderCount > 0 ? rp(summary.avgTicket) : "—"}
        />
      </div>

      {orders.length === 0 ? (
        <div className="text-sm text-muted text-center py-10 border border-dashed border-line rounded-xl">
          No sales yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line text-xs text-muted">
                <th className="px-4 py-2 font-medium">Ticket</th>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Items</th>
                <th className="px-4 py-2 font-medium">Method</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 font-mono">
                  <td className="px-4 py-2">#{String(o.id).padStart(4, "0")}</td>
                  <td className="px-4 py-2 text-xs">
                    {new Date(o.createdAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {o.items.reduce((s, it) => s + it.qty, 0)} items
                  </td>
                  <td className="px-4 py-2 text-xs uppercase">{o.method}</td>
                  <td className="px-4 py-2 text-xs capitalize">{o.status.replace("_", " ")}</td>
                  <td className="px-4 py-2 text-right">{rp(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-line p-4">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="font-mono text-lg font-bold">{value}</div>
    </div>
  );
}
