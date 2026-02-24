import { ChatBox } from '@/components/chat-box';

export const metadata = {
  title: 'Gleni AI Tech Challenge',
  description: 'Chatbot con memoria persistente y capacidades de razonamiento real.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <ChatBox />
    </main>
  );
}