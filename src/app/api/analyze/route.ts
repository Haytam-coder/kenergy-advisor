import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { UserProfile } from '@/lib/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const profile: UserProfile = await req.json();

    const prompt = `Du bist ein erfahrener Energieberater in Deutschland. Analysiere das folgende Nutzerprofil und erstelle einen personalisierten Energiesparplan.

NUTZERPROFIL:
- Typ: ${profile.userType} in ${profile.propertyType}
- Ziel: ${profile.goal}
- PLZ: ${profile.plz}
- Gebäude: Baujahr ${profile.baujahr}, ${profile.wohnflaeche}m², ${profile.personen} Personen
- Gebäudedaten (aus TABULA): Heizenergiebedarf ${profile.heizenergiebedarfKwh} kWh/m²/Jahr, Dämmzustand: ${profile.daemmzustand}, Energieeffizienzklasse: ${profile.energieeffizienzklasse}
- Teilsaniert: ${profile.bereitsSaniert}
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
      "beschreibung": string,
      "kategorie": string,
      "zielgruppe": string[],
      "kostenschaetzung": { "min": number, "max": number },
      "ersparnisjahr": number,
      "co2ReduktionKg": number,
      "amortisationJahre": number,
      "foerderungVerfuegbar": boolean,
      "prioritaet": number,
      "kenergy_referral": boolean
    }
  ],
  "qualifiziertefoerderungen": string[],
  "kurzfazit": string
}

Wichtige Regeln:
- Nur Maßnahmen die für DIESEN Nutzertyp (${profile.userType} in ${profile.propertyType}) realistisch umsetzbar sind
- Mieter bekommen KEINE Maßnahmen die Eigentümer-Entscheidungen brauchen
- Maßnahmen mit kenergy_referral: true nur für Solar und Wärmepumpe bei Eigentümern
- Alle Zahlen sollen realistisch und für Deutschland korrekt sein
- Priorisierung nach Nutzerziel: ${profile.goal}
- Mindestens 5, maximal 10 Maßnahmen
- Antworte NUR mit dem JSON-Objekt, kein zusätzlicher Text`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content ?? '{}';
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('analyze error:', error);
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 });
  }
}
