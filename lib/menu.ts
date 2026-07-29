import { Category } from "./types";

// Categories stay a fixed set for simplicity — the admin dashboard assigns
// each menu item to one of these rather than managing categories separately.
export const CATEGORIES: Array<Category | "All"> = ["All", "Coffee", "Non-Coffee", "Snacks"];

export const CASH_PRESETS = [5000, 10000, 20000, 50000, 100000];
