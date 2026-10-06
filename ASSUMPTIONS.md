# Melty prototype — what's confirmed and what's a placeholder

Use this list to review the prototype with Melty's owner. Anything under **Placeholders** or **Decisions for the owner** was made up to demonstrate the system and must be confirmed or replaced before launch.

_Last updated: 2026-10-06._

## Confirmed

| Topic | Decision |
| --- | --- |
| Ordering model | **Delivery only** for now. Customers order without creating an account. |
| Languages | English and Egyptian Arabic, with a right-to-left layout in Arabic. Numbers use Western digits (123); prices show as "180 EGP" / "180 جنيه". |
| Look and feel | Colours taken from the shop front and logo: navy, fry-yellow, cyan and warm amber light. |
| Delivery coverage | One city with a few areas, each with its own delivery fee. |
| Prices | Always calculated by the server, so a customer can't change a price or fee from their browser. |
| After ordering | The customer sees "Order received — Melty will contact you shortly". Staff then confirm by phone or WhatsApp. |
| WhatsApp | Staff send a ready-made status message (confirmed, preparing, out for delivery, delivered, rejected…) **in one click**, in the language the customer ordered in. It opens Melty's own WhatsApp with the message typed, and staff press send. No paid WhatsApp service, and nothing is sent automatically. |
| Staff area | One shared login. A live orders list (refreshes every 10 s with a new-order alert), order details with status changes and call/WhatsApp buttons, and a sold-out switch per product. |
| Menu editing | Staff can't add or edit products, prices or photos in this version. That could be added later as a separate piece of work. |

## Placeholders (to be replaced with Melty's real details)

**Menu:** 8 categories and 25 products with English and Arabic names, descriptions, prices, sizes and add-ons, all invented to look realistic.
Categories: Pancakes · Waffles · Crepes · Melty Fries · Chicken · Ice Cream · Cakes · Drinks.
Sample prices: Lotus Pancake 180 EGP (Large +40, add-ons +25–45), Kinder Waffle 195, Melty Loaded Fries 120, Crispy Chicken Strips 190, Soft Drink 35.
"Banana Nutella Crepe" is marked sold out on purpose, to show what sold-out items look like.

**Delivery areas and fees (Cairo):**

| Area | Fee |
| --- | --- |
| Nasr City | 30 EGP |
| Heliopolis | 40 EGP |
| New Cairo | 50 EGP |

**Other placeholders:**
- **Product photos:** illustrated drawings per category stand in for real photos.
- **Logo:** recreated by hand from the logo photo, not the official file.
- **WhatsApp wording:** the message texts are drafts.
- **Demo orders:** 6 sample customers and orders, so the staff screens have something to show.
- **Staff login:** a demo password, to be changed before launch.

## Decisions for the owner

1. **Menu:** the real items, prices, sizes and add-ons, and which items are "Melty favourites" on the home page.
2. **Delivery:** which areas Melty delivers to and the fee for each. Is there a minimum order, or a free-delivery threshold?
3. **Pickup:** should customers also be able to order for pickup at the mall? The system is ready to add this.
4. **Payment:** cash on delivery only, or also card or wallet (InstaPay, Vodafone Cash…)? The prototype doesn't take or mention payment yet.
5. **Communication:** are the WhatsApp message drafts right (tone, wording, emojis)? Should the confirmation screen show Melty's phone number? Is fully automatic WhatsApp sending ever wanted (it needs a paid WhatsApp Business API account)?
6. **Opening hours:** should ordering close outside working hours?
7. **Staff:** is one shared login enough, or does each staff member need their own?
8. **Branding:** the official logo file and product photos.
9. **Contact details:** the phone number and address to show on the site.

## Prototype limits (by design)

- **Order tracking:** customers can't look up an order afterwards. The confirmation screen shows everything once, and Melty follows up by phone or WhatsApp.
- **Order list size:** the staff list shows the latest 200 orders. A real launch would add paging and search.
- **Customer notifications:** status changes don't reach the customer by themselves; staff send the WhatsApp message.
- **Deployment:** everything runs on a development computer for now. See "Before going live" in [README.md](README.md).
