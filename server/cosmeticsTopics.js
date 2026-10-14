const COSMETICS_PATTERNS = [
  /космет/i,
  /крем/i,
  /сыворот/i,
  /уход/i,
  /кож/i,
  /волос/i,
  /макияж/i,
  /тональн/i,
  /пудр/i,
  /помад/i,
  /туш/i,
  /шампун/i,
  /бальзам/i,
  /кондицион/i,
  /spf/i,
  /солнцезащ/i,
  /очищен/i,
  /увлажн/i,
  /пилинг/i,
  /скраб/i,
  /маск/i,
  /дух/i,
  /парфюм/i,
  /состав/i,
  /ингредиент/i,
  /ретinol|ретинол/i,
  /ниacin|ниацин/i,
  /гialur|гиалур/i,
  /витамин\s*[ace]/i,
  /тип\s*кож/i,
  /жирн/i,
  /сух/i,
  /комбинирован/i,
  /чувствитель/i,
  /акне/i,
  /прыщ/i,
  /морщин/i,
  /антивозраст/i,
  /серум/i,
  /эмульс/i,
  /лосьон/i,
  /тоник/i,
  /мицел/i,
  /гель\s*для\s*умыван/i,
  /бb-крем|bb-крем|cc-крем/i,
  /патч/i,
  /блеск\s*для\s*губ/i,
  /подбор/i,
  /средств/i,
];

const GREETING_PATTERNS = [/привет/i, /здравств/i, /добр(ый|ое|ого|ая)/i];

/**
 * @param {string} text
 */
export function isCosmeticsRelated(text) {
  const t = text.trim();
  if (!t) return false;
  if (GREETING_PATTERNS.test(t) && t.length < 40) return true;
  return COSMETICS_PATTERNS.some((re) => re.test(t));
}
