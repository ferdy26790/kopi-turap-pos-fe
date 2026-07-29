import { Order } from "./types";

const HISTORY_KEY = "kopi-lokal-orders";
const TICKET_KEY = "kopi-lokal-next-ticket";
const DEFAULT_TICKET_NO = 231;

// All functions are SSR-safe (Next.js renders on the server first) and
// defensive against storage being unavailable (private browsing, quota, etc).

export function loadHistory(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: Order[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

export function clearHistory(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadTicketNo(): number {
  if (typeof window === "undefined") return DEFAULT_TICKET_NO;
  try {
    const raw = window.localStorage.getItem(TICKET_KEY);
    return raw ? Number(raw) : DEFAULT_TICKET_NO;
  } catch {
    return DEFAULT_TICKET_NO;
  }
}

export function saveTicketNo(n: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(TICKET_KEY, String(n));
    return true;
  } catch {
    return false;
  }
}
