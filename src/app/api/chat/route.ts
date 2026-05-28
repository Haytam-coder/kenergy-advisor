import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { UserProfile, ChatMessage } from '@/lib/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getSystemPrompt(profile: UserProfile): string {
  return `Du bist ein freundlicher, kompetenter KI-Energieberater für ${profile.userType === 'mieter' ? 'Mieter' : 'Eigentümer'} in Deutschland.

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
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, profile }: { message: string; history: ChatMessage[]; profile: UserProfile } = await req.json();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: getSystemPrompt(profile) },
      ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages,
    });

    const text = response.choices[0].message.content ?? '';
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('chat error:', error);
    return NextResponse.json({ error: 'Chat fehlgeschlagen' }, { status: 500 });
  }
}
