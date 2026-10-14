/** @typedef {{ id: string, name: string, initials: string, status: 'online' | 'offline', avatarUrl?: string }} ChatAgent */

/** @type {ChatAgent} */
export const MOCK_AGENT = {
  id: 'agent-1',
  name: 'Консультант BeautyLine',
  initials: 'BL',
  status: 'online',
  avatarUrl: '/agent-avatar.png?v=2',
};
