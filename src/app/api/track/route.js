import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');

    if (!trackingId) {
      return NextResponse.json({ error: 'Missing tracking ID' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { trackingId }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only return safe, non-sensitive data
    return NextResponse.json({
      trackingId: booking.trackingId,
      status: booking.status,
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      date: booking.date,
      time: booking.time,
      service: booking.service
    }, { status: 200 });

  } catch (error) {
    console.error("GET Tracking Error:", error);
    return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}
