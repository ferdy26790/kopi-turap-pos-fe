"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { rp } from "@/lib/format";
import {
  MenuItemDTO,
  fetchMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/api";
import { Category } from "@/lib/types";

const CATEGORY_OPTIONS: Category[] = ["Coffee", "Non-Coffee", "Snacks"];

type Draft = {
  name: string;
  price: string;
  category: Category;
  trackStock: boolean;
  stockQty: string;
};

function toDraft(item: MenuItemDTO): Draft {
  return {
    name: item.name,
    price: String(item.price),
    category: item.category as Category,
    trackStock: item.stockQty !== null,
    stockQty: item.stockQty !== null ? String(item.stockQty) : "",
  };
}

export default function MenuManager() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Draft>({
    name: "",
    price: "",
    category: "Coffee",
    trackStock: false,
    stockQty: "",
  });
  const [adding, setAdding] = useState(false);

  async function reload() {
    setLoading(true);
    const menu = await fetchMenu();
    setItems(menu);
    setDrafts(Object.fromEntries(menu.map((m) => [m.id, toDraft(m)])));
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function handleSave(id: string) {
    const d = drafts[id];
    if (!d) return;
    setSavingId(id);
    await updateMenuItem(id, {
      name: d.name,
      price: Number(d.price) || 0,
      category: d.category,
      stockQty: d.trackStock ? Number(d.stockQty) || 0 : null,
    });
    await reload();
    setSavingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item? This can't be undone.")) return;
    setSavingId(id);
    await deleteMenuItem(id);
    await reload();
    setSavingId(null);
  }

  async function handleAdd() {
    if (!newItem.name.trim() || !newItem.price) return;
    setAdding(true);
    await createMenuItem({
      name: newItem.name.trim(),
      price: Number(newItem.price) || 0,
      category: newItem.category,
      stockQty: newItem.trackStock ? Number(newItem.stockQty) || 0 : null,
    });
    setNewItem({ name: "", price: "", category: "Coffee", trackStock: false, stockQty: "" });
    await reload();
    setAdding(false);
  }

  return (
    <div className="font-body">
      {/* Add new item */}
      <div className="bg-white rounded-xl border border-line p-4 mb-6">
        <div className="text-sm font-semibold mb-3">Add menu item</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <div className="col-span-2 md:col-span-1">
            <label className="text-xs text-muted block mb-1">Name</label>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-line text-sm"
              placeholder="e.g. Iced Latte"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Price (Rp)</label>
            <input
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-line text-sm"
              placeholder="25000"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Category</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as Category }))}
              className="w-full px-3 py-2 rounded-lg border border-line text-sm"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1 flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={newItem.trackStock}
                onChange={(e) => setNewItem((p) => ({ ...p, trackStock: e.target.checked }))}
              />
              Track stock
            </label>
            <input
              type="number"
              disabled={!newItem.trackStock}
              value={newItem.stockQty}
              onChange={(e) => setNewItem((p) => ({ ...p, stockQty: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-line text-sm disabled:opacity-40"
              placeholder="Qty"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={adding || !newItem.name.trim() || !newItem.price}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-paper text-sm font-semibold disabled:opacity-40"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Existing items */}
      {loading ? (
        <div className="text-sm text-muted">Loading menu…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-muted text-center py-10 border border-dashed border-line rounded-xl">
          No menu items yet — add one above.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const d = drafts[item.id];
            if (!d) return null;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-line p-3">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-muted block mb-1">Name</label>
                    <input
                      value={d.name}
                      onChange={(e) => updateDraft(item.id, { name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-line text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Price</label>
                    <input
                      type="number"
                      value={d.price}
                      onChange={(e) => updateDraft(item.id, { price: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-line text-sm"
                    />
                    <div className="text-[11px] text-muted mt-0.5">{rp(Number(d.price) || 0)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Category</label>
                    <select
                      value={d.category}
                      onChange={(e) => updateDraft(item.id, { category: e.target.value as Category })}
                      className="w-full px-3 py-2 rounded-lg border border-line text-sm"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1 flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={d.trackStock}
                        onChange={(e) => updateDraft(item.id, { trackStock: e.target.checked })}
                      />
                      Track stock
                    </label>
                    <input
                      type="number"
                      disabled={!d.trackStock}
                      value={d.stockQty}
                      onChange={(e) => updateDraft(item.id, { stockQty: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-line text-sm disabled:opacity-40"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div className="flex gap-2 col-span-2 md:col-span-2">
                    <button
                      onClick={() => handleSave(item.id)}
                      disabled={savingId === item.id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-panel text-paper text-sm font-semibold disabled:opacity-40"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={savingId === item.id}
                      className="px-3 py-2 rounded-lg border border-line text-accent2-dark disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
