export function formatMoney(value: number | null): string {
  if (value == null) return ""
  const formatted = Math.abs(value).toLocaleString("en-US")
  if (value < 0) return `−$${formatted}`
  return `$${formatted}`
}

export type DeltaTone = "positive" | "negative" | "neutral"

export function deltaTone(value: number | null): DeltaTone {
  if (value == null || value === 0) return "neutral"
  return value > 0 ? "positive" : "negative"
}
