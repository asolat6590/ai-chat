import { useCallback, useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../api/chat.js';

const ERROR_REPLY =
  'Не удалось отправить сообщение. Попробуйте ещё раз чуть позже.';

function createMessage(role, text) {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    text,
    createdAt: new Date().toISOString(),
  };
}

/**
 * @returns {{
 *   messages: import('../mocks/messages.mock.js').ChatMessage[],
 *   isLoading: boolean,
 *   isTyping: boolean,
 *   sendUserMessage: (text: string) => Promise<void>,
 * }}
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const initial = await fetchMessages();
        if (!cancelled) setMessages(initial);
      } catch {
        if (!cancelled) {
          setMessages([
            createMessage(
              'assistant',
              'Не удалось загрузить историю. Вы всё равно можете написать нам.',
            ),
          ]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sendUserMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg = createMessage('user', trimmed);
      let history = [];

      setMessages((prev) => {
        history = [...prev, userMsg].map((m) => ({
          role: m.role,
          text: m.text,
        }));
        return [...prev, userMsg];
      });
      setIsTyping(true);

      try {
        const replyText = await sendMessage(trimmed, { history });
        setMessages((prev) => [...prev, createMessage('assistant', replyText)]);
      } catch (err) {
        const detail =
          err instanceof Error && err.message ? ` ${err.message}` : '';
        setMessages((prev) => [
          ...prev,
          createMessage('assistant', `${ERROR_REPLY}${detail}`),
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping],
  );

  return { messages, isLoading, isTyping, sendUserMessage };
}
