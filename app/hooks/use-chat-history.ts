import { useEffect } from 'react';
import { Message } from 'ai';

/** Hook personalizado para cargar el historial de chat desde la base de datos. */
export function useChatHistory(setMessages: (messages: Message[]) => void) {
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (data.length > 0) setMessages(data);
      } catch (e) {
        console.error("Error al recuperar historial:", e);
      }
    };
    loadHistory();
  }, [setMessages]);
}