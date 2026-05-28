# Kenergy Advisor ⚡

Personalisierter KI-Energieberater für deutsche Haushalte – gebaut beim LAUNCH Rhein-Main Build Days 2026.

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/Haytam-coder/kenergy-advisor.git
cd kenergy-advisor
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen

```bash
cp .env.example .env.local
```

Trage deinen Anthropic API Key in `.env.local` ein:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft unter [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude API** (`claude-sonnet-4-5` für Analyse, `claude-haiku-4-5-20251001` für Chat)
- **Daten:** TABULA/EPISCOPE Gebäudearchetypen, Bright Sky API (Wetterdaten)

## Features

- 6-stufiger Onboarding-Flow (Mieter/Eigentümer, Gebäudedaten, Energie & Kosten)
- Automatische TABULA-Gebäudeanalyse nach PLZ + Baujahr
- Stromrechnung-Upload mit Claude Vision (kWh-Extraktion)
- Personalisierter KI-Energiesparplan nach Abschluss
- Dashboard mit Sparpotenzial und Top-Maßnahmen
- Alles lokal im Browser (localStorage, kein Backend/Login nötig)

## Projektstruktur

```
src/
  app/
    page.tsx                    # Landing Page
    onboarding/
      page.tsx                  # Onboarding Flow (State Management)
      components/               # Step1–Step6, Step5A–D, ProgressBar
    dashboard/page.tsx          # Ergebnis-Dashboard
    api/
      analyze/route.ts          # Claude Sonnet – Vollanalyse
      chat/route.ts             # Claude Haiku – Chatbot
      extract-bill/route.ts     # Claude Vision – Stromrechnung
      brightsky/route.ts        # Wetterdaten via Nominatim
  lib/
    types.ts                    # UserProfile, Massnahme, AnalyseResult
    localStorage.ts             # Persistenz-Helpers
    tabula.ts                   # TABULA-Datenlookup
data/
  tabula.json                   # TABULA Gebäudearchetypen
  foerderungen.json             # KfW/BAFA Förderprogramme
```
