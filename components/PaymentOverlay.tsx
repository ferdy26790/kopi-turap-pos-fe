"use client";

import { Banknote, QrCode, Check, ArrowLeft } from "lucide-react";
import { rp, roundUpTo } from "@/lib/format";
import { CASH_PRESETS } from "@/lib/menu";
import { PaymentMethod } from "@/lib/types";

export default function PaymentOverlay({
  total,
  payMethod,
  setPayMethod,
  cashReceived,
  setCashReceived,
  onBack,
  onConfirm,
  submitting,
}: {
  total: number;
  payMethod: PaymentMethod | null;
  setPayMethod: (m: PaymentMethod) => void;
  cashReceived: string;
  setCashReceived: (v: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  submitting?: boolean;
}) {
  const cashChange = payMethod === "cash" && cashReceived ? Number(cashReceived) - total : null;
  const canConfirm =
    !submitting && (payMethod === "qris" || (payMethod === "cash" && Number(cashReceived || 0) >= total));

  const presets = [
    total,
    ...CASH_PRESETS.map((step) => roundUpTo(total, step)).filter(
      (v, i, arr) => arr.indexOf(v) === i && v > total
    ),
  ].slice(0, 4);

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-start lg:items-center bg-black/50 px-4">
      <div className="w-full max-w-md mt-10 lg:mt-0 rounded-2xl overflow-hidden bg-paper">
        <div className="flex items-center gap-3 px-5 py-4 bg-panel text-paper">
          <button onClick={onBack} className="opacity-80">
            <ArrowLeft size={18} />
          </button>
          <div className="font-display text-base">Take Payment</div>
        </div>

        <div className="px-5 py-5 font-body">
          <div className="text-center mb-5">
            <div className="text-xs uppercase tracking-wide text-muted">Amount due</div>
            <div className="font-mono text-3xl font-bold tabular mt-1">{rp(total)}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setPayMethod("cash")}
              className={`rounded-xl py-4 flex flex-col items-center gap-2 border-2 transition-colors ${
                payMethod === "cash" ? "border-accent bg-accent/10" : "border-line bg-white"
              }`}
            >
              <Banknote size={22} className="text-accent-dark" />
              <span className="text-sm font-medium">Cash</span>
            </button>
            <button
              onClick={() => setPayMethod("qris")}
              className={`rounded-xl py-4 flex flex-col items-center gap-2 border-2 transition-colors ${
                payMethod === "qris" ? "border-accent2 bg-accent2/10" : "border-line bg-white"
              }`}
            >
              <QrCode size={22} className="text-accent2-dark" />
              <span className="text-sm font-medium">QRIS</span>
            </button>
          </div>

          {payMethod === "cash" && (
            <div className="mb-2">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setCashReceived(String(p))}
                    className="text-xs font-mono py-2 rounded-lg tabular bg-white border border-line"
                  >
                    {i === 0 ? "Exact" : rp(p).replace("Rp ", "")}
                  </button>
                ))}
              </div>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Cash received"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full font-mono text-lg px-4 py-3 rounded-lg outline-none tabular border border-line bg-white"
              />
              {cashReceived !== "" && cashChange !== null && (
                <div className="flex justify-between mt-3 text-sm font-mono px-1">
                  <span className="text-muted">Change</span>
                  <span className={`font-bold ${cashChange < 0 ? "text-accent2-dark" : "text-accent-dark"}`}>
                    {cashChange < 0 ? "Need " + rp(Math.abs(cashChange)) + " more" : rp(cashChange)}
                  </span>
                </div>
              )}
            </div>
          )}

          {payMethod === "qris" && (
            <div className="flex flex-col items-center py-3">
              <div
                className="w-40 h-40 rounded-lg mb-3 border border-line opacity-85"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #21201D 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, #21201D 0 6px, transparent 6px 12px)",
                  backgroundBlendMode: "multiply",
                  backgroundColor: "#fff",
                }}
              />
              <div className="text-sm text-center text-muted">
                Show this code to the customer&apos;s e-wallet app
              </div>
              <div className="text-xs mt-1 text-muted">
                (placeholder QR — connect a real QRIS provider for production)
              </div>
            </div>
          )}

          <button
            disabled={!canConfirm}
            onClick={onConfirm}
            className={`w-full mt-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 text-paper disabled:opacity-40 ${
              payMethod === "qris" ? "bg-accent2" : "bg-accent"
            }`}
          >
            <Check size={16} />
            {submitting
              ? "Processing…"
              : payMethod === "cash"
              ? "Confirm Cash Payment"
              : payMethod === "qris"
              ? "Payment Received"
              : "Select a payment method"}
          </button>
        </div>
      </div>
    </div>
  );
}
