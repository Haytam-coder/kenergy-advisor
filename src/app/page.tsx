import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="mb-6 text-6xl">⚡</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kenergy Advisor
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Dein persönlicher KI-Energieberater für deutsche Haushalte.
        </p>
        <p className="text-gray-500 mb-8">
          Erfahre in wenigen Minuten, wie du bis zu mehrere hundert Euro im Jahr sparen und deinen CO₂-Fußabdruck deutlich reduzieren kannst – individuell auf dein Zuhause zugeschnitten.
        </p>
        <Link
          href="/onboarding"
          className="inline-block bg-green-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-green-600 transition-colors shadow-lg"
        >
          Jetzt starten →
        </Link>
        <p className="mt-4 text-sm text-gray-400">Kostenlos · Keine Registrierung · Sofort-Ergebnis</p>
      </div>
    </main>
  );
}
