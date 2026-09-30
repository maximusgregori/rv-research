import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  SearchIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  coerceFilters,
  deals,
  dealKey,
  DEFAULT_SORT_DIR,
  DEFAULT_SORT_KEY,
  EMPTY_FILTERS,
  filterOptions,
  nextSort,
  visibleDeals,
  type FilterState,
  type NoteSpan,
  type SortDir,
  type SortKey,
} from "@/lib/deals"
import { deltaTone, formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

const SORTABLE: { key: SortKey; label: string }[] = [
  { key: "year", label: "Year" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "model", label: "Model" },
  { key: "floor", label: "Floor plan" },
  { key: "ask", label: "Lowest ask" },
  { key: "trade", label: "Trade value" },
  { key: "delta", label: "Delta" },
]

function SortIcon({
  active,
  direction,
}: {
  active: boolean
  direction: SortDir
}) {
  if (!active) {
    return <ChevronsUpDownIcon data-icon="inline-end" />
  }
  if (direction === "asc") {
    return <ArrowUpIcon data-icon="inline-end" />
  }
  return <ArrowDownIcon data-icon="inline-end" />
}

function NoteSpans({ spans }: { spans: NoteSpan[] }) {
  return (
    <>
      {spans.map((span, index) =>
        span.type === "link" ? (
          <a key={`${span.href}-${index}`} href={span.href}>
            {span.label}
          </a>
        ) : (
          <span key={`${span.text}-${index}`}>{span.text}</span>
        )
      )}
    </>
  )
}

const DELTA_VARIANT = {
  positive: "success",
  negative: "destructive",
  neutral: "secondary",
} as const

function DeltaCell({ value }: { value: number | null }) {
  if (value == null) return null
  return (
    <Badge variant={DELTA_VARIANT[deltaTone(value)]} className="tabular-nums">
      {formatMoney(value)}
    </Badge>
  )
}

export function App() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_SORT_KEY)
  const [sortDir, setSortDir] = useState<SortDir>(DEFAULT_SORT_DIR)

  const options = useMemo(() => filterOptions(deals, filters), [filters])
  const rows = useMemo(
    () => visibleDeals(deals, filters, sortKey, sortDir, search),
    [filters, search, sortKey, sortDir]
  )

  function updateFilter(key: keyof FilterState, value: string) {
    const next = { ...filters, [key]: value }
    setFilters(coerceFilters(next, filterOptions(deals, next)))
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
    setSearch("")
  }

  function onSort(key: SortKey) {
    const next = nextSort(sortKey, sortDir, key)
    setSortKey(next.key)
    setSortDir(next.dir)
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 xl:max-w-[90rem]">
        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">
            RV Research
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            Industry RV trade-delta benchmark: lowest published ask versus trade
            value,
            <br />
            one row per manufacturer → model → floor plan.
          </p>
        </header>

        <Accordion type="single" collapsible>
          <AccordionItem
            value="methodology"
            className="rounded-xl border bg-card px-4"
          >
            <AccordionTrigger
              id="method-heading"
              className="font-heading text-sm hover:no-underline"
            >
              Methodology
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted-foreground">
                <li>
                  Listing sources:{" "}
                  <a href="https://www.rvtrader.com">rvtrader.com</a> and{" "}
                  <a href="https://www.rvt.com">rvt.com</a>
                </li>
                <li>
                  Industry research filters: New, model year 2026, length under
                  40 ft
                </li>
                <li>
                  Lowest ask: filter Make + Model + Year, sort Price low→high,
                  then take the first organic listing that matches the floor
                  plan. Ignore Featured/Sponsored. Do not use the Floor Plan
                  keyword facet as the primary gate.
                </li>
                <li>
                  Cross-check both listing sites and keep the cheaper qualifying
                  ask.
                </li>
                <li>Trade value = J.D. Power Low Retail × 0.9</li>
                <li>Delta = lowest ask − trade</li>
                <li>
                  Default sort: smallest delta first. Empty numeric fields sort
                  last. Click a column header to change sort.
                </li>
                <li>
                  One row per manufacturer → model → floor plan. Coachmen, East
                  To West, Forest River, and Jayco 2026 floor plans from RV
                  Trader facets are listed; OTHER buckets (no floor plans) are
                  omitted.
                  Ask, dealer, trade, and delta stay blank until a lowest ask is
                  recorded.
                </li>
                <li>
                  New catalog work is fifth wheels only (New, 2026, under 40
                  ft). Earlier Coachmen non-fifth-wheel rows remain on the
                  table.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <form
          className="flex flex-col gap-3"
          aria-label="Table filters"
          onSubmit={(event) => event.preventDefault()}
          onReset={resetFilters}
        >
          <FieldGroup className="flex-row flex-wrap items-end gap-3">
            <Field className="w-56">
              <FieldLabel htmlFor="filter-manufacturer">
                Manufacturer
              </FieldLabel>
              <NativeSelect
                id="filter-manufacturer"
                name="manufacturer"
                className="w-full"
                value={filters.manufacturer}
                onChange={(event) =>
                  updateFilter("manufacturer", event.target.value)
                }
              >
                <NativeSelectOption value="">All</NativeSelectOption>
                {options.manufacturer.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field className="w-32">
              <FieldLabel htmlFor="filter-year">Year</FieldLabel>
              <NativeSelect
                id="filter-year"
                name="year"
                className="w-full"
                value={filters.year}
                onChange={(event) => updateFilter("year", event.target.value)}
              >
                <NativeSelectOption value="">All</NativeSelectOption>
                {options.year.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field className="w-64">
              <FieldLabel htmlFor="filter-model">Model</FieldLabel>
              <NativeSelect
                id="filter-model"
                name="model"
                className="w-full"
                value={filters.model}
                onChange={(event) => updateFilter("model", event.target.value)}
              >
                <NativeSelectOption value="">All</NativeSelectOption>
                {options.model.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Button type="reset" variant="outline">
              Reset filters
            </Button>
            <p
              className="text-sm text-muted-foreground"
              id="filter-status"
              aria-live="polite"
            >
              Showing {rows.length} of {deals.length} rows
            </p>
            <Field className="w-full min-w-56 sm:ml-auto sm:w-80">
              <FieldLabel htmlFor="filter-search">Search</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="filter-search"
                  type="search"
                  name="search"
                  placeholder="Search make, model, floor plan…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-controls="deals"
                />
              </InputGroup>
            </Field>
          </FieldGroup>
        </form>

        <div className="overflow-hidden rounded-md border bg-card">
          <Table id="deals">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {SORTABLE.slice(0, 5).map((column) => (
                  <TableHead
                    key={column.key}
                    aria-sort={
                      sortKey === column.key
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      <SortIcon
                        active={sortKey === column.key}
                        direction={sortDir}
                      />
                    </Button>
                  </TableHead>
                ))}
                <TableHead>Dealer</TableHead>
                {SORTABLE.slice(5).map((column) => (
                  <TableHead
                    key={column.key}
                    aria-sort={
                      sortKey === column.key
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      <SortIcon
                        active={sortKey === column.key}
                        direction={sortDir}
                      />
                    </Button>
                  </TableHead>
                ))}
                <TableHead>Notes/Links</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((deal, index) => (
                <TableRow
                  key={dealKey(deal)}
                  className={cn(index % 2 === 1 && "bg-muted/40")}
                >
                  <TableCell className="w-[1%]">{deal.year}</TableCell>
                  <TableCell className="w-[1%]">{deal.manufacturer}</TableCell>
                  <TableCell className="w-[1%]">{deal.model}</TableCell>
                  <TableCell className="w-[1%]">{deal.floor}</TableCell>
                  <TableCell className="w-[1%] tabular-nums">
                    {formatMoney(deal.ask)}
                  </TableCell>
                  <TableCell className="w-[1%]">{deal.dealer}</TableCell>
                  <TableCell className="w-[1%] tabular-nums">
                    {formatMoney(deal.trade)}
                  </TableCell>
                  <TableCell className="w-[1%]">
                    <DeltaCell value={deal.delta} />
                  </TableCell>
                  <TableCell className="min-w-52 whitespace-normal text-muted-foreground">
                    {deal.notes.length > 0 ? (
                      <div className="flex max-w-sm flex-col gap-1.5">
                        {deal.notes.map((paragraph, paragraphIndex) => (
                          <p key={`${dealKey(deal)}-note-${paragraphIndex}`}>
                            <NoteSpans spans={paragraph} />
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <footer className="text-sm text-muted-foreground">
          Data as of 2026-09-29.
        </footer>
      </main>
    </div>
  )
}

export default App
