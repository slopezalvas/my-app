import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { savePreference, getPreferences } from '@/lib/services/preferences';
import { searchMovies } from '@/lib/services/movies';
import { saveChatHistory } from '@/lib/services/chat';
import { db } from '@/lib/db';
import { chatHistory } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

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

export async function POST(req: Request) {
  const { messages } = await req.json();

  const memoriaUsuario = await getPreferences();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: `Eres un asistente inteligente y atento. 
             Datos conocidos del usuario: [${memoriaUsuario}]. 
             Usa esta información para personalizar la charla. 
             Si el usuario te cuenta algo nuevo sobre sus gustos o quién es, 
             usa la herramienta 'guardarGustoUsuario' para no olvidarlo.
             IMPORTANTE: Cuando recomiendes una película, sigue SIEMPRE este formato:
              ## [Título de la Película]
              > [Aquí pon un resumen muy breve y emocionante]
              ![Poster](url_del_poster)
             Usa negritas para destacar datos técnicos. No escribas párrafos muy largos.`,
    tools: {

      guardarGustoUsuario: tool({
        description: 'Guarda información importante que el usuario mencione sobre sus gustos o preferencias.',
        parameters: z.object({
          categoria: z.string().describe('Ej: genero_cine, idioma, hobby, comida_favorita'),
          valor: z.string().describe('El dato específico a recordar')
        }),
        execute: async ({ categoria, valor }) => {
          await savePreference(categoria, valor);
          return { 
            status: 'success', 
            message: `He memorizado que tu ${categoria} es ${valor}` 
          };
        },
      }),
      buscarPeliculas: tool({
        description: 'Busca películas en la base de datos de TMDB por título o género.',
        parameters: z.object({
          busqueda: z.string().describe('El título o tema de la película')
        }),
        execute: async ({ busqueda }) => {
          const resultados = await searchMovies(busqueda);
          return { status: 'success', resultados };
        },
      }),
      // mas tools aca

    },
    maxSteps: 5, 
    onFinish: async (event) => {
  try {
    const assistantMessages = event.response.messages;
    await saveChatHistory([
      ...messages,         // Mensajes previos + el último del usuario
      ...assistantMessages // Mensajes nuevos del asistente
    ]);
  } catch (error) {
    console.error("Error al guardar en onFinish:", error);
  }
},
  });

  return result.toDataStreamResponse();
}