import { Order } from "./types";
import { rp } from "./format";

// Most 58mm Bluetooth thermal printers print ~32 characters per line in the
// default font. If your printer is 80mm, change this to 48.
export const PRINTER_COLUMNS = 32;

function padRight(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len) : s + " ".repeat(len - s.length);
}

function padLeft(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len) : " ".repeat(len - s.length) + s;
}

function center(s: string, len: number): string {
  if (s.length >= len) return s.slice(0, len);
  const total = len - s.length;
  const left = Math.floor(total / 2);
  return " ".repeat(left) + s + " ".repeat(total - left);
}

function rule(char = "-"): string {
  return char.repeat(PRINTER_COLUMNS);
}

// A label/value row, right-aligning the value. If the label is too long,
// the value wraps to its own right-aligned line instead of overlapping.
function row(label: string, value: string): string {
  const space = PRINTER_COLUMNS - label.length - value.length;
  if (space >= 1) return label + " ".repeat(space) + value;
  return label + "\n" + padLeft(value, PRINTER_COLUMNS);
}

export function buildReceiptText(order: Order): string {
  const time = new Date(order.time);
  const lines: string[] = [];

  lines.push(center("KOPI TURAP", PRINTER_COLUMNS));
  lines.push(center("Jl. Contoh No. 1, Bogor", PRINTER_COLUMNS));
  lines.push(center(`Ticket #${String(order.no).padStart(4, "0")}`, PRINTER_COLUMNS));
  lines.push(center(time.toLocaleString("id-ID"), PRINTER_COLUMNS));
  lines.push(rule("-"));

  order.lines.forEach((l) => {
    lines.push(row(`${l.qty}x ${l.name}`, rp(l.price * l.qty).replace("Rp ", "")));
  });

  lines.push(rule("-"));
  lines.push(row("TOTAL", rp(order.total).replace("Rp ", "")));

  if (order.method === "cash" && order.cashReceived !== null) {
    lines.push(row("Cash", rp(order.cashReceived).replace("Rp ", "")));
    lines.push(row("Change", rp(order.cashReceived - order.total).replace("Rp ", "")));
  } else {
    lines.push(center("Paid via QRIS", PRINTER_COLUMNS));
  }

  lines.push(rule("-"));
  lines.push(center("Thank you, come again!", PRINTER_COLUMNS));
  lines.push("");
  lines.push("");
  lines.push("");

  return lines.join("\n");
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

// Sends the receipt straight to the RawBT app, which relays it as raw
// ESC/POS bytes to whatever thermal printer is paired to it over Bluetooth.
// Requires the RawBT app installed & the printer paired inside RawBT first.
export function printViaRawBT(order: Order) {
  const text = buildReceiptText(order);
  const b64 = utf8ToBase64(text);
  window.location.href = "rawbt:base64," + b64;
}
