import { Message } from 'ai';

export function DebugPanel({ messages }: { messages: Message[] }) {
  return (
    <div className="h-full bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto text-[10px] font-mono">
      <h3 className="text-zinc-500 uppercase tracking-widest mb-4 font-bold">LLM Debug Console</h3>
      {messages.map((m, i) => (
        <div key={i} className="mb-4 pb-4 border-b border-zinc-800">
          <div className="text-blue-400 mb-1">Role: {m.role}</div>
          <div className="text-zinc-400">
            {m.toolInvocations ? (
              <pre className="text-yellow-500">
                Tools: {JSON.stringify(m.toolInvocations, null, 2)}
              </pre>
            ) : (
              <pre className="whitespace-pre-wrap">{m.content}</pre>
            )}
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="text-zinc-600 italic">Esperando interacción...</div>
      )}
    </div>
  );
}