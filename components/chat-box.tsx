'use client';

import { useChat } from 'ai/react';
import { ChatMessage } from './chat-message';
import { DebugPanel } from './debug-panel';
import { useRef, useEffect, useState } from 'react';

export function ChatBox() {
  const [showDebug, setShowDebug] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Hook de Vercel AI SDK
   * setMessages nos permite inyectar el historial que traigamos de la DB
   */
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat();

  /**
   * CRITERIO TÉCNICO: Carga de historial persistente
   * Cuando se abre la app, consultamos nuestro endpoint de historial
   */
  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch('/api/history');
        const history = await response.json();
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    }
    loadHistory();
  }, [setMessages]);

  // Auto-scroll suave hacia el último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex h-screen w-full bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      
      {/* --- COLUMNA DEL CHAT --- */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-black">
        
        {/* Header Minimalista */}
        <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            <h1 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-400">
              Gleni <span className="text-zinc-100">CineBot</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className={`text-[9px] font-mono px-3 py-1 rounded-md border transition-all ${
              showDebug 
                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                : 'border-zinc-800 text-zinc-500 hover:bg-zinc-900'
            }`}
          >
            {showDebug ? 'CLOSE_DEBUG' : 'OPEN_DEBUG'}
          </button>
        </header>

        {/* Feed de Mensajes */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto px-4 pt-10 pb-32 scroll-smooth custom-scrollbar"
        >
          <div className="max-w-3xl mx-auto w-full">
            {messages.length === 0 && !isLoading && (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
                <div className="w-16 h-16 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-3xl mb-6 shadow-2xl">
                  🍿
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Tu cartelera personal</h2>
                <p className="text-zinc-500 text-sm mt-2 max-w-xs">
                  Dime qué te gusta y buscaré las mejores películas para ti hoy.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
            </div>

            {isLoading && !messages[messages.length - 1]?.toolInvocations && (
              <div className="flex items-center gap-3 p-4 text-zinc-600 text-[11px] font-mono tracking-widest uppercase">
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce"></span>
                </span>
                Analizando datos...
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-md p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[11px] text-center mt-8">
                ✕ Error crítico de sistema. Revisa la consola o las variables de entorno.
              </div>
            )}
          </div>
        </div>

        {/* Barra de Entrada de Texto */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
          <form 
            onSubmit={handleSubmit} 
            className="max-w-3xl mx-auto relative"
          >
            <input
              className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-2xl pl-6 pr-14 py-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-md shadow-2xl"
              value={input}
              placeholder="Escribe el nombre de una película o un género..."
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925L10.788 10l-7.095 1.836-1.414 4.925a.75.75 0 0 0 .826.95 44.82 44.82 0 0 0 16.202-7.397.75.75 0 0 0 0-1.218A44.82 44.82 0 0 0 3.105 2.289Z" />
              </svg>
            </button>
          </form>
          <div className="mt-4 flex justify-center gap-4 text-[9px] uppercase tracking-[0.2em] text-zinc-700 font-bold">
            <span>GPT-4o</span>
            <span>•</span>
            <span>PostgreSQL</span>
            <span>•</span>
            <span>TMDB API</span>
          </div>
        </div>
      </div>

      {/* --- PANEL DE DEBUG (DERECHA) --- */}
      {showDebug && (
        <aside className="w-[450px] border-l border-zinc-900 bg-[#070707] z-40 animate-in slide-in-from-right duration-500">
          <DebugPanel messages={messages} />
        </aside>
      )}
    </div>
  );
}