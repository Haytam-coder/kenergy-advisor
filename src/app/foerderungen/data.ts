export interface FoerderProgramm {
  id: string;
  name: string;
  description: string;
  maxBetrag: string;
  link: string;
  badge: string;
}

export const FOERDER_PROGRAMME: Record<string, FoerderProgramm> = {
  'kfw-261': {
    id: 'kfw-261',
    name: 'KfW-Kredit 261',
    description: 'Bundesförderung für Effiziente Gebäude (BEG). Zinsgünstiger Kredit für energetische Sanierung oder Neubau. Kombinierbar mit BAFA-Zuschüssen.',
    maxBetrag: 'bis zu 150.000 €',
    link: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/Finanzierungsangebote/Bundesf%C3%B6rderung-f%C3%BCr-effiziente-Geb%C3%A4ude-Kredit-(261)/',
    badge: 'KfW 261',
  },
  'bafa-beg': {
    id: 'bafa-beg',
    name: 'BAFA BEG Einzelmaßnahmen',
    description: 'Direkte Zuschüsse vom Bundesamt für Wirtschaft für Einzelmaßnahmen wie Heizungstausch, Dämmung oder Fenster. Kein Kredit — Geld zurück nach Einbau.',
    maxBetrag: '15–20 % der Investitionskosten',
    link: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_fuer_effiziente_Gebaeude/Einzelmassnahmen/einzelmassnahmen_node.html',
    badge: 'BAFA BEG',
  },
  'stromanbieter-wechsel': {
    id: 'stromanbieter-wechsel',
    name: 'Stromanbieter wechseln',
    description: 'Kein Förderprogramm, aber sofortige Ersparnis: Ein Wechsel zu einem günstigeren Ökostromanbieter spart 150–300 € pro Jahr — ohne Investition. Viele Anbieter zahlen Wechselboni.',
    maxBetrag: '150–300 € / Jahr',
    link: 'https://www.verivox.de/strom/',
    badge: 'Sofort',
  },
};
