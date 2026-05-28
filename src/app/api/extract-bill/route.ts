import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType ?? 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'Extrahiere aus dieser Stromrechnung: Jahresverbrauch in kWh und Jahreskosten in €. Antworte nur mit JSON: {"kwh": number, "kosten": number}. Falls nicht erkennbar: {"kwh": null, "kosten": null}',
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{"kwh": null, "kosten": null}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { kwh: null, kosten: null };

    return NextResponse.json(result);
  } catch (error) {
    console.error('extract-bill error:', error);
    return NextResponse.json({ kwh: null, kosten: null }, { status: 500 });
  }
}
