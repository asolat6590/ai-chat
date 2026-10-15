import { isCareQuestion } from '../src/mocks/cosmeticsKnowledge.js';

/**
 * @param {string} text
 */
export function isCosmeticsRelated(text) {
  return isCareQuestion(text);
}
