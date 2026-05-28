import tabulaData from '../../data/tabula.json';
import { TabulaData } from './types';

type BaujahrKey = 'vor1970' | '1970-1990' | '1990-2010' | 'nach2010';
type TypeKey = 'SFH' | 'MFH';

const typMap: Record<string, TypeKey> = {
  haus: 'SFH',
  wohnung: 'MFH',
};

export function getTabulaData(propertyType: string, baujahr: string): TabulaData {
  const typeKey = typMap[propertyType] ?? 'SFH';
  const data = (tabulaData as Record<TypeKey, Record<BaujahrKey, TabulaData>>)[typeKey][baujahr as BaujahrKey];
  return data ?? tabulaData.SFH['1970-1990'];
}

export function getTabulaArchetype(propertyType: string): string {
  return propertyType === 'haus' ? 'Einfamilienhaus (SFH)' : 'Mehrfamilienhaus (MFH)';
}
