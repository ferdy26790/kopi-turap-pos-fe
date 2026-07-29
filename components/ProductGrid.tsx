"use client";

import { Coffee, GlassWater, Cookie } from "lucide-react";
import { CATEGORIES } from "@/lib/menu";
import { rp } from "@/lib/format";
import { Category, CartLine, MenuItem } from "@/lib/types";

const CATEGORY_ICON = {
  Coffee: Coffee,
  "Non-Coffee": GlassWater,
  Snacks: Cookie,
} as const;

export default function ProductGrid({
  menu,
  menuLoading,
  category,
  setCategory,
  cart,
  onAdd,
}: {
  menu: MenuItem[];
  menuLoading: boolean;
  category: Category | "All";
  setCategory: (c: Category | "All") => void;
  cart: CartLine[];
  onAdd: (id: string) => void;
}) {
  const products = category === "All" ? menu : menu.filter((m) => m.category === category);

  return (
    <div className="flex-1 px-6 py-5">
      <div className="flex gap-2 mb-5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              category === cat
                ? "bg-accent border-accent text-paper"
                : "bg-transparent border-line text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {menuLoading ? (
        <div className="text-sm text-muted py-10 text-center">Loading menu…</div>
      ) : products.length === 0 ? (
        <div className="text-sm text-muted py-10 text-center">
          No menu items yet — add some from the admin dashboard.
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          {products.map((item) => {
            const Icon = CATEGORY_ICON[item.category];
            const inCart = cart.find((c) => c.id === item.id);
            const outOfStock = item.stockQty !== null && item.stockQty !== undefined && item.stockQty <= 0;
            return (
              <button
                key={item.id}
                onClick={() => !outOfStock && onAdd(item.id)}
                disabled={outOfStock}
                className={`text-left rounded-xl p-4 relative transition-transform active:scale-95 bg-white border ${
                  outOfStock
                    ? "opacity-40 border-line cursor-not-allowed"
                    : inCart
                    ? "ring-2 ring-accent ring-inset border-transparent"
                    : "border-line"
                }`}
              >
                <Icon size={20} className="text-accent-dark" />
                <div className="mt-3 text-sm font-medium leading-snug">{item.name}</div>
                <div className="mt-1 text-xs font-mono tabular text-muted">{rp(item.price)}</div>
                {outOfStock && (
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-accent2-dark font-semibold">
                    Out of stock
                  </div>
                )}
                {!outOfStock &&
                  typeof item.stockQty === "number" &&
                  item.stockQty <= 5 && (
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-accent2-dark">
                      {item.stockQty} left
                    </div>
                  )}
                {inCart && !outOfStock && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-accent text-paper">
                    {inCart.qty}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
