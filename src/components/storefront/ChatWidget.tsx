'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  fallback?: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    '¡Hola! 👋 Soy tu asistente virtual de CopasMenstrualesRD. ¿En qué puedo ayudarte? Puedo responder preguntas sobre nuestras copas menstruales, pedidos y horarios de atención.',
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error ?? 'Esperá un momento antes de enviar otro mensaje.',
            fallback: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            fallback: data.fallback,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'En este momento no puedo responder. Contáctanos por WhatsApp.',
          fallback: true,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 rounded-full gradient-primary p-4 shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          aria-label="Abrir chat de ayuda"
        >
          <MessageCircle className="h-6 w-6 text-on-primary" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[calc(100vw-2.5rem)] flex flex-col rounded-2xl bg-surface-container-lowest shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="gradient-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-on-primary" />
              <div>
                <h3 className="text-sm font-semibold text-on-primary">
                  Asistente Virtual
                </h3>
                <p className="text-xs text-on-primary/70">
                  CopasMenstrualesRD
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5 text-on-primary" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-80 min-h-[200px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'gradient-primary text-on-primary rounded-br-md'
                      : 'bg-surface-container text-on-surface rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.fallback && (
                    <a
                      href="https://wa.me/18094670365"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Abrir WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-surface-container-lowest">
            <div className="flex items-center gap-2 rounded-xl bg-surface-container p-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="rounded-lg gradient-primary p-2 text-on-primary transition-all hover:opacity-90 disabled:opacity-30"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
