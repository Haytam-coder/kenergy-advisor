# Claude Code Briefing – Kenergy Solutions Hackathon
## KI-Energieberater Web App

---

## 1. PROJEKTÜBERSICHT

Baue eine Web App namens **Kenergy Advisor** – einen personalisierten KI-Energieberater für deutsche Haushalte. Ziel: Nutzern zeigen, welche konkreten Möglichkeiten sie haben, Energie zu sparen und die Umwelt zu schonen – basierend auf ihren individuellen Gebäudedaten.

**Kernprinzip:** Kein Formular ausfüllen und warten. Sofortige, personalisierte Antworten. Der User gibt seine Daten ein, die KI analysiert und liefert direkt einen individuellen Plan.

---

## 2. TECH STACK

- **Framework:** Next.js 14 (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS (Design kommt separat – baue zunächst funktionale UI)
- **KI:** Anthropic Claude API (`claude-sonnet-4-5` für Analyse, `claude-haiku-4-5-20251001` für Chatbot)
- **State Management:** React Context + localStorage (kein Backend/DB nötig für MVP)
- **PDF-Verarbeitung:** Claude API Vision (Stromrechnung-Upload)
- **Package Manager:** npm

### Externe APIs & Datenquellen:
| Quelle | Zweck | URL |
|---|---|---|
| Bright Sky API | Wetterdaten, Sonnenstunden, Heizgradtage nach PLZ | brightsky.dev |
| TABULA/EPISCOPE | Gebäudetypen, U-Werte, Heizenergiebedarf nach Archetyp | episcope.eu |
| ETHOS.BUILDA | Alle deutschen Wohngebäude: Baujahr, Größe, Sanierungszustand | zenodo.org/records/12069755 |
| KfW / BAFA | Förderprogramme (als statische Wissensbasis in der KI) | kfw.de / bafa.de |

---

## 3. APP-STRUKTUR

```
/                    → Landing Page (kurz, direkt zum Onboarding)
/onboarding          → Multi-Step Onboarding Flow
/dashboard           → Haupt-Dashboard nach Onboarding
/massnahmen          → Detaillierter Maßnahmenplan
/foerderungen        → Passende Förderprogramme
/chat                → KI-Chatbot
```

---

## 4. ONBOARDING FLOW (DETAILLIERT)

Der Onboarding-Flow ist das Herzstück der App. Er sammelt alle Nutzerdaten für die KI-Personalisierung. 6 Seiten, immer mit Fortschrittsbalken oben.

### Datenmodell – User Profile
```typescript
interface UserProfile {
  // Seite 1
  userType: 'mieter' | 'eigentuemer';
  propertyType: 'haus' | 'wohnung';
  goal: 'geld' | 'umwelt' | 'beides';
  
  // Seite 2
  plz: string;
  baujahr: 'vor1970' | '1970-1990' | '1990-2010' | 'nach2010';
  wohnflaeche: number;
  personen: 1 | 2 | 3 | 4;
  
  // Seite 3 (auto-befüllt + Bestätigung)
  tabulaArchetype: string;         // aus ETHOS.BUILDA
  heizenergiebedarfKwh: number;   // aus TABULA
  daemmzustand: string;           // aus TABULA
  energieeffizienzklasse: string; // aus TABULA
  bereitsсанiert: 'ja' | 'nein' | 'weiss_nicht';
  
  // Seite 4
  heizungstyp: 'gas' | 'oel' | 'fernwaerme' | 'waermepumpe' | 'nachtspeicher' | 'pellets';
  warmwasser: 'heizung' | 'elektrisch' | 'solar';
  monatlicheKosten: number;
  stromverbrauchKwh?: number;     // optional, aus Rechnung extrahiert
  
  // Seite 5 (je nach Typ)
  // Eigentümer Haus:
  dachausrichtung?: 'sued' | 'ost_west' | 'nord' | 'weiss_nicht';
  solarVorhanden?: boolean;
  sanierenGeplant?: 'ja' | 'nein' | 'unsicher';
  // Eigentümer Wohnung:
  eigeneHeizungsregelung?: boolean;
  hausverwaltungAktiv?: boolean;
  verbesserungenGeplant?: 'ja' | 'nein' | 'unsicher';
  // Mieter (Haus & Wohnung):
  heizungSelbstRegelbar?: boolean;
  stromanbietterGewechselt?: boolean;
  vermieterkontakt?: 'regelmaessig' | 'selten' | 'nie';
  
  // Seite 6
  gerateAlter: 'unter5' | '5bis10' | 'ueber10';
  ledBeleuchtung: 'ja' | 'teilweise' | 'nein';
  wohndauer: 'unter2' | '2bis5' | 'langfristig';
  foerderungenBeantragt: 'ja' | 'nein' | 'weiss_nicht';
}
```

### Seite 1 – Wer bist du?
**Felder:**
- Mieter oder Eigentümer? → 2 große Auswahl-Karten
- Haus oder Wohnung? → 2 Auswahl-Karten
- Hauptziel → 3 Auswahl-Karten: "Geld sparen", "Umwelt schonen", "Beides"

### Seite 2 – Dein Gebäude
**Felder:**
- PLZ (Texteingabe, 5 Ziffern validieren)
- Baujahr (4 Auswahl-Buttons: vor 1970 / 1970–1990 / 1990–2010 / nach 2010)
- Wohnfläche m² (Number-Input)
- Personen im Haushalt (1 / 2 / 3 / 4+)

**Nach Eingabe automatisch im Hintergrund:**
1. Bright Sky API → Sonnenstunden/Jahr und Heizgradtage für die PLZ
2. TABULA-Lookup → basierend auf `propertyType` + `baujahr` den passenden Archetypen laden
3. Heizenergiebedarf, U-Werte, Dämmzustand, Energieeffizienzklasse aus TABULA-Daten ableiten

**TABULA Mapping (als statische JSON-Datei `data/tabula.json` anlegen):**
```json
{
  "SFH": {
    "vor1970": { "heizenergiebedarfKwh": 230, "daemmzustand": "ungedämmt", "energieeffizienzklasse": "H", "uWertWand": 1.4, "uWertDach": 0.9, "uWertFenster": 2.8 },
    "1970-1990": { "heizenergiebedarfKwh": 180, "daemmzustand": "gering gedämmt", "energieeffizienzklasse": "F", "uWertWand": 0.9, "uWertDach": 0.5, "uWertFenster": 2.6 },
    "1990-2010": { "heizenergiebedarfKwh": 120, "daemmzustand": "mittel gedämmt", "energieeffizienzklasse": "D", "uWertWand": 0.5, "uWertDach": 0.3, "uWertFenster": 1.8 },
    "nach2010":  { "heizenergiebedarfKwh": 60,  "daemmzustand": "gut gedämmt",   "energieeffizienzklasse": "B", "uWertWand": 0.25,"uWertDach": 0.2, "uWertFenster": 1.1 }
  },
  "MFH": {
    "vor1970": { "heizenergiebedarfKwh": 210, "daemmzustand": "ungedämmt", "energieeffizienzklasse": "G", "uWertWand": 1.3, "uWertDach": 0.8, "uWertFenster": 2.8 },
    "1970-1990": { "heizenergiebedarfKwh": 165, "daemmzustand": "gering gedämmt", "energieeffizienzklasse": "E", "uWertWand": 0.8, "uWertDach": 0.45, "uWertFenster": 2.5 },
    "1990-2010": { "heizenergiebedarfKwh": 110, "daemmzustand": "mittel gedämmt", "energieeffizienzklasse": "C", "uWertWand": 0.45,"uWertDach": 0.25,"uWertFenster": 1.6 },
    "nach2010":  { "heizenergiebedarfKwh": 55,  "daemmzustand": "gut gedämmt",   "energieeffizienzklasse": "A", "uWertWand": 0.22,"uWertDach": 0.18,"uWertFenster": 1.0 }
  }
}
```
*(SFH = Einfamilienhaus/Haus, MFH = Mehrfamilienhaus/Wohnung)*

### Seite 3 – Bestätigung der Gebäudedaten
Zeige die automatisch ermittelten Daten als Read-only Info-Karten:
- "Gebäudetyp: Einfamilienhaus (Baujahr 1975)"
- "Heizenergiebedarf: ~180 kWh/m²/Jahr"
- "Dämmzustand: gering gedämmt"
- "Energieeffizienzklasse: F"

**Einzige Frage:** "Wurde dein Gebäude bereits teilsaniert?" → Ja, teilweise / Nein / Weiß nicht
*(Falls "Ja": Heizenergiebedarf um 20% reduzieren als Schätzung)*

### Seite 4 – Energie & Kosten
**Felder:**
- Heizungstyp → 6 Auswahl-Karten mit Icons
- Warmwasserbereitung → 3 Auswahl-Karten
- Monatliche Energiekosten → Schieberegler €50–€500 (Schritte €10)
- Stromrechnung hochladen (optional) → Button öffnet File-Upload, akzeptiert PDF/JPG/PNG
  - Bei Upload: Claude API Vision extrahiert kWh/Jahr und Jahreskosten aus der Rechnung
  - Extrahierte Werte werden als `stromverbrauchKwh` gespeichert

### Seite 5 – Gebäudespezifisch (4 Varianten)

**5A – Eigentümer Haus** (propertyType === 'haus' && userType === 'eigentuemer'):
- Dachausrichtung → 4 Auswahl-Buttons
- Solaranlage vorhanden? → Ja / Nein
- In den nächsten 2 Jahren sanieren geplant? → Ja / Nein / Noch unsicher

**5B – Eigentümer Wohnung** (propertyType === 'wohnung' && userType === 'eigentuemer'):
- Eigene Heizungsregelung? → Ja / Nein
- Aktive Hausverwaltung? → Ja / Nein / Weiß nicht
- Verbesserungen geplant? → Ja / Nein / Noch unsicher

**5C – Mieter Haus** (propertyType === 'haus' && userType === 'mieter'):
- Heiztemperatur selbst regulierbar? → Ja / Nein
- Stromanbieter schon mal gewechselt? → Ja / Nein
- Kontakt zum Vermieter? → Regelmäßig / Selten / Nie

**5D – Mieter Wohnung** (propertyType === 'wohnung' && userType === 'mieter'):
- Heiztemperatur selbst regulierbar? → Ja / Nein
- Stromanbieter schon mal gewechselt? → Ja / Nein
- Kontakt zum Vermieter? → Regelmäßig / Selten / Nie

### Seite 6 – Fast fertig!
**Felder (alle):**
- Alter Hauptgeräte (Kühlschrank & Waschmaschine) → unter 5 Jahre / 5–10 Jahre / über 10 Jahre
- LED-Beleuchtung? → Ja / Teilweise / Nein
- Wie lange planst du noch hier zu wohnen? → unter 2 Jahre / 2–5 Jahre / langfristig
- Förderungen schon mal beantragt? → Ja / Nein / Weiß nicht

**Nach Absenden:**
1. UserProfile in localStorage speichern
2. Claude API aufrufen für initiale Analyse (siehe Abschnitt 6)
3. Redirect zu /dashboard

---

## 5. SEITEN & FEATURES

### /dashboard – Haupt-Dashboard

Das Dashboard ist die zentrale Seite. Es zeigt die KI-Analyse übersichtlich und motivierend.

**Komponenten:**

**1. Hero-Karte – Dein Energieprofil**
- Name des Gebäudetyps + Energieeffizienzklasse als Badge (z.B. "Klasse F")
- Aktueller geschätzter Jahresverbrauch in kWh
- Aktuelle Jahreskosten in €

**2. Sparpotenzial-Karte**
- "Du könntest bis zu **€X/Jahr** sparen" (groß, prominent)
- "Das entspricht **Y kg CO₂** weniger pro Jahr"
- CO₂-Äquivalent visuell: "= Z Autofahrten Frankfurt–Berlin"

**3. Top 3 Maßnahmen** (Karten, klickbar → /massnahmen)
- Je Karte: Maßnahmenname, Ersparnis/Jahr in €, geschätzte Kosten, Amortisation in Jahren
- Priorisiert nach Ziel des Users (Geld sparen → höchste €-Ersparnis zuerst; Umwelt → höchste CO₂-Reduktion zuerst)

**4. Förderungs-Badge**
- "Du qualifizierst dich für X Förderprogramme" → Link zu /foerderungen

**5. Budget-Filter** (oben rechts, immer sichtbar)
- Schnellauswahl: Alles / unter €500 / unter €2.000 / unter €10.000
- Filtert Top-Maßnahmen dynamisch

---

### /massnahmen – Maßnahmenplan

Vollständige Liste aller für den User relevanten Maßnahmen.

**Maßnahmen-Datenmodell:**
```typescript
interface Massnahme {
  id: string;
  titel: string;
  beschreibung: string;
  kategorie: 'heizung' | 'daemmung' | 'solar' | 'geraete' | 'verhalten' | 'tarif' | 'foerderung';
  zielgruppe: ('mieter_wohnung' | 'mieter_haus' | 'eigentuemer_wohnung' | 'eigentuemer_haus')[];
  kostenschaetzung: { min: number; max: number };
  ersparnisjahr: number;       // € pro Jahr
  co2ReduktionKg: number;      // kg CO₂ pro Jahr
  amortisationJahre: number;
  foerderungVerfuegbar: boolean;
  prioritaet: number;          // 1–5, KI-generiert
  kenergy_referral?: boolean;  // true → "Jetzt Angebot von Kenergy anfragen" Button zeigen
}
```

**Filter-Optionen:**
- Budget-Schieberegler (€0 – €50.000)
- Kategorie (alle / Heizung / Dämmung / Solar / Geräte / Verhalten)
- Sortierung: Höchste Ersparnis / Niedrigste Kosten / Schnellste Amortisation / CO₂-Impact

**Wichtig:** Für Maßnahmen mit `kenergy_referral: true` (Solar, Wärmepumpe) einen prominenten CTA-Button zeigen: "Kostenloses Angebot von Kenergy anfragen" → öffnet kenergy-solutions.de

---

### /foerderungen – Förderprogramme

Zeigt nur Förderprogramme für die der User qualifiziert.

**Statische Förderprogramm-Daten (`data/foerderungen.json`):**
```json
[
  {
    "id": "kfw-261",
    "name": "KfW Bundesförderung Effizienzhaus",
    "betrag": "bis zu €150.000",
    "beschreibung": "Kredit für energetische Sanierung zum Effizienzhaus-Standard",
    "bedingungen": ["eigentuemer"],
    "url": "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/Finanzierungsangebote/Bundesf%C3%B6rderung-f%C3%BCr-effiziente-Geb%C3%A4ude-Kredit-(261)/"
  },
  {
    "id": "bafa-beg",
    "name": "BAFA Bundesförderung Einzelmaßnahmen",
    "betrag": "15–20% der Investitionskosten",
    "beschreibung": "Zuschuss für Dämmung, Fenster, Heizungsoptimierung",
    "bedingungen": ["eigentuemer"],
    "url": "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_Einzelmassnahmen/bundesfoerderung_einzelmassnahmen_node.html"
  },
  {
    "id": "kfw-270",
    "name": "KfW Erneuerbare Energien Solar",
    "betrag": "bis zu €50 Mio. Kredit",
    "beschreibung": "Günstiger Kredit für Photovoltaik-Anlage",
    "bedingungen": ["eigentuemer_haus"],
    "url": "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Neubau/Finanzierungsangebote/Erneuerbare-Energien-–-Standard-(270)/"
  },
  {
    "id": "stromanbieter-wechsel",
    "name": "Ökostrom-Wechselbonus",
    "betrag": "€50–€200 Wechselbonus",
    "beschreibung": "Viele Ökostromanbieter zahlen Wechselboni und sind günstiger als Grundversorger",
    "bedingungen": ["mieter", "eigentuemer"],
    "url": "https://www.verivox.de/strom/"
  },
  {
    "id": "kfw-waermepumpe",
    "name": "BEG Wärmepumpe Förderung",
    "betrag": "bis zu 70% der Kosten",
    "beschreibung": "Kombizuschuss BAFA + KfW für Wärmepumpen-Installation",
    "bedingungen": ["eigentuemer"],
    "url": "https://www.bafa.de"
  }
]
```

---

### /chat – KI-Chatbot

Vollwertiger Chat-Interface mit dem KI-Energieberater.

**Features:**
- Kennt das komplette UserProfile aus localStorage
- Kann alle Fragen zu Energiesparen, Förderungen, Maßnahmen beantworten
- **Vermieter-Brief-Generator:** Wenn User fragt "Schreib mir einen Brief an meinen Vermieter" → KI generiert professionellen Brief auf Deutsch
- Nachrichten-History in localStorage speichern (max. 50 Nachrichten)
- "Neue Unterhaltung" Button

---

## 6. CLAUDE API INTEGRATION

### 6.1 Initiale Analyse nach Onboarding

Nach dem Onboarding Claude Sonnet aufrufen für die vollständige Analyse:

```typescript
const generateAnalysis = async (profile: UserProfile) => {
  const prompt = `Du bist ein erfahrener Energieberater in Deutschland. Analysiere das folgende Nutzerprofil und erstelle einen personalisierten Energiesparplan.

NUTZERPROFIL:
- Typ: ${profile.userType} in ${profile.propertyType}
- Ziel: ${profile.goal}
- PLZ: ${profile.plz}
- Gebäude: Baujahr ${profile.baujahr}, ${profile.wohnflaeche}m², ${profile.personen} Personen
- Gebäudedaten (aus TABULA): Heizenergiebedarf ${profile.heizenergiebedarfKwh} kWh/m²/Jahr, Dämmzustand: ${profile.daemmzustand}, Energieeffizienzklasse: ${profile.energieeffizienzklasse}
- Teilsaniert: ${profile.bereitsсанiert}
- Heizung: ${profile.heizungstyp}, Warmwasser: ${profile.warmwasser}
- Monatliche Energiekosten: €${profile.monatlicheKosten}
${profile.stromverbrauchKwh ? `- Gemessener Stromverbrauch: ${profile.stromverbrauchKwh} kWh/Jahr` : ''}
${profile.dachausrichtung ? `- Dachausrichtung: ${profile.dachausrichtung}` : ''}
${profile.solarVorhanden !== undefined ? `- Solaranlage vorhanden: ${profile.solarVorhanden}` : ''}
- Geräte-Alter: ${profile.gerateAlter}
- LED-Beleuchtung: ${profile.ledBeleuchtung}
- Wohndauer geplant: ${profile.wohndauer}
- Vermieter-Kontakt: ${profile.vermieterkontakt || 'nicht relevant'}

Erstelle eine JSON-Antwort mit folgendem Format:
{
  "jahresverbrauchKwh": number,
  "jahreskosten": number,
  "maxErsparnisjahr": number,
  "co2ReduktionKgJahr": number,
  "co2Aequivalent": string,
  "massnahmen": [
    {
      "id": string,
      "titel": string,
      "beschreibung": string (2-3 Sätze, konkret und verständlich),
      "kategorie": string,
      "zielgruppe": string[],
      "kostenschaetzung": { "min": number, "max": number },
      "ersparnisjahr": number,
      "co2ReduktionKg": number,
      "amortisationJahre": number,
      "foerderungVerfuegbar": boolean,
      "prioritaet": number (1-5),
      "kenergy_referral": boolean
    }
  ],
  "qualifiziertefoerderungen": string[] (IDs aus der Förderdatenbank),
  "kurzfazit": string (1 motivierender Satz für den User)
}

Wichtige Regeln:
- Nur Maßnahmen die für DIESEN Nutzertyp (${profile.userType} in ${profile.propertyType}) realistisch umsetzbar sind
- Mieter bekommen KEINE Maßnahmen die Eigentümer-Entscheidungen brauchen (Dämmung, Heizungstausch)
- Maßnahmen mit kenergy_referral: true nur für Solar und Wärmepumpe bei Eigentümern
- Alle Zahlen sollen realistisch und für Deutschland korrekt sein
- Priorisierung nach Nutzerziel: ${profile.goal}
- Mindestens 5, maximal 10 Maßnahmen`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });
  
  return JSON.parse(response.content[0].text);
};
```

### 6.2 Chatbot System Prompt

```typescript
const getChatSystemPrompt = (profile: UserProfile) => `Du bist ein freundlicher, kompetenter KI-Energieberater für ${profile.userType === 'mieter' ? 'Mieter' : 'Eigentümer'} in Deutschland. 

Du kennst das Profil des Nutzers:
- ${profile.userType} in ${profile.propertyType}, PLZ ${profile.plz}
- Gebäude Baujahr ${profile.baujahr}, ${profile.wohnflaeche}m²
- Heizung: ${profile.heizungstyp}
- Energieeffizienzklasse: ${profile.energieeffizienzklasse}
- Monatliche Energiekosten: €${profile.monatlicheKosten}
- Ziel: ${profile.goal}

Antworte immer:
- Auf Deutsch, freundlich und verständlich (kein Fachjargon)
- Konkret und personalisiert – beziehe dich auf die Daten des Nutzers
- Kurz und präzise (max. 3-4 Sätze, außer der Nutzer fragt nach Details)

Wenn der Nutzer einen Vermieter-Brief anfragt, erstelle einen professionellen deutschen Brief der:
- Höflich aber bestimmt formuliert ist
- Auf konkrete energetische Mängel hinweist (basierend auf Gebäudedaten)
- Auf gesetzliche Grundlagen hinweist (EnEV/GEG)
- Konkrete Verbesserungen fordert

Für Fragen zu Solar oder Wärmepumpen weise auf Kenergy Solutions hin (kenergy-solutions.de).`;
```

### 6.3 Stromrechnung-Extraktion

```typescript
const extractFromBill = async (imageBase64: string) => {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 }},
        { type: 'text', text: 'Extrahiere aus dieser Stromrechnung: Jahresverbrauch in kWh und Jahreskosten in €. Antworte nur mit JSON: {"kwh": number, "kosten": number}. Falls nicht erkennbar: {"kwh": null, "kosten": null}' }
      ]
    }]
  });
  return JSON.parse(response.content[0].text);
};
```

---

## 7. BRIGHT SKY API INTEGRATION

```typescript
const getBrightSkyData = async (plz: string) => {
  // Zuerst PLZ zu Koordinaten auflösen (über OpenStreetMap Nominatim, kostenlos)
  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${plz}&country=de&format=json`);
  const geoData = await geoRes.json();
  const { lat, lon } = geoData[0];
  
  // Wetterdaten von Bright Sky (aktuelles Jahr)
  const weatherRes = await fetch(
    `https://api.brightsky.dev/weather?lat=${lat}&lon=${lon}&date=${new Date().getFullYear()}-01-01&last_date=${new Date().getFullYear()}-12-31`
  );
  
  // Relevante Werte: Sonnenstunden, Durchschnittstemperatur → Heizgradtage schätzen
  return { lat, lon, sonnenstunden: 1600 }; // Fallback wenn API nicht erreichbar
};
```

---

## 8. LOKALE DATENSPEICHERUNG

Kein Backend nötig. Alles in localStorage:

```typescript
// Keys:
'kenergy_user_profile'    // UserProfile JSON
'kenergy_analysis'        // Analyse-Ergebnis von Claude
'kenergy_chat_history'    // Chat-Nachrichten Array
'kenergy_onboarding_step' // Aktueller Schritt (Resume-Funktion)
```

---

## 9. UMGEBUNGSVARIABLEN

`.env.local` Datei anlegen:
```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_APP_NAME=Kenergy Advisor
```

API-Calls nur über Next.js API Routes (`/app/api/...`) laufen lassen – niemals den API Key im Frontend exponieren.

---

## 10. API ROUTES

```
/api/analyze      → POST: UserProfile → Claude Sonnet → Analyse-JSON
/api/chat         → POST: {message, history, profile} → Claude Haiku → Antwort
/api/extract-bill → POST: {imageBase64} → Claude Vision → {kwh, kosten}
/api/brightsky    → GET: ?plz=60311 → Wetterdaten
```

---

## 11. REIHENFOLGE DER IMPLEMENTIERUNG

1. Next.js Projekt setup + Ordnerstruktur + `.env.local`
2. Statische Datendateien anlegen: `data/tabula.json`, `data/foerderungen.json`
3. UserProfile TypeScript Interface + localStorage Helpers
4. Onboarding Flow (Seiten 1–6 mit Routing und State)
5. API Routes: `/api/analyze`, `/api/chat`, `/api/extract-bill`, `/api/brightsky`
6. Dashboard Seite (mit Dummy-Daten zuerst, dann echte Analyse-Daten)
7. Maßnahmenplan Seite
8. Förderungen Seite
9. Chatbot Seite
10. Integration testen: Onboarding → Analyse → Dashboard → Chat

---

## 12. WICHTIGE HINWEISE

- **Keine Design-Entscheidungen treffen** – Layout und Styling werden separat übergeben. Vorerst funktionale UI mit Tailwind-Basics.
- **Alle Texte auf Deutsch** (UI-Labels, KI-Antworten, Fehlermeldungen)
- **Mobile-responsive** von Anfang an (Tailwind responsive Klassen nutzen)
- **Fehlerbehandlung:** Wenn Claude API nicht antwortet → Fallback-Werte aus TABULA-Daten zeigen
- **Kein Login / keine Registrierung** – alles anonym über localStorage
- **Kenergy Referral** immer prominent bei Solar/Wärmepumpe-Maßnahmen

---

*Briefing erstellt für LAUNCH Rhein-Main Build Days 2026 – Kenergy Solutions Challenge*
