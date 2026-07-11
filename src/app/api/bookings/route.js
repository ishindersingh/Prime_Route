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

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
