/** English UI copy. Keys are shared with ar.ts (TypeScript enforces parity). */
export const en = {
  // Brand / global
  'brand.tagline': 'Made for your cravings.',
  'brand.taglineSub': 'Packed with flavor. Made to be unforgettable.',
  'lang.switch': 'العربية',
  'lang.switchLabel': 'Switch language to Arabic',
  'nav.home': 'Home',
  'nav.menu': 'Menu',
  'nav.cart': 'Cart',
  'nav.openCart': 'Open cart, {count} items',
  'common.back': 'Back',
  'common.close': 'Close',
  'common.retry': 'Try again',
  'common.loading': 'Loading…',
  'common.seeAll': 'See all',
  'common.optional': 'Optional',
  'common.required': 'Required',

  // Prices
  'price.from': 'From {price}',
  'price.free': 'Free',

  // Home
  'home.hero.eyebrow': 'Sweets · Fries · Chicken',
  'home.hero.cta': 'Browse the menu',
  'home.hero.secondary': 'How ordering works',
  'home.hero.badge': 'Order for delivery',
  'home.categories.title': 'What are you craving?',
  'home.categories.sub': 'Pick a category to start.',
  'home.featured.title': 'Melty favorites',
  'home.featured.sub': 'The ones everyone comes back for.',
  'home.how.title': 'Ordering is simple',
  'home.how.1.title': 'Pick your treats',
  'home.how.1.body': 'Browse the menu and choose what you are craving.',
  'home.how.2.title': 'Make it yours',
  'home.how.2.body': 'Choose sizes and add-ons. The price updates as you go.',
  'home.how.3.title': 'We deliver',
  'home.how.3.body': 'Send your order and Melty will contact you shortly to confirm.',
  'home.cta.title': 'Hungry already?',
  'home.cta.body': 'The full menu is one tap away.',

  // Product card
  'product.add': 'Add',
  'product.addNamed': 'Add {name}',
  'product.soldOut': 'Sold out',
  'product.customizable': 'Customizable',

  // Menu page
  'menu.title': 'Our menu',
  'menu.sub': 'Sweets, fries, chicken and drinks — made to order.',
  'menu.search': 'Search the menu',
  'menu.searchClear': 'Clear search',
  'menu.results': '{count} results for “{query}”',
  'menu.noResults.title': 'Nothing matches “{query}”',
  'menu.noResults.body': 'Try another word, or browse the categories.',
  'menu.categories': 'Menu categories',

  // Product page
  'product.basePrice': 'Base price',
  'product.chooseOne': 'Choose 1',
  'product.chooseUpTo': 'Choose up to {max}',
  'product.chooseAny': 'Choose any',
  'product.selectedCount': '{count}/{max} selected',
  'product.quantity': 'Quantity',
  'product.addToCart': 'Add to cart',
  'product.update': 'Update item',
  'product.yourOrder': 'Your selection',
  'product.each': '{price} each',
  'product.soldOutBody': 'This item is sold out right now. Check back soon!',
  'product.choiceSoldOut': 'Sold out',
  'product.notFound.title': 'This item is not on the menu',
  'product.notFound.body': 'It may have been removed. Have a look at the rest of the menu.',
  'product.backToMenu': 'Back to menu',
  'product.added': '{name} added to your cart',
  'product.updated': 'Item updated',
  'error.option_required': 'Please make a choice here.',
  'error.too_many_selections': 'You picked too many — remove one.',

  // Cart page
  'cart.title': 'Your cart',
  'cart.empty.title': 'Your cart is empty',
  'cart.empty.body': 'Add something delicious from the menu to get started.',
  'cart.empty.cta': 'Browse the menu',
  'cart.edit': 'Edit',
  'cart.remove': 'Remove',
  'cart.removeNamed': 'Remove {name}',
  'cart.unitPrice': '{price} each',
  'cart.problem.missing': 'This item is no longer on the menu. Please remove it.',
  'cart.problem.unavailable': 'This item is sold out now. Please remove it to continue.',
  'cart.summary': 'Order summary',
  'cart.subtotal': 'Subtotal',
  'cart.deliveryFee': 'Delivery fee',
  'cart.deliverTo': 'Deliver to',
  'cart.feeFrom': 'From {price}',
  'cart.feeHint': 'Choose your area to see the exact delivery fee.',
  'cart.total': 'Total',
  'cart.totalPlusDelivery': '{price} + delivery',
  'cart.checkout': 'Go to checkout',
  'cart.addMore': 'Add more items',
  'cart.fixProblems': 'Remove unavailable items to continue.',

  // Cart bar
  'cartbar.view': 'View cart',
  'cartbar.items': '{count} items',
  'cartbar.item': '1 item',

  // States
  'state.error.title': 'Something went wrong',
  'state.error.body': 'We could not load this right now. Please check your connection and try again.',
  'state.notFound.title': 'Page not found',
  'state.notFound.body': 'The page you are looking for does not exist.',
  'state.notFound.cta': 'Back to home',
  'state.soon.title': 'Coming in the next phase',
  'state.soon.body': 'This screen is part of the next build phase of the prototype.',

  // Footer
  'footer.followUs': 'Follow Melty',
  'footer.prototype': 'Prototype — menu, prices and delivery fees shown are placeholders.',
  'footer.rights': '© {year} Melty',

  // Forms (shared)
  'form.name': 'Full name',
  'form.phone': 'Phone number',
  'form.phoneHint': 'Egyptian mobile, e.g. 010 1234 5678',
  'form.area': 'Area',
  'form.areaPlaceholder': 'Choose your area',
  'form.address': 'Full address',
  'form.instructions': 'Delivery instructions',

  // Error codes from the API
  'error.network_error': 'Cannot reach Melty right now. Check your connection.',
  'error.server_error': 'Something went wrong on our side. Please try again.',
  'error.name_required': 'Please enter your name.',
  'error.phone_required': 'Please enter your phone number.',
  'error.phone_invalid': 'Enter a valid Egyptian mobile number (e.g. 01012345678).',
  'error.address_required': 'Please enter your full address.',
  'error.area_not_found': 'Please choose a delivery area.',
  'error.too_long': 'This is too long.',
} as const;

export type MessageKey = keyof typeof en;
