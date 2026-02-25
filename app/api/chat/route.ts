import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getPreferences } from '@/lib/services/preferences';
import { saveChatHistory } from '@/lib/services/chat';
import { aiTools } from '@/lib/ai/tools';
import { getSystemPrompt } from '@/lib/ai/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const memoriaUsuario = await getPreferences();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: getSystemPrompt(memoriaUsuario),
    tools: aiTools,
    maxSteps: 5,
    onFinish: async ({ response }) => {
      try {
        await saveChatHistory([...messages, ...response.messages]);
      } catch (error) {
        console.error("Error al guardar en onFinish:", error);
      }
    },
  });

  return result.toDataStreamResponse();
}