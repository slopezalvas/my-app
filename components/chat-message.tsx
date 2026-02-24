import { Message } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[85%] lg:max-w-[70%] rounded-2xl px-5 py-4 shadow-xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none'
        }`}
      >
        <span className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block font-bold">
          {isUser ? 'Usuario' : 'Asistente de Cine'}
        </span>

        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Tarjeta de película optimizada
              img: ({ src, alt }) => {
                if (!src || typeof src !== 'string') return null;
                return (
                  <span className="block my-4">
                    <span className="relative block aspect-[2/3] w-48 overflow-hidden rounded-xl border border-zinc-700 shadow-2xl">
                      <Image 
                        src={src} 
                        alt={alt || 'Poster'}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </span>
                  </span>
                );
              },
              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-[15px]">{children}</p>,
              h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-2 mt-4">{children}</h2>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-400 my-4 bg-white/5 py-2 rounded-r-lg">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Badges de las Tools */}
        {message.toolInvocations?.map((tool) => (
          <div key={tool.toolCallId} className="mt-4 pt-2 border-t border-white/5 flex gap-2">
             <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 text-zinc-500">
               {tool.toolName === 'buscarPeliculas' ? '🎬 TMDB_SEARCH_SUCCESS' : '💾 DB_SYNC_COMPLETE'}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}