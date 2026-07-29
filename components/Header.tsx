"use client";

import Link from "next/link";
import { Coffee, History as HistoryIcon, ChefHat, LayoutDashboard } from "lucide-react";
import { Stage } from "@/lib/types";
import Image from "next/image";
import LogoImage from "../lgturap_round.png";

export default function Header({
  ticketNo,
  stage,
  onToggleHistory,
}: {
  ticketNo: number;
  stage: Stage;
  onToggleHistory: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-panel text-paper">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-accent">
          <Image src={LogoImage} alt="logo"/>
        </div>
        <div>
          <div className="font-display text-lg leading-tight tracking-wide">Kopi Turap</div>
          <div className="text-xs opacity-60 -mt-0.5">Counter Register</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          target="_blank"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/25"
        >
          <LayoutDashboard size={13} />
          Admin
        </Link>
        <Link
          href="/kitchen"
          target="_blank"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/25"
        >
          <ChefHat size={13} />
          Kitchen display
        </Link>
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/25"
        >
          <HistoryIcon size={13} />
          {stage === "history" ? "Back to register" : "History"}
        </button>
        <div className="text-right text-xs opacity-70 font-mono">
          <div>Ticket #{String(ticketNo).padStart(4, "0")}</div>
          <div>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
