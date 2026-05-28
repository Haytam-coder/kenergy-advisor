'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadProfile, loadAnalysis } from '@/lib/localStorage';
import { UserProfile, AnalyseResult } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalyseResult | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setAnalysis(loadAnalysis());
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Kein Profil gefunden.</p>
          <Link href="/onboarding" className="text-green-600 font-semibold hover:underline">
            → Zum Onboarding
          </Link>
        </div>
      </div>
    );
  }

  const jahreskosten = analysis?.jahreskosten ?? profile.monatlicheKosten * 12;
  const ersparnis = analysis?.maxErsparnisjahr ?? Math.round(jahreskosten * 0.25);
  const co2 = analysis?.co2ReduktionKgJahr ?? Math.round(ersparnis * 0.4);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-green-600">⚡ Kenergy Advisor</h1>
          <Link href="/onboarding" className="text-sm text-gray-400 hover:text-gray-600">
            Neu starten
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {analysis?.kurzfazit && (
          <div className="bg-green-500 text-white rounded-2xl p-4 text-center font-medium">
            {analysis.kurzfazit}
          </div>
        )}

        {/* Energieprofil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Dein Energieprofil</h2>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
              Klasse {profile.energieeffizienzklasse}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Geschätzter Jahresverbrauch</p>
              <p className="text-lg font-bold text-gray-900">
                {analysis?.jahresverbrauchKwh?.toLocaleString('de-DE') ?? '—'} kWh
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Geschätzte Jahreskosten</p>
              <p className="text-lg font-bold text-gray-900">€{jahreskosten.toLocaleString('de-DE')}</p>
            </div>
          </div>
        </div>

        {/* Sparpotenzial */}
        <div className="bg-green-500 text-white rounded-2xl p-5">
          <p className="text-sm opacity-80 mb-1">Du könntest bis zu</p>
          <p className="text-4xl font-bold mb-1">€{ersparnis.toLocaleString('de-DE')}/Jahr</p>
          <p className="text-sm opacity-80">sparen</p>
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-sm">
              🌱 <strong>{co2.toLocaleString('de-DE')} kg CO₂</strong> weniger pro Jahr
            </p>
            {analysis?.co2Aequivalent && (
              <p className="text-xs opacity-70 mt-1">= {analysis.co2Aequivalent}</p>
            )}
          </div>
        </div>

        {/* Top Maßnahmen */}
        {analysis?.massnahmen && analysis.massnahmen.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-3">Top 3 Maßnahmen</h2>
            <div className="space-y-3">
              {analysis.massnahmen.slice(0, 3).map((m) => (
                <div key={m.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{m.titel}</p>
                    <span className="text-green-600 font-bold text-sm whitespace-nowrap">
                      €{m.ersparnisjahr}/Jahr
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{m.beschreibung}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>Kosten: €{m.kostenschaetzung.min.toLocaleString()}–{m.kostenschaetzung.max.toLocaleString()}</span>
                    <span>Amortisation: {m.amortisationJahre} Jahre</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Förderungen Badge */}
        {analysis?.qualifiziertefoerderungen && analysis.qualifiziertefoerderungen.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-900">
                🎁 {analysis.qualifiziertefoerderungen.length} Förderprogramme verfügbar
              </p>
              <p className="text-xs text-blue-600 mt-0.5">Du qualifizierst dich für staatliche Förderungen</p>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 pb-6">
          Weitere Features (Maßnahmenplan, Förderungen, Chat) folgen in Kürze.
        </p>
      </main>
    </div>
  );
}
