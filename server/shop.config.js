export const DEFAULT_SELLER_PHONE = '+7 (800) 555-12-34';

export function getSellerPhone() {
  return process.env.SELLER_PHONE?.trim() || DEFAULT_SELLER_PHONE;
}

export function getSellerRedirectMessage() {
  const phone = getSellerPhone();
  return `Этот вопрос лучше обсудить с продавцом. Позвоните по номеру ${phone} — подскажут по заказу, оплате и другим темам вне ассортимента косметики.`;
}

export const WELCOME_MESSAGE =
  'Здравствуйте! Я консультант по косметике. Помогу подобрать уход, расскажу о составе и применении средств. Чем могу помочь?';
