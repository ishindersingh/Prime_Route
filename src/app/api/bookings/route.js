import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, date, time, pickup, dropoff, service } = body;

    const booking = await prisma.booking.create({
      data: {
        name: name || '',
        phone: phone || '',
        date: date || '',
        time: time || '',
        pickup: pickup || '',
        dropoff: dropoff || '',
        service: service || '',
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
