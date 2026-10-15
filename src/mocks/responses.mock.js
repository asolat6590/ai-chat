import { pickDetailedCosmeticsReply } from './cosmeticsKnowledge.js';

const SELLER_PHONE = '+7 (800) 555-12-34';

function redirectToSeller() {
  return `Этот вопрос лучше обсудить с продавцом. Позвоните: ${SELLER_PHONE}.`;
}

/**
 * @param {string} userText
 * @returns {string}
 */
export function pickMockResponse(userText) {
  return pickDetailedCosmeticsReply(userText, redirectToSeller());
}
