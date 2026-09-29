import dealsJson from "@/data/deals.json"

export type NoteSpan =
  | { type: "text"; text: string }
  | { type: "link"; href: string; label: string }

export type Deal = {
  year: number
  manufacturer: string
  model: string
  floor: string
  ask: number | null
  dealer: string
  trade: number | null
  delta: number | null
  notes: NoteSpan[][]
}

export type FilterState = {
  manufacturer: string
  year: string
  model: string
}

export type SortKey =
  | "year"
  | "manufacturer"
  | "model"
  | "floor"
  | "ask"
  | "trade"
  | "delta"

export type SortDir = "asc" | "desc"

export const EMPTY_FILTERS: FilterState = {
  manufacturer: "",
  year: "",
  model: "",
}

export const DEFAULT_SORT_KEY: SortKey = "delta"
export const DEFAULT_SORT_DIR: SortDir = "asc"

const NUMERIC: Record<string, boolean> = {
  year: true,
  ask: true,
  trade: true,
  delta: true,
}

export const deals = dealsJson as Deal[]

export function matching(
  rows: Deal[],
  filters: FilterState,
  ignore?: keyof FilterState
): Deal[] {
  const year = ignore === "year" ? "" : filters.year
  const manufacturer = ignore === "manufacturer" ? "" : filters.manufacturer
  const model = ignore === "model" ? "" : filters.model
  return rows.filter((deal) => {
    if (year && String(deal.year) !== year) return false
    if (manufacturer && deal.manufacturer !== manufacturer) return false
    if (model && deal.model !== model) return false
    return true
  })
}

export function uniqueValues(
  rows: Deal[],
  key: "manufacturer" | "year" | "model"
): string[] {
  const seen: Record<string, boolean> = {}
  const out: string[] = []
  for (const row of rows) {
    const value = String(row[key])
    if (value && !seen[value]) {
      seen[value] = true
      out.push(value)
    }
  }
  out.sort((a, b) => (NUMERIC[key] ? Number(a) - Number(b) : a.localeCompare(b)))
  return out
}

export function filterOptions(rows: Deal[], filters: FilterState) {
  return {
    manufacturer: uniqueValues(
      matching(rows, filters, "manufacturer"),
      "manufacturer"
    ),
    year: uniqueValues(matching(rows, filters, "year"), "year"),
    model: uniqueValues(matching(rows, filters, "model"), "model"),
  }
}

export function coerceFilters(
  filters: FilterState,
  options: ReturnType<typeof filterOptions>
): FilterState {
  return {
    manufacturer: options.manufacturer.includes(filters.manufacturer)
      ? filters.manufacturer
      : "",
    year: options.year.includes(filters.year) ? filters.year : "",
    model: options.model.includes(filters.model) ? filters.model : "",
  }
}

function numericValue(row: Deal, key: SortKey): number | null {
  if (key === "year") return row.year
  if (key === "ask") return row.ask
  if (key === "trade") return row.trade
  if (key === "delta") return row.delta
  return null
}

function stringValue(row: Deal, key: SortKey): string {
  if (key === "manufacturer") return row.manufacturer
  if (key === "model") return row.model
  if (key === "floor") return row.floor
  return ""
}

export function compareDeals(
  a: Deal,
  b: Deal,
  sortKey: SortKey,
  sortDir: SortDir
): number {
  const dir = sortDir === "asc" ? 1 : -1
  if (NUMERIC[sortKey]) {
    const av = numericValue(a, sortKey)
    const bv = numericValue(b, sortKey)
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (av === bv) return 0
    return av < bv ? -dir : dir
  }
  return stringValue(a, sortKey).localeCompare(stringValue(b, sortKey)) * dir
}

export function visibleDeals(
  rows: Deal[],
  filters: FilterState,
  sortKey: SortKey,
  sortDir: SortDir
): Deal[] {
  return matching(rows, filters)
    .slice()
    .sort((a, b) => compareDeals(a, b, sortKey, sortDir))
}

export function nextSort(
  currentKey: SortKey,
  currentDir: SortDir,
  nextKey: SortKey
): { key: SortKey; dir: SortDir } {
  if (currentKey === nextKey) {
    return { key: currentKey, dir: currentDir === "asc" ? "desc" : "asc" }
  }
  return { key: nextKey, dir: "asc" }
}

export function dealKey(deal: Deal): string {
  return `${deal.year}|${deal.manufacturer}|${deal.model}|${deal.floor}`
}
