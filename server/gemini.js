import { getAgentSystemInstruction } from './prompts.js';
import { pickMockResponse } from './responses.mock.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const MODELS_CACHE_MS = 10 * 60 * 1000;

/** @type {{ names: string[], fetchedAt: number } | null} */
let modelsCache = null;

function mockFallbackEnabled() {
  return process.env.GEMINI_FALLBACK_MOCKS !== 'false';
}

function mockReply(message) {
  return pickMockResponse(message);
}

const STATIC_MODEL_CANDIDATES = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-2.5-flash',
];

/**
 * @param {string} apiKey
 * @param {string} path
 * @param {RequestInit} [init]
 */
async function geminiRequest(apiKey, path, init = {}) {
  const base = `https://generativelanguage.googleapis.com/v1beta/${path.replace(/^\//, '')}`;
  const authModes = apiKey.startsWith('AIza')
    ? [{ type: 'key' }, { type: 'bearer' }]
    : [{ type: 'bearer' }, { type: 'key' }];

  let lastError = 'Gemini request failed';

  for (const mode of authModes) {
    const headers = {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    };
    let url = base;

    if (mode.type === 'key') {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}key=${encodeURIComponent(apiKey)}`;
    } else {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const res = await fetch(url, { ...init, headers });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return { data, res };
    }

    lastError =
      data?.error?.message ||
      data?.message ||
      `${res.status} ${res.statusText}`.trim();

    if (res.status === 401 || res.status === 403) {
      continue;
    }

    throw new Error(lastError);
  }

  if (
    lastError.includes('API key') ||
    lastError.includes('API_KEY') ||
    lastError.includes('authentication')
  ) {
    throw new Error(
      'Не удалось авторизоваться в Gemini. Используйте ключ Google AI Studio (начинается с AIza).',
    );
  }

  throw new Error(lastError);
}

/**
 * @param {string} name
 */
function normalizeModelName(name) {
  return name.replace(/^models\//, '');
}

/**
 * @param {string} name
 */
function isChatModel(name) {
  const n = name.toLowerCase();
  if (n.includes('embed')) return false;
  if (n.includes('image')) return false;
  if (n.includes('tts')) return false;
  if (n.includes('audio')) return false;
  if (n.includes('vision') && !n.includes('flash')) return false;
  return n.includes('gemini');
}

/**
 * @param {string} name
 */
function modelRank(name) {
  const n = name.toLowerCase();
  if (n.includes('flash') && n.includes('lite')) return 1;
  if (n.includes('flash')) return 0;
  if (n.includes('pro')) return 2;
  return 3;
}

/**
 * @param {string} apiKey
 * @returns {Promise<string[]>}
 */
async function listGenerateContentModels(apiKey) {
  const now = Date.now();
  if (modelsCache && now - modelsCache.fetchedAt < MODELS_CACHE_MS) {
    return modelsCache.names;
  }

  try {
    const { data } = await geminiRequest(apiKey, 'models', { method: 'GET' });
    const names = (data?.models || [])
      .filter((m) =>
        Array.isArray(m.supportedGenerationMethods)
          ? m.supportedGenerationMethods.includes('generateContent')
          : true,
      )
      .map((m) => normalizeModelName(m.name))
      .filter(isChatModel)
      .sort((a, b) => modelRank(a) - modelRank(b));

    if (names.length > 0) {
      modelsCache = { names, fetchedAt: now };
      return names;
    }
  } catch (err) {
    console.warn('[gemini] listModels failed:', err.message);
  }

  return [...STATIC_MODEL_CANDIDATES];
}

/**
 * @param {string} apiKey
 * @param {string} configured
 * @returns {Promise<string[]>}
 */
async function resolveModelsToTry(apiKey, configured) {
  const available = await listGenerateContentModels(apiKey);
  const ordered = [];

  if (configured && available.includes(configured)) {
    ordered.push(configured);
  } else if (configured) {
    ordered.push(configured);
  }

  for (const name of available) {
    if (!ordered.includes(name)) ordered.push(name);
  }

  for (const name of STATIC_MODEL_CANDIDATES) {
    if (!ordered.includes(name)) ordered.push(name);
  }

  return ordered;
}

/**
 * @param {{ role: string, text: string }[]} history
 */
function toGeminiContents(history) {
  return history
    .filter((m) => m.text?.trim())
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text.trim() }],
    }));
}

/**
 * @param {{ role: 'user' | 'model', parts: { text: string }[] }[]} contents
 */
function sanitizeContents(contents) {
  let copy = [...contents];
  while (copy.length > 0 && copy[0].role === 'model') {
    copy.shift();
  }

  const merged = [];
  for (const item of copy) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === item.role) {
      prev.parts[0].text += `\n\n${item.parts[0].text}`;
    } else {
      merged.push({
        role: item.role,
        parts: [{ text: item.parts[0].text }],
      });
    }
  }
  return merged;
}

/**
 * @param {string} modelName
 * @param {{ role: 'user' | 'model', parts: { text: string }[] }[]} contents
 * @param {string} apiKey
 */
async function generateWithModel(modelName, contents, apiKey) {
  const payload = {
    systemInstruction: {
      parts: [{ text: getAgentSystemInstruction() }],
    },
    contents,
  };

  try {
    const { data } = await geminiRequest(
      apiKey,
      `models/${encodeURIComponent(modelName)}:generateContent`,
      { method: 'POST', body: JSON.stringify(payload) },
    );

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }
    return text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('not found') || msg.includes('404')) {
      throw new Error(`MODEL_NOT_FOUND:${modelName}:${msg}`);
    }
    throw err;
  }
}

/**
 * @param {string} message
 * @param {{ role: string, text: string }[]} history
 * @returns {Promise<string>}
 */
export async function generateAgentReply(message, history = []) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const trimmed = message.trim();
  let contents = sanitizeContents(toGeminiContents(history));

  const last = contents[contents.length - 1];
  const hasCurrentUser =
    last?.role === 'user' && last.parts[0]?.text === trimmed;

  if (!hasCurrentUser) {
    contents.push({ role: 'user', parts: [{ text: trimmed }] });
  }

  if (contents.length === 0) {
    contents = [{ role: 'user', parts: [{ text: trimmed }] }];
  }

  const configured = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const modelsToTry = await resolveModelsToTry(apiKey, configured);

  let lastFailure = 'Failed to generate reply';

  for (const modelName of modelsToTry) {
    try {
      return await generateWithModel(modelName, contents, apiKey);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      lastFailure = msg;

      if (msg.startsWith('MODEL_NOT_FOUND:')) {
        continue;
      }

      throw new Error(msg);
    }
  }

  if (mockFallbackEnabled()) {
    console.warn('[gemini] Gemini недоступен — fallback на демо-ответы:', lastFailure);
    return mockReply(message);
  }

  const hint = modelsCache?.names?.slice(0, 5).join(', ') || 'см. AI Studio';
  throw new Error(
    `Не найдена рабочая модель Gemini. Проверьте GEMINI_API_KEY (AIza...) и GEMINI_MODEL. Доступные модели: ${hint}`,
  );
}
