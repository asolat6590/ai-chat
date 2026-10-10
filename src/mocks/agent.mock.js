/** @typedef {{ id: string, name: string, initials: string, status: 'online' | 'offline', avatarUrl?: string }} ChatAgent */

/** @type {ChatAgent} */
export const MOCK_AGENT = {
  id: 'agent-1',
  name: 'ИИ-ассистент',
  initials: 'ИИ',
  status: 'online',
  avatarUrl: '/agent-avatar.png?v=2',
};
