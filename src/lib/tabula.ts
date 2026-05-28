import tabulaData from '../../data/tabula.json';
import { TabulaData } from './types';

type TabulaTypeKey = 'SFH' | 'TH' | 'MFH' | 'AB';

const typMap: Record<string, TabulaTypeKey> = {
  haus: 'SFH',
  reihenhaus: 'TH',
  wohnung: 'MFH',
  apartmentblock: 'AB',
};

function findPeriodKey(periods: Record<string, unknown>, baujahr: number): string | null {
  for (const key of Object.keys(periods)) {
    if (key.startsWith('vor')) {
      const until = parseInt(key.slice(3));
      if (baujahr < until) return key;
    } else if (key.startsWith('ab')) {
      const from = parseInt(key.slice(2));
      if (baujahr >= from) return key;
    } else if (key.includes('-')) {
      const [from, to] = key.split('-').map(Number);
      if (baujahr >= from && baujahr <= to) return key;
    }
  }
  // fallback: return key with closest year2
  let best: string | null = null;
  let minDist = Infinity;
  for (const key of Object.keys(periods)) {
    const entry = periods[key] as { year2: number | null };
    if (entry.year2) {
      const dist = Math.abs(entry.year2 - baujahr);
      if (dist < minDist) { minDist = dist; best = key; }
    }
  }
  return best;
}

const fallback: TabulaData = {
  code: 'DE.N.SFH.05.Gen.ReEx.001.001',
  year1: 1969, year2: 1978,
  referenzflaeche_m2: 156,
  heizenergiebedarfKwh: 132,
  energieeffizienzklasse: 'E',
  daemmzustand: 'gering gedämmt',
  uWertWand: 1.0, uWertDach: 0.7, uWertFenster: 2.7,
};

export function getTabulaData(propertyType: string, baujahr: number): TabulaData {
  const typeKey = typMap[propertyType] ?? 'SFH';
  const periods = (tabulaData as Record<string, Record<string, TabulaData>>)[typeKey];
  if (!periods) return fallback;
  const key = findPeriodKey(periods as Record<string, unknown>, baujahr);
  if (!key) return fallback;
  return periods[key] ?? fallback;
}

export function getTabulaArchetype(propertyType: string): string {
  const labels: Record<string, string> = {
    haus: 'Einfamilienhaus (SFH)',
    reihenhaus: 'Reihenhaus (TH)',
    wohnung: 'Mehrfamilienhaus (MFH)',
    apartmentblock: 'Großes Apartmentgebäude (AB)',
  };
  return labels[propertyType] ?? 'Einfamilienhaus (SFH)';
}
