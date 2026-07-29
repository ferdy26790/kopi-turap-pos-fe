"use client";

import { useState } from "react";
import { LayoutDashboard, Coffee, BarChart3 } from "lucide-react";
import MenuManager from "@/components/admin/MenuManager";
import SalesView from "@/components/admin/SalesView";

type Tab = "menu" | "sales";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("menu");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-6 py-4 bg-panel text-paper">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} />
          <div className="font-display text-lg">Admin Dashboard</div>
        </div>
      </header>

      <div className="px-6 pt-5">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("menu")}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border font-body ${
              tab === "menu" ? "bg-accent border-accent text-paper" : "bg-transparent border-line"
            }`}
          >
            <Coffee size={14} />
            Menu &amp; Stock
          </button>
          <button
            onClick={() => setTab("sales")}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border font-body ${
              tab === "sales" ? "bg-accent border-accent text-paper" : "bg-transparent border-line"
            }`}
          >
            <BarChart3 size={14} />
            Sales
          </button>
        </div>

        <div className="pb-10">{tab === "menu" ? <MenuManager /> : <SalesView />}</div>
      </div>
    </div>
  );
}
