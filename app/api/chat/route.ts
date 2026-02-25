import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { getPreferences } from '@/lib/services/preferences';
import { saveChatHistory } from '@/lib/services/chat';
import { getAllGenres } from '@/lib/services/genres';
import { getAiTools } from '@/lib/ai/tools';
import { getSystemPrompt } from '@/lib/ai/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userId } = await req.json();
  
  const currentUserId = userId || 'invitado_anonimo';

  const [memoriaUsuario, listaGeneros] = await Promise.all([
    getPreferences(currentUserId),
    getAllGenres()
  ]);

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    system: getSystemPrompt(memoriaUsuario, listaGeneros),
    tools: getAiTools(currentUserId),
    maxSteps: 5,

    onFinish: async (event) => {
      try {
        await saveChatHistory([
          ...messages, 
          ...event.response.messages
        ]);
      } catch (error) {
        console.error("Error crítico guardando historial en onFinish:", error);
      }
    },
  });

  return result.toDataStreamResponse();
}