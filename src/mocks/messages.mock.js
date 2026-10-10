/**
 * @typedef {{ id: string, role: 'user' | 'assistant', text: string, createdAt: string }} ChatMessage
 */

/** @type {ChatMessage[]} */
export const MOCK_MESSAGES = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: 'Здравствуйте! Я виртуальный ассистент. Помогу с вопросами о сервисе, тарифах и настройке. Чем могу помочь?',
    createdAt: '2026-10-10T09:00:00.000Z',
  },
  {
    id: 'msg-2',
    role: 'user',
    text: 'Добрый день!',
    createdAt: '2026-10-10T09:00:12.000Z',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    text: 'Рад вас видеть! Выберите тему ниже или напишите свой вопрос.',
    createdAt: '2026-10-10T09:00:15.000Z',
  },
];
