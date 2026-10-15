import { pickDetailedCosmeticsReply } from '../src/mocks/cosmeticsKnowledge.js';
import { getSellerRedirectMessage } from './shop.config.js';

/**
 * @param {string} userText
 * @returns {string}
 */
export function pickMockResponse(userText) {
  return pickDetailedCosmeticsReply(userText, getSellerRedirectMessage());
}
