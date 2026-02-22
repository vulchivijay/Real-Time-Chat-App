import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

type ChatMessage = {
  id: string;
  username: string;
  text: string;
  ts: number;
};

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [pendingName, setPendingName] = useState<string>('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const s = io('http://localhost:4000');
    setSocket(s);

    s.on('connect', () => {
      console.log('connected');
    });

    s.on('history', (history: ChatMessage[]) => {
      setMessages(history || []);
    });

    s.on('message', (msg: ChatMessage) => {
      setMessages((m) => [...m, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function send() {
    if (!socket || !username || !input.trim()) return;
    socket.emit('message', { username, text: input.trim() });
    setInput('');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Real-time Chatroom</h1>

        {!username ? (
          <div className="space-y-2">
            <input
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              placeholder="Enter a username"
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            />
            <div className="flex gap-2">
              <button
                onClick={() => pendingName.trim() && setUsername(pendingName.trim())}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Join
              </button>
              <button
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Toggle Theme
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Signed in as <strong>{username}</strong></div>

            <div ref={listRef} className="h-80 overflow-auto mb-3 p-3 bg-white dark:bg-gray-800 rounded border">
              {messages.map((m) => (
                <div key={m.id} className="mb-2">
                  <div className="text-xs text-gray-500">{new Date(m.ts).toLocaleTimeString()}</div>
                  <div className="flex gap-2 items-baseline">
                    <div className="font-semibold">{m.username}</div>
                    <div className="text-sm break-words">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Message..."
                className="flex-1 p-2 border rounded bg-white dark:bg-gray-800"
              />
              <button onClick={send} className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
