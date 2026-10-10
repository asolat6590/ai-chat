import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';

export function MessageList({
  messages,
  agent,
  isLoading,
  isTyping,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-panel__messages" role="log" aria-live="polite" aria-relevant="additions">
      {isLoading ? (
        <p className="chat-panel__loading">Загрузка сообщений…</p>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} agent={agent} />
        ))
      )}
      {isTyping && <TypingIndicator agentName={agent.name} />}
      <div ref={endRef} />
    </div>
  );
}
