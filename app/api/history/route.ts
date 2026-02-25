import { db } from '@/lib/db';
import { chatHistory } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const history = await db
      .select()
      .from(chatHistory)
      .orderBy(desc(chatHistory.createdAt))
      .limit(1); 
    return NextResponse.json(history[0]?.messages || []);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return NextResponse.json([]);
  }
}