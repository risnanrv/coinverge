import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/ping', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({ status: 'healthy' });
    } else {
      return NextResponse.json(
        { status: 'unhealthy', error: `HTTP ${response.status}` },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('API health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: 'Network error' },
      { status: 503 }
    );
  }
}
