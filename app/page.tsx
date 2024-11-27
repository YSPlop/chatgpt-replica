"use client";
import { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { supabase } from '../lib/supabaseClient';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  // Fetch persisted messages on page load
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();
  }, []);

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim()) return;

    // Create user message with unique ID
    const userMessage = { id: crypto.randomUUID(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to Supabase
    await supabase.from('messages').insert([userMessage]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await response.json();

    if (data?.response) {
      // Create bot message with unique ID
      const botMessage = { id: crypto.randomUUID(), role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, botMessage]);

      // Save bot message to Supabase
      await supabase.from('messages').insert([botMessage]);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 backdrop-blur-lg bg-opacity-50 bg-gradient-to-tl from-gray-800/50 via-gray-700/30 to-gray-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div
              className={`relative rounded-lg p-3 max-w-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white animate-bounce-out'
                  : 'bg-gray-700 text-gray-200 animate-fade-in'
              }`}
            >
              {msg.content}
              {/* Message Tail */}
              <div
                className={`absolute w-3 h-3 ${
                  msg.role === 'user' ? 'bg-blue-600 -right-1.5 bottom-1' : 'bg-gray-700 -left-1.5 bottom-1'
                } transform rotate-45`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 flex items-center">
        <input
          type="text"
          className="flex-1 border border-gray-600 rounded-lg px-4 py-2 bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}