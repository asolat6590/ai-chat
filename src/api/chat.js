import { MOCK_MESSAGES } from '../mocks/messages.mock.js';
import { pickMockResponse } from '../mocks/responses.mock.js';

const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === 'true' || !import.meta.env.VITE_API_URL;

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomTypingDelay() {
  return 600 + Math.floor(Math.random() * 600);
}

/**
 * @returns {Promise<import('../mocks/messages.mock.js').ChatMessage[]>}
 */
export async function fetchMessages() {
  if (USE_MOCKS) {
    return structuredClone(MOCK_MESSAGES);
  }

  const res = await fetch(`${API_BASE}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

/**
 * POST ${VITE_API_URL}/chat
 * Body: { message: string, history: { role, text }[] }
 * Response: { reply: string } или { message: string }
 *
 * @param {string} text
 * @param {{ history?: { role: string, text: string }[] }} [options]
 * @returns {Promise<string>}
 */
export async function sendMessage(text, options = {}) {
  const { history = [] } = options;

  if (USE_MOCKS) {
    await delay(randomTypingDelay());
    return pickMockResponse(text);
  }

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, history }),
  });

  if (!res.ok) throw new Error('Failed to send message');

  const data = await res.json();
  const reply = data.reply ?? data.message;
  if (typeof reply !== 'string') {
    throw new Error('Invalid response from chat API');
  }
  return reply;
}

export { USE_MOCKS };
