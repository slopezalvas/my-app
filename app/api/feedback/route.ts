import { db } from '@/lib/db';
import { messageFeedback } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messageId, rating } = await req.json();
    
    await db.insert(messageFeedback).values({
      messageId,
      rating,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar feedback', details: error }, { status: 500 });
  }
}