export function rp(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function roundUpTo(amount: number, step: number): number {
  return Math.ceil(amount / step) * step;
}
