import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const plz = req.nextUrl.searchParams.get('plz');
  if (!plz) return NextResponse.json({ error: 'PLZ fehlt' }, { status: 400 });

  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${plz}&country=de&format=json`,
      { headers: { 'User-Agent': 'kenergy-advisor/1.0' } }
    );
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ sonnenstunden: 1600, heizgradtage: 3500, lat: null, lon: null });
    }

    const { lat, lon } = geoData[0];

    // Estimate solar hours by latitude (rough approximation)
    const latNum = parseFloat(lat);
    const sonnenstunden = Math.round(1800 - (latNum - 48) * 30);
    const heizgradtage = Math.round(3200 + (latNum - 48) * 100);

    return NextResponse.json({ sonnenstunden, heizgradtage, lat, lon });
  } catch (error) {
    console.error('brightsky error:', error);
    return NextResponse.json({ sonnenstunden: 1600, heizgradtage: 3500, lat: null, lon: null });
  }
}
