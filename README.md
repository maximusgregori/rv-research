# RV Research

Industry RV deal / trade-delta benchmark: new model-year 2026 units under 40 ft; lowest ask (RV Trader + RVT) vs J.D. Power Low Retail × 0.9.

Lowest ask is taken from Make + Model + Year (New, under 40 ft), sorted Price low→high, using the first organic listing that matches the floor plan. Featured/Sponsored listings are ignored; both listing sites are cross-checked and the cheaper qualifying ask is kept. The Floor Plan keyword facet is not the primary gate.

The Coachmen 2026 catalog lists one row per model → floor plan (OTHER omitted). Unpriced rows leave ask, dealer, trade, and delta blank. New catalog work is fifth wheels only (New, 2026, under 40 ft); earlier Coachmen non-fifth-wheel rows remain. East To West fifth-wheel floor plans are listed as blank skeletons.

The table is sortable (click a column header; empty numeric fields sort last) and filterable by manufacturer, year, and model.

## Local development

```bash
npm install
npm test
npm run dev
```

## GitHub Pages

The site is a Vite + React + Tailwind + shadcn/ui app. `npm run build` writes a static bundle to `docs/` and copies it to the repo root so Pages keeps working at `https://maximusgregori.github.io/rv-research/` with the existing **main / (root)** source.

To rebuild the published files after a data or UI change:

```bash
npm run build
```

Then commit the updated `docs/`, `index.html`, and `assets/` output.

Repo **Settings → Pages** can stay:

1. **Deploy from a branch**
2. Branch **main**, folder **/ (root)** — or **/docs**
3. Save.
