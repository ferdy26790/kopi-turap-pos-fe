"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { rp } from "@/lib/format";
import { Order } from "@/lib/types";

export default function HistoryScreen({
  history,
  loaded,
  storageError,
  onBack,
  onView,
  onClear,
}: {
  history: Order[];
  loaded: boolean;
  storageError: boolean;
  onBack: () => void;
  onView: (o: Order) => void;
  onClear: () => void;
}) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  const todayTotal = useMemo(() => {
    const today = new Date().toDateString();
    return history
      .filter((o) => new Date(o.time).toDateString() === today)
      .reduce((s, o) => s + o.total, 0);
  }, [history]);

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto font-body">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted">
          <ArrowLeft size={16} />
          Back to register
        </button>
        {history.length > 0 && !confirmingClear && (
          <button
            onClick={() => setConfirmingClear(true)}
            className="flex items-center gap-1.5 text-xs text-accent2-dark"
          >
            <Trash2 size={13} />
            Clear history
          </button>
        )}
        {confirmingClear && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Delete all saved orders?</span>
            <button
              onClick={() => {
                onClear();
                setConfirmingClear(false);
              }}
              className="px-2 py-1 rounded bg-accent2 text-white"
            >
              Yes, clear
            </button>
            <button
              onClick={() => setConfirmingClear(false)}
              className="px-2 py-1 rounded border border-line"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="font-display text-2xl mb-1">Order History</div>
      <div className="text-sm mb-5 text-muted">
        Today&apos;s sales:{" "}
        <span className="font-mono font-semibold text-ink">{rp(todayTotal)}</span>
      </div>

      {storageError && (
        <div className="text-xs px-3 py-2 rounded-lg mb-4 bg-accent2/10 text-accent2-dark">
          Couldn&apos;t reach saved storage just now — new orders may not persist until this is
          resolved.
        </div>
      )}

      {!loaded ? (
        <div className="text-sm text-muted">Loading history…</div>
      ) : history.length === 0 ? (
        <div className="text-sm text-center py-16 rounded-xl text-muted border border-dashed border-line">
          No orders yet. Completed sales will show up here.
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((o) => (
            <button
              key={`${o.no}-${o.time}`}
              onClick={() => onView(o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left bg-white border border-line"
            >
              <div>
                <div className="text-sm font-medium font-mono">#{String(o.no).padStart(4, "0")}</div>
                <div className="text-xs text-muted">
                  {new Date(o.time).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {o.method === "cash" ? "Cash" : "QRIS"} ·{" "}
                  {o.lines.reduce((s, l) => s + l.qty, 0)} items
                </div>
              </div>
              <div className="font-mono font-semibold tabular text-sm">{rp(o.total)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
