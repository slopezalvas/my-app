import { db } from '@/lib/db';
import { chatHistory } from '@/lib/db/schema';
import { Message } from 'ai';

/** Guarda el historial de mensajes en la base de datos. */
export async function saveChatHistory(messages: Message[]) {
  try {
    await db.insert(chatHistory).values({
      messages: messages as unknown as Record<string, unknown>[],
    });
    console.log('✅ Historial guardado en la base de datos');
  } catch (error) {
    console.error('❌ Error al guardar el historial:', error);
  }
}