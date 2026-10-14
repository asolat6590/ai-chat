import { WELCOME_MESSAGE } from './shop.config.js';

/** Начальная история для GET /messages */
export const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    text: WELCOME_MESSAGE,
    createdAt: new Date().toISOString(),
  },
];
