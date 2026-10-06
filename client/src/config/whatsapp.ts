import type { AdminOrderDetail, Lang, OrderStatus } from '../api/types';
import { business } from './business';

/**
 * Prefilled WhatsApp messages staff send to customers, one per order status.
 * PLACEHOLDER wording — the owner can change it freely here.
 *
 * Placeholders: {name} {number} {total} {area}
 * Each message is written in the language the customer ordered in.
 *
 * This uses WhatsApp's free "click to chat" link (wa.me): it opens a chat with
 * the message typed in, and staff press send from Melty's own WhatsApp.
 * No WhatsApp API, account setup or paid service is involved.
 */
export const whatsappTemplates: Record<Lang, Record<OrderStatus, string>> = {
  en: {
    new: 'Hi {name}, we received your Melty order #{number} ({total}). We will confirm it shortly.',
    confirmed: 'Hi {name}, your Melty order #{number} is confirmed. Total: {total}. We will let you know when it is on the way.',
    preparing: 'Hi {name}, we are preparing your Melty order #{number} now.',
    out_for_delivery: 'Hi {name}, your Melty order #{number} is on its way to {area}. Please keep your phone nearby.',
    completed: 'Hi {name}, your Melty order #{number} has been delivered. Enjoy, and thank you for ordering from Melty!',
    rejected:
      'Hi {name}, we are sorry, but we cannot accept your Melty order #{number} right now. Reply to this message if you have any questions.',
  },
  ar: {
    new: 'أهلًا {name}، طلبك من ميلتي رقم {number} وصلنا ({total}). هنأكده معاك حالًا.',
    confirmed: 'أهلًا {name}، طلبك من ميلتي رقم {number} اتأكد. الإجمالي: {total}. هنبلغك أول ما يخرج للتوصيل.',
    preparing: 'أهلًا {name}، بنحضّر طلبك من ميلتي رقم {number} دلوقتي.',
    out_for_delivery: 'أهلًا {name}، طلبك من ميلتي رقم {number} خرج للتوصيل لـ{area}. خلّي موبايلك جنبك من فضلك.',
    completed: 'أهلًا {name}، طلبك من ميلتي رقم {number} اتسلّم. بالهنا والشفا، وشكرًا إنك طلبت من ميلتي!',
    rejected: 'أهلًا {name}، آسفين جدًا، مش هنقدر نقبل طلبك من ميلتي رقم {number} دلوقتي. لو عندك أي سؤال ابعتلنا هنا.',
  },
};

/** "01012345678" → "201012345678" (wa.me wants the international number, digits only). */
export function toWhatsAppNumber(egyptianMobile: string): string {
  return '20' + egyptianMobile.replace(/\D/g, '').replace(/^0/, '');
}

/** The message for the order's current status, in the customer's language. */
export function whatsappMessage(order: AdminOrderDetail, status: OrderStatus = order.status): string {
  const lang = order.locale;
  const vars: Record<string, string> = {
    name: order.customer.name,
    number: String(order.orderNumber),
    total: `${new Intl.NumberFormat('en-US').format(order.total)} ${business.currency[lang]}`,
    area: order.delivery.area[lang] || order.delivery.area.en,
  };
  return whatsappTemplates[lang][status].replace(/\{(\w+)\}/g, (m, key: string) => vars[key] ?? m);
}

export function whatsappLink(order: AdminOrderDetail, status: OrderStatus = order.status): string {
  return `https://wa.me/${toWhatsAppNumber(order.customer.phone)}?text=${encodeURIComponent(whatsappMessage(order, status))}`;
}
