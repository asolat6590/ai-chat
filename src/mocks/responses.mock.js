const SELLER_PHONE = '+7 (800) 555-12-34';

function redirectToSeller() {
  return `Этот вопрос лучше обсудить с продавцом. Позвоните: ${SELLER_PHONE}.`;
}

const COSMETICS = [
  /космет/i,
  /крем/i,
  /сыворот/i,
  /уход/i,
  /кож/i,
  /волос/i,
  /макияж/i,
  /spf/i,
  /состав/i,
  /увлажн/i,
  /привет/i,
  /здравств/i,
];

function isCosmetics(text) {
  return COSMETICS.some((re) => re.test(text));
}

/**
 * @param {string} userText
 * @returns {string}
 */
export function pickMockResponse(userText) {
  const t = userText.toLowerCase().trim();

  if (!isCosmetics(t)) {
    return redirectToSeller();
  }

  if (/привет|здравств|добр(ый|ое|ого)/.test(t)) {
    return 'Здравствуйте! Помогу с подбором косметики и ухода. Что хотите узнать?';
  }
  if (/сух|увлажн/.test(t)) {
    return 'Для сухой кожи подойдут мягкое очищение, увлажняющая сыворотка и плотный крем. Есть ли чувствительность?';
  }
  if (/spf|солнц/.test(t)) {
    return 'SPF лучше использовать ежедневно. Для города часто хватает SPF 30–50. Нужен лёгкий или плотный финиш?';
  }

  return 'Опишите тип кожи или продукт — подскажу по косметике и уходу.';
}
