import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();
    const mime = mediaType ?? 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mime};base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: 'Extrahiere aus dieser Stromrechnung: Jahresverbrauch in kWh und Jahreskosten in €. Antworte nur mit JSON: {"kwh": number, "kosten": number}. Falls nicht erkennbar: {"kwh": null, "kosten": null}',
            },
          ],
        },
      ],
    });

    const text = response.choices[0].message.content ?? '{"kwh": null, "kosten": null}';
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('extract-bill error:', error);
    return NextResponse.json({ kwh: null, kosten: null }, { status: 500 });
  }
}
