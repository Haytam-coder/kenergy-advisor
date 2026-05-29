import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data } = await supabase
      .from('sessions')
      .select('analysis')
      .not('analysis', 'is', null);

    let totalErsparnis = 0;
    let totalCo2 = 0;
    let count = 0;

    for (const row of data ?? []) {
      const a = row.analysis;
      if (a?.maxErsparnisjahr > 0) {
        totalErsparnis += a.maxErsparnisjahr;
        totalCo2 += a.co2ReduktionKgJahr ?? 0;
        count++;
      }
    }

    return NextResponse.json({
      analysesCount: count,
      totalErsparnis: Math.round(totalErsparnis),
      totalCo2Kg: Math.round(totalCo2),
    });
  } catch {
    return NextResponse.json({ analysesCount: 0, totalErsparnis: 0, totalCo2Kg: 0 });
  }
}
