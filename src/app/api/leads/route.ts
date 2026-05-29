import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { name, plz, telefon, massnahme_id, massnahme_titel } = await req.json();
    await supabase.from('leads').insert({
      name: String(name ?? '').trim(),
      plz: String(plz ?? '').trim(),
      telefon: telefon ? String(telefon).trim() : null,
      massnahme_id: massnahme_id ?? null,
      massnahme_titel: massnahme_titel ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
