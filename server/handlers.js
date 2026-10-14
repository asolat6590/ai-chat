import { generateAgentReply } from './gemini.js';
import { INITIAL_MESSAGES } from './initialMessages.js';
import { WELCOME_MESSAGE } from './shop.config.js';

export function handleHealth(_req, res) {
  const key = process.env.GEMINI_API_KEY?.trim() || '';
  res.json({
    ok: true,
    gemini: Boolean(key),
    geminiKeyConfigured: Boolean(key),
  });
}

export function handleMessages(_req, res) {
  const key = process.env.GEMINI_API_KEY?.trim() || '';
  const messages = structuredClone(INITIAL_MESSAGES);
  const geminiReady = Boolean(key);

  if (!geminiReady && process.env.GEMINI_FALLBACK_MOCKS !== 'false') {
    messages[0].text =
      'Здравствуйте! Сейчас работают демо-ответы. Добавьте GEMINI_API_KEY в настройках Vercel.';
  } else if (geminiReady) {
    messages[0].text = WELCOME_MESSAGE;
  }

  res.json(messages);
}

export async function handleChat(req, res) {
  const { message, history } = req.body ?? {};

  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const safeHistory = Array.isArray(history)
    ? history.filter(
        (m) =>
          m &&
          typeof m.text === 'string' &&
          (m.role === 'user' || m.role === 'assistant'),
      )
    : [];

  try {
    const reply = await generateAgentReply(message, safeHistory);
    res.json({ reply: reply.trim() });
  } catch (err) {
    console.error('[chat]', err);
    const details =
      err instanceof Error && err.message
        ? err.message
        : 'Failed to generate reply';
    const status =
      details.includes('GEMINI_API_KEY') ||
      details.includes('API_KEY') ||
      details.includes('API key')
        ? 503
        : 502;
    res.status(status).json({
      error: details,
      details,
    });
  }
}
