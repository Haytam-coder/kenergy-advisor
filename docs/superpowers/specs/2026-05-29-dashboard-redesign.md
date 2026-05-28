# Dashboard Redesign — Kenergy Advisor

**Date:** 2026-05-29  
**Status:** Approved

## Overview

Redesign the existing single-column dashboard into a professional CRM-style multi-page application with persistent left sidebar navigation, graphical savings visualizations, and fully built-out subpages (Maßnahmen, Förderungen, KI-Berater).

## Design Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Navigation | Left sidebar (~220px) | CRM-style, max vertical content space |
| Charts | KPI tiles + horizontal progress bars | No chart library needed, clean, readable |
| Maßnahmen layout | Compact table list + detail page | Most info density, CRM feel |

## Pages & Routes

```
/dashboard            Übersicht (home)
/massnahmen           Alle Maßnahmen (table + filters)
/massnahmen/[id]      Maßnahme detail
/foerderungen         Förderungen overview
/chat                 KI-Berater chatbot
```

All pages share a common shell layout with the sidebar. The sidebar is rendered via a `DashboardLayout` component wrapping all dashboard routes.

## Shared Layout — Sidebar

- Fixed width: 220px (desktop, ≥768px), icon-only (48px) below 768px
- Styled with existing glass morphism: `var(--card-bg)`, `var(--card-border)`
- Active item: left orange accent bar (`#de6818`) + subtle background highlight
- Contents top-to-bottom:
  - `KENERGY·` logo (links to `/`)
  - Nav items: Übersicht (`/dashboard`), Maßnahmen (`/massnahmen`), Förderungen (`/foerderungen`), KI-Berater (`/chat`)
  - Bottom: ThemeToggle + „Profil zurücksetzen" (clears Supabase session, redirects to `/onboarding`)
- Orb decorations remain fixed behind all content (existing CSS)

## Page: Übersicht (`/dashboard`)

**Row 1 — 3 KPI tiles (grid-cols-3):**
- Sparpotenzial: `bis zu €X / Jahr` in orange Cormorant font
- CO₂-Reduktion: `X kg / Jahr` in green
- Top-Maßnahme Amortisation: `X Jahre` (shortest amortisation in the list)

**Row 2 — 2 Progress-bar cards (grid-cols-2):**
- Jahreskosten: current `€X` → optimised `€Y`, orange progress bar showing `% saved`
- CO₂-Jahresverbrauch: current `X kg` → optimised `Y kg`, green progress bar

**Row 3 — 2 cards (grid-cols-[3fr_2fr]):**
- ProfilKarte (existing component, unchanged)
- FoerderungsBadge (existing component, unchanged)

**Row 4 — Top 3 Maßnahmen horizontal:**
- 3 horizontal cards (not the existing MassnahmenTop3 component — new layout, side by side)
- Each card: category icon, Titel, Ersparnis/Jahr, Förderungs-Badge if applicable
- „Alle Maßnahmen anzeigen →" link to `/massnahmen`

Data loading: identical to current dashboard (load from Supabase, fallback to API, fallback to `buildFallback`).

## Page: Maßnahmen (`/massnahmen`)

**Filter bar (top):**
- Budget filter: alle / bis 500€ / bis 2.000€ / über 2.000€ (reuse existing `BudgetFilter`)
- Kategorie tabs: Alle, Heizung, Dämmung, Solar, Geräte, Verhalten, Tarif, Förderung

**Table list:**
- Each row: category icon, Titel, Kostenschätzung range, Ersparnis/Jahr (orange), Amortisation, Förderungs-Badge (if applicable)
- Rows sorted by `prioritaet` ascending
- Hover: subtle row highlight, cursor pointer
- Click: navigate to `/massnahmen/[id]`

## Page: Maßnahme Detail (`/massnahmen/[id]`)

- Back button → `/massnahmen`
- Titel + Beschreibung (large, full width)
- 3 KPI tiles: Kostenschätzung (min–max), Ersparnis/Jahr, Amortisation in Jahren
- CO₂-Reduktion tile (green) + Äquivalenz-Text (e.g. „= X Autofahrten Frankfurt–Berlin")
- Förderungs-Info section (if `foerderungVerfuegbar === true`): badge + info text
- CTA button: „Handwerker anfragen" (if `kenergy_referral === true`) or „Mehr erfahren"
- Data: read `analyse.massnahmen` from Supabase, find by `id` param

## Page: Förderungen (`/foerderungen`)

- Cards for each programme in `analyse.qualifiziertefoerderungen`
- Mapping from ID → programme info (name, description, funding amount, link) defined in a local `foerderungen-data.ts` file
- Only programmes relevant to the user's profile are shown
- Card layout: programme name, short description, max funding amount, external link button

Known programme IDs from existing code: `kfw-261`, `bafa-beg`, `stromanbieter-wechsel`

## Page: KI-Berater (`/chat`)

- Chat bubble layout: user messages right-aligned, assistant messages left-aligned
- Input bar pinned to bottom with send button (Enter submits)
- On first open: 3 suggestion chips (e.g. „Erkläre meine Top-Maßnahme", „Was bringt mir die meiste Ersparnis?", „Wie beantrage ich Förderung?")
- System prompt: prepend user profile + analysis summary to every conversation
- API route `/api/chat` already exists — wire up to existing endpoint
- Chat history: React state only (no Supabase) — API accepts `{ message, history, profile }` and returns `{ reply }`, history passed with every request
- On mount: empty state with suggestion chips
- If no history: show suggestion chips

## Data & State

- All pages read profile + analysis from Supabase via existing `loadProfile()` / `loadAnalysis()` storage functions
- No new API routes needed (chat API at `/api/chat` already exists, takes `{ message, history, profile }`, returns `{ reply }`)
- No new Supabase tables needed
- Redirect to `/onboarding` from all pages if no profile found

## Design System Constraints

- Fonts: `var(--font-syne-var)` for UI text, `var(--font-cormorant-var)` for hero numbers
- Colors: `#de6818` orange (costs/savings), `#4ade80` green (CO₂), existing CSS vars for everything else
- Cards: `var(--card-bg)` + `var(--card-border)` + `border-radius: 20px` — existing `.card-glass` class
- No external chart library (no Recharts, Chart.js etc.) — all visuals are CSS-only
- Orb background decorations: keep as-is, fixed behind content
- No Tailwind utility classes for layout — use inline styles consistent with existing codebase
