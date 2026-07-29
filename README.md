# Kopi Turap — Register

Coffee shop POS: browse a live menu by category, build an order ticket,
charge by cash or QRIS, print a receipt (browser or Bluetooth thermal via
RawBT), send orders to a realtime kitchen display, and manage menu/stock/sales
from an admin dashboard.

## Architecture

Two processes:

- **This Next.js app** — register (`/`), kitchen display (`/kitchen`), admin
  dashboard (`/admin`)
- **`server/`** — Express + Socket.IO + Postgres (via Prisma). The one shared
  source of truth for the menu, stock levels, and every sale.

## Run it

**1. Start the backend** (see `server/README.md` for full Postgres setup):
```bash
cd server
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres connection string
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```
Runs on http://localhost:4000.

**2. Start the Next.js app** (project root, separate terminal):
```bash
npm install
cp .env.local.example .env.local
npm run dev
```
- Register: http://localhost:3000
- Kitchen display: http://localhost:3000/kitchen
- Admin dashboard: http://localhost:3000/admin

(Both are also linked from the register's header — they open in a new tab,
meant for a second screen/device.)

**Flow:** admin adds/edits menu items and stock in `/admin` → register reads
the live menu from the server → cashier completes a payment → server creates
the order (assigns the real ticket number, decrements any tracked stock) →
kitchen board updates instantly over Socket.IO → admin's Sales tab reflects it
in the running totals immediately, permanently (orders are never deleted,
only dismissed from the kitchen board via `kitchenCleared`).

## Project structure

```
app/
  layout.tsx           Root layout, loads Fraunces/Inter/JetBrains Mono via next/font
  globals.css          Tailwind layers + print stylesheet
  page.tsx             Register: state machine (order -> pay -> done) + live menu
  kitchen/page.tsx      Kitchen display: realtime board fed by Socket.IO
  admin/page.tsx        Admin dashboard: menu/stock tab + sales tab
components/
  Header.tsx
  ProductGrid.tsx       Category tabs + menu grid (stock-aware)
  CartPanel.tsx         Order ticket / cart sidebar
  PaymentOverlay.tsx    Cash or QRIS checkout
  ReceiptScreen.tsx     Post-payment confirmation + print/new order
  ReceiptLines.tsx      Shared itemized breakdown
  HistoryScreen.tsx     Local receipt history on this register (reprint helper)
  OrderDetailOverlay.tsx  Reopen a locally-saved receipt to view/print again
  PrintableReceipt.tsx  Hidden 80mm-wide layout used for browser print
  kitchen/
    KitchenColumn.tsx     New / In Progress / Completed column
    KitchenOrderCard.tsx  Single order card + action button
  admin/
    MenuManager.tsx   Add/edit/delete menu items, adjust stock tracking
    SalesView.tsx     Today's summary + full sales table
lib/
  types.ts        Shared TypeScript types
  menu.ts         Fixed category list + cash presets (menu items themselves are DB-backed)
  format.ts       Currency formatting + cash rounding helper
  storage.ts      localStorage for this register's local receipt history
  receiptText.ts  Plain-text receipt builder + RawBT (Bluetooth) print trigger
  api.ts          REST client for the backend: menu CRUD, stock, orders
  socket.ts       Shared Socket.IO client for realtime updates
server/           Express + Socket.IO + Prisma/Postgres backend (server/README.md)
```

## Two different "histories" — by design

- **Local receipt history** (`lib/storage.ts`, shown in the register's
  History screen) — per-browser, meant for quickly reprinting a receipt on
  *this* till. Survives a refresh but not a different device.
- **Server sales history** (Postgres, shown in the admin dashboard's Sales
  tab) — the real, permanent record across every register. This is what you
  should trust for actual revenue reporting.

## Notes on remaining shortcuts (by design, for a prototype)

- **QRIS payment is a placeholder** — no real payment gateway wired in yet;
  the cashier taps "Payment Received" to confirm manually. To go live,
  integrate a provider (Midtrans, Xendit, etc.) that generates a real QRIS
  code and confirms payment via webhook.
- **Thermal printing** — "Print to Bluetooth printer" sends the receipt to
  the RawBT Android app over its custom URL scheme (works well for generic
  ESC/POS Bluetooth printers on Android). "Browser print" is a fallback using
  `window.print()` for anything registered as a normal system/network
  printer.
- **No auth yet** — register, kitchen, and admin all talk to the backend
  with no login. Fine for a private prototype on one Wi-Fi network; add auth
  (at minimum, a shared token for `/admin` and `/kitchen`) before exposing
  this publicly.
- **Ticket numbers are server-assigned** — the register shows a "next ticket"
  hint before charging, but the real number comes back from `POST
  /api/orders`. If the server's briefly unreachable, the register falls back
  to a local counter so the till still works — that sale just won't appear on
  the kitchen board or admin dashboard until it's manually reconciled.
