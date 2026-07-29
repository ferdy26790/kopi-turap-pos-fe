import { Category } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ---------------------------------------------------------------------------
// Menu + stock
// ---------------------------------------------------------------------------

export interface MenuItemDTO {
  id: string;
  name: string;
  price: number;
  category: Category;
  stockQty: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchMenu(): Promise<MenuItemDTO[]> {
  try {
    const res = await fetch(`${API_URL}/api/menu`);
    if (!res.ok) return [];
    return (await res.json()) as MenuItemDTO[];
  } catch (e) {
    console.warn("Could not reach server for menu:", e);
    return [];
  }
}

export async function createMenuItem(data: {
  name: string;
  price: number;
  category: Category;
  stockQty?: number | null;
}): Promise<MenuItemDTO | null> {
  try {
    const res = await fetch(`${API_URL}/api/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return (await res.json()) as MenuItemDTO;
  } catch (e) {
    console.warn("Could not create menu item:", e);
    return null;
  }
}

export async function updateMenuItem(
  id: string,
  data: Partial<{ name: string; price: number; category: Category; stockQty: number | null; active: boolean }>
): Promise<MenuItemDTO | null> {
  try {
    const res = await fetch(`${API_URL}/api/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return (await res.json()) as MenuItemDTO;
  } catch (e) {
    console.warn("Could not update menu item:", e);
    return null;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/menu/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    console.warn("Could not delete menu item:", e);
    return false;
  }
}

export async function adjustMenuStock(
  id: string,
  payload: { delta?: number; stockQty?: number }
): Promise<MenuItemDTO | null> {
  try {
    const res = await fetch(`${API_URL}/api/menu/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as MenuItemDTO;
  } catch (e) {
    console.warn("Could not adjust stock:", e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type OrderStatus = "new" | "in_progress" | "ready_to_pick_up" | "completed";

export interface OrderItemDTO {
  id: number;
  name: string;
  price: number;
  qty: number;
  menuItemId: string | null;
}

export interface OrderDTO {
  id: number;
  items: OrderItemDTO[];
  total: number;
  method: "cash" | "qris";
  status: OrderStatus;
  kitchenCleared: boolean;
  createdAt: string;
  updatedAt: string;
}

// Creates the order server-side (this is the real, shared source of truth
// now) and returns it with the server-assigned id. Returns null if the
// server is unreachable — the caller decides how to fall back.
export async function createOrder(payload: {
  items: { name: string; price: number; qty: number; menuItemId?: string }[];
  total: number;
  method: "cash" | "qris";
  time: string;
}): Promise<OrderDTO | null> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as OrderDTO;
  } catch (e) {
    console.warn("Could not reach server to create order:", e);
    return null;
  }
}

export async function fetchOrders(): Promise<OrderDTO[]> {
  try {
    const res = await fetch(`${API_URL}/api/orders`);
    if (!res.ok) return [];
    return (await res.json()) as OrderDTO[];
  } catch (e) {
    console.warn("Could not reach server for orders:", e);
    return [];
  }
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    console.warn("Could not update order status:", e);
    return false;
  }
}

export async function clearCompletedOrders(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/orders/clear-completed`, { method: "PATCH" });
    return res.ok;
  } catch (e) {
    console.warn("Could not clear completed orders:", e);
    return false;
  }
}
