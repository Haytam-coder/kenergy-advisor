export interface UserProfile {
  // Seite 1
  userType: 'mieter' | 'eigentuemer';
  propertyType: 'haus' | 'wohnung';
  goal: 'geld' | 'umwelt' | 'beides';

  // Seite 2
  plz: string;
  baujahr: number;
  wohnflaeche: number;
  personen: 1 | 2 | 3 | 4;

  // Seite 3 (auto-befüllt + Bestätigung)
  tabulaArchetype: string;
  heizenergiebedarfKwh: number;
  daemmzustand: string;
  energieeffizienzklasse: string;
  bereitsSaniert: 'ja' | 'nein' | 'weiss_nicht';

  // Seite 4
  heizungstyp: 'gas' | 'oel' | 'fernwaerme' | 'waermepumpe' | 'nachtspeicher' | 'pellets';
  warmwasser: 'heizung' | 'elektrisch' | 'solar';
  monatlicheKosten: number;
  stromverbrauchKwh?: number;

  // Seite 5 – Eigentümer Haus
  dachausrichtung?: 'sued' | 'ost_west' | 'nord' | 'weiss_nicht';
  solarVorhanden?: boolean;
  sanierenGeplant?: 'ja' | 'nein' | 'unsicher';

  // Seite 5 – Eigentümer Wohnung
  eigeneHeizungsregelung?: boolean;
  hausverwaltungAktiv?: boolean;
  verbesserungenGeplant?: 'ja' | 'nein' | 'unsicher';

  // Seite 5 – Mieter
  heizungSelbstRegelbar?: boolean;
  stromanbietterGewechselt?: boolean;
  vermieterkontakt?: 'regelmaessig' | 'selten' | 'nie';

  // Seite 6
  gerateAlter: 'unter5' | '5bis10' | 'ueber10';
  ledBeleuchtung: 'ja' | 'teilweise' | 'nein';
  wohndauer: 'unter2' | '2bis5' | 'langfristig';
  foerderungenBeantragt: 'ja' | 'nein' | 'weiss_nicht';
}

export interface Massnahme {
  id: string;
  titel: string;
  beschreibung: string;
  kategorie: 'heizung' | 'daemmung' | 'solar' | 'geraete' | 'verhalten' | 'tarif' | 'foerderung';
  zielgruppe: ('mieter_wohnung' | 'mieter_haus' | 'eigentuemer_wohnung' | 'eigentuemer_haus')[];
  kostenschaetzung: { min: number; max: number };
  ersparnisjahr: number;
  co2ReduktionKg: number;
  amortisationJahre: number;
  foerderungVerfuegbar: boolean;
  prioritaet: number;
  kenergy_referral?: boolean;
}

export interface AnalyseResult {
  jahresverbrauchKwh: number;
  jahreskosten: number;
  maxErsparnisjahr: number;
  co2ReduktionKgJahr: number;
  co2Aequivalent: string;
  massnahmen: Massnahme[];
  qualifiziertefoerderungen: string[];
  kurzfazit: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface TabulaData {
  code: string;
  year1: number | null;
  year2: number | null;
  referenzflaeche_m2: number;
  heizenergiebedarfKwh: number;
  daemmzustand: string;
  energieeffizienzklasse: string;
  uWertWand: number;
  uWertDach: number;
  uWertFenster: number;
}
