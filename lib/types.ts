export type Category = "Coffee" | "Non-Coffee" | "Snacks";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  stockQty?: number | null; // null/undefined = not tracked (unlimited)
  active?: boolean;
}

export interface CartLine extends MenuItem {
  qty: number;
}

export type PaymentMethod = "cash" | "qris";

export interface Order {
  no: number;
  lines: CartLine[];
  total: number;
  method: PaymentMethod;
  cashReceived: number | null;
  time: string; // ISO timestamp
}

export type Stage = "order" | "pay" | "done" | "history";
