/**
 * ============================================================================
 *  PROTOTYPE PLACEHOLDER DATA — NOT MELTY'S REAL MENU, PRICES OR DELIVERY POLICY
 * ============================================================================
 *  Everything business-specific that the database is seeded with lives in
 *  this one file. When the owner provides the real menu / areas / fees,
 *  replace the arrays below and run `npm run seed`.
 *
 *  Prices are whole Egyptian pounds.
 */

type L = { en: string; ar: string };
const t = (en: string, ar: string): L => ({ en, ar });

// ---------------------------------------------------------------------------
// Reusable option groups (placeholders)
// ---------------------------------------------------------------------------

interface ChoiceSeed {
  name: L;
  priceModifier?: number;
  isDefault?: boolean;
  available?: boolean;
}
interface GroupSeed {
  name: L;
  selection: 'single' | 'multiple';
  required?: boolean;
  maxSelections?: number;
  choices: ChoiceSeed[];
}

const size = (largeExtra: number): GroupSeed => ({
  name: t('Size', 'الحجم'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('Regular', 'عادي'), isDefault: true },
    { name: t('Large', 'كبير'), priceModifier: largeExtra },
  ],
});

const sweetAddOns: GroupSeed = {
  name: t('Add-ons', 'إضافات'),
  selection: 'multiple',
  maxSelections: 4,
  choices: [
    { name: t('Extra Lotus', 'لوتس زيادة'), priceModifier: 30 },
    { name: t('Extra Nutella', 'نوتيلا زيادة'), priceModifier: 30 },
    { name: t('Kinder', 'كيندر'), priceModifier: 40 },
    { name: t('Pistachio cream', 'كريمة فستق'), priceModifier: 45 },
    { name: t('Fresh strawberries', 'فراولة فريش'), priceModifier: 25 },
    { name: t('Scoop of vanilla ice cream', 'بولة آيس كريم فانيليا'), priceModifier: 35 },
  ],
};

const sauceDrizzle: GroupSeed = {
  name: t('Sauce', 'الصوص'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('Milk chocolate', 'شوكولاتة باللبن'), isDefault: true },
    { name: t('White chocolate', 'شوكولاتة بيضاء') },
    { name: t('Dark chocolate', 'شوكولاتة دارك') },
    { name: t('Caramel', 'كراميل') },
  ],
};

const friesSize: GroupSeed = {
  name: t('Size', 'الحجم'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('Regular', 'عادي'), isDefault: true },
    { name: t('Large', 'كبير'), priceModifier: 25 },
    { name: t('Family box', 'بوكس عائلي'), priceModifier: 70 },
  ],
};

const dips: GroupSeed = {
  name: t('Dips', 'صوصات جانبية'),
  selection: 'multiple',
  maxSelections: 3,
  choices: [
    { name: t('Melty signature sauce', 'صوص ميلتي'), priceModifier: 15 },
    { name: t('Garlic mayo', 'مايونيز بالتوم'), priceModifier: 15 },
    { name: t('Cheddar cheese sauce', 'صوص شيدر'), priceModifier: 20 },
    { name: t('BBQ', 'باربكيو'), priceModifier: 15 },
    { name: t('Spicy ranch', 'رانش حار'), priceModifier: 15 },
  ],
};

const spice: GroupSeed = {
  name: t('Spice level', 'درجة الحرارة'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('Classic', 'كلاسيك'), isDefault: true },
    { name: t('Spicy', 'حار') },
    { name: t('Extra hot', 'حار جداً') },
  ],
};

const chickenPieces: GroupSeed = {
  name: t('Pieces', 'عدد القطع'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('3 pieces', '3 قطع'), isDefault: true },
    { name: t('5 pieces', '5 قطع'), priceModifier: 70 },
    { name: t('8 pieces', '8 قطع'), priceModifier: 150 },
  ],
};

const drinkSize = (largeExtra: number): GroupSeed => ({
  name: t('Size', 'الحجم'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('Medium', 'وسط'), isDefault: true },
    { name: t('Large', 'كبير'), priceModifier: largeExtra },
  ],
});

const milkChoice: GroupSeed = {
  name: t('Milk', 'اللبن'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('Full cream', 'لبن كامل الدسم'), isDefault: true },
    { name: t('Skimmed', 'لبن خالي الدسم') },
    { name: t('Oat milk', 'لبن شوفان'), priceModifier: 25 },
  ],
};

const scoops: GroupSeed = {
  name: t('Scoops', 'عدد البولات'),
  selection: 'single',
  required: true,
  choices: [
    { name: t('2 scoops', '2 بولة'), isDefault: true },
    { name: t('3 scoops', '3 بولات'), priceModifier: 35 },
  ],
};

const iceCreamToppings: GroupSeed = {
  name: t('Toppings', 'التوبينج'),
  selection: 'multiple',
  maxSelections: 3,
  choices: [
    { name: t('Lotus crumbs', 'لوتس مطحون'), priceModifier: 15 },
    { name: t('Brownie bites', 'قطع براوني'), priceModifier: 25 },
    { name: t('Hot fudge', 'هوت فادج'), priceModifier: 20 },
    { name: t('Roasted nuts', 'مكسرات محمصة'), priceModifier: 25 },
  ],
};

// ---------------------------------------------------------------------------
// Categories (placeholders) — `art` picks the placeholder illustration
// ---------------------------------------------------------------------------

export interface CategorySeed {
  slug: string;
  name: L;
  description: L;
  art: string;
}

export const categories: CategorySeed[] = [
  { slug: 'pancakes', art: 'pancake', name: t('Pancakes', 'بان كيك'), description: t('Fluffy stacks, generously topped.', 'طبقات هشة بتوبينج سخي.') },
  { slug: 'waffles', art: 'waffle', name: t('Waffles', 'وافل'), description: t('Crisp outside, soft inside.', 'مقرمش من بره وطري من جوه.') },
  { slug: 'crepes', art: 'crepe', name: t('Crepes', 'كريب'), description: t('Thin, warm and filled to the edge.', 'رقيق وسخن ومليان لآخره.') },
  { slug: 'fries', art: 'fries', name: t('Melty Fries', 'بطاطس ميلتي'), description: t('Golden fries, loaded your way.', 'بطاطس دهبي محملة على مزاجك.') },
  { slug: 'chicken', art: 'chicken', name: t('Chicken', 'فراخ'), description: t('Crispy, juicy, made to order.', 'مقرمشة وطرية ومتحضرة مخصوص.') },
  { slug: 'ice-cream', art: 'icecream', name: t('Ice Cream', 'آيس كريم'), description: t('Cold scoops and sundaes.', 'بولات وصنداي ساقعة.') },
  { slug: 'cakes', art: 'cake', name: t('Cakes', 'كيك'), description: t('Rich slices for any time.', 'قطع غنية لأي وقت.') },
  { slug: 'drinks', art: 'drink', name: t('Drinks', 'مشروبات'), description: t('Shakes, coffee and cold drinks.', 'ميلك شيك وقهوة ومشروبات ساقعة.') },
];

// ---------------------------------------------------------------------------
// Products (placeholders)
// ---------------------------------------------------------------------------

export interface ProductSeed {
  slug: string;
  category: string; // category slug
  name: L;
  description: L;
  price: number;
  featured?: boolean;
  available?: boolean;
  optionGroups?: GroupSeed[];
}

export const products: ProductSeed[] = [
  // Pancakes
  {
    slug: 'lotus-pancake', category: 'pancakes', price: 180, featured: true,
    name: t('Lotus Pancake', 'بان كيك لوتس'),
    description: t('Fluffy pancake stack with Lotus spread, crumbled biscuits and caramel drizzle.', 'بان كيك هش بكريمة اللوتس وبسكوت مطحون وصوص كراميل.'),
    optionGroups: [size(40), sweetAddOns],
  },
  {
    slug: 'nutella-pancake', category: 'pancakes', price: 175,
    name: t('Nutella Pancake', 'بان كيك نوتيلا'),
    description: t('Warm pancakes layered with Nutella and hazelnut crunch.', 'بان كيك سخن بطبقات نوتيلا وبندق مقرمش.'),
    optionGroups: [size(40), sweetAddOns],
  },
  {
    slug: 'pistachio-pancake', category: 'pancakes', price: 210,
    name: t('Pistachio Pancake', 'بان كيك فستق'),
    description: t('Pistachio cream, white chocolate and crushed pistachios.', 'كريمة فستق وشوكولاتة بيضاء وفستق مجروش.'),
    optionGroups: [size(45), sweetAddOns],
  },
  {
    slug: 'mini-pancakes', category: 'pancakes', price: 150,
    name: t('Mini Pancakes', 'ميني بان كيك'),
    description: t('Bite-sized pancakes with your choice of sauce.', 'بان كيك صغير بالصوص اللي تختاره.'),
    optionGroups: [sauceDrizzle, sweetAddOns],
  },

  // Waffles
  {
    slug: 'kinder-waffle', category: 'waffles', price: 195, featured: true,
    name: t('Kinder Waffle', 'وافل كيندر'),
    description: t('Belgian waffle with Kinder cream, Kinder bueno and milk chocolate.', 'وافل بلجيكي بكريمة كيندر وكيندر بوينو وشوكولاتة باللبن.'),
    optionGroups: [size(40), sweetAddOns],
  },
  {
    slug: 'classic-waffle', category: 'waffles', price: 140,
    name: t('Classic Waffle', 'وافل كلاسيك'),
    description: t('Golden waffle with your choice of chocolate sauce.', 'وافل دهبي بصوص الشوكولاتة اللي تحبه.'),
    optionGroups: [sauceDrizzle, sweetAddOns],
  },
  {
    slug: 'waffle-on-a-stick', category: 'waffles', price: 95,
    name: t('Waffle on a Stick', 'وافل ستيك'),
    description: t('Dipped waffle stick, perfect for walking around the mall.', 'وافل على عصاية متغطس، مثالي وانت بتتمشى في المول.'),
    optionGroups: [sauceDrizzle],
  },

  // Crepes
  {
    slug: 'melty-crepe', category: 'crepes', price: 170, featured: true,
    name: t('Melty Signature Crepe', 'كريب ميلتي المميز'),
    description: t('Nutella, Lotus and white chocolate folded into a warm crepe.', 'نوتيلا ولوتس وشوكولاتة بيضاء في كريب سخن.'),
    optionGroups: [sweetAddOns],
  },
  {
    slug: 'strawberry-crepe', category: 'crepes', price: 160,
    name: t('Strawberry Crepe', 'كريب فراولة'),
    description: t('Fresh strawberries with milk chocolate and whipped cream.', 'فراولة فريش بشوكولاتة باللبن وكريمة شانتيه.'),
    optionGroups: [sweetAddOns],
  },
  {
    slug: 'banana-crepe', category: 'crepes', price: 140,
    name: t('Banana Nutella Crepe', 'كريب موز ونوتيلا'),
    description: t('Classic banana and Nutella combination.', 'الكومبو الكلاسيك موز ونوتيلا.'),
    optionGroups: [sweetAddOns],
    available: false, // demonstrates the "sold out" state
  },

  // Fries
  {
    slug: 'melty-loaded-fries', category: 'fries', price: 120, featured: true,
    name: t('Melty Loaded Fries', 'بطاطس ميلتي لودد'),
    description: t('Crispy fries smothered in melted cheddar, crispy chicken bits and Melty sauce.', 'بطاطس مقرمشة بالشيدر السايح وقطع فراخ كرسبي وصوص ميلتي.'),
    optionGroups: [friesSize, dips],
  },
  {
    slug: 'classic-fries', category: 'fries', price: 70,
    name: t('Classic Fries', 'بطاطس كلاسيك'),
    description: t('Golden, salted, perfectly crisp.', 'دهبي ومملح ومقرمش بالظبط.'),
    optionGroups: [friesSize, dips],
  },
  {
    slug: 'cheese-fries', category: 'fries', price: 95,
    name: t('Cheese Fries', 'بطاطس بالجبنة'),
    description: t('Fries topped with warm cheddar cheese sauce.', 'بطاطس عليها صوص شيدر سخن.'),
    optionGroups: [friesSize, dips],
  },

  // Chicken
  {
    slug: 'crispy-strips', category: 'chicken', price: 190, featured: true,
    name: t('Crispy Chicken Strips', 'استربس فراخ كرسبي'),
    description: t('Hand-breaded chicken strips, crispy and juicy.', 'استربس فراخ متغلفة باليد، مقرمشة وطرية.'),
    optionGroups: [chickenPieces, spice, dips],
  },
  {
    slug: 'chicken-box', category: 'chicken', price: 260,
    name: t('Melty Chicken Box', 'بوكس فراخ ميلتي'),
    description: t('Chicken strips, regular fries and two dips in one box.', 'استربس فراخ وبطاطس عادي واتنين صوص في بوكس واحد.'),
    optionGroups: [spice, dips],
  },
  {
    slug: 'popcorn-chicken', category: 'chicken', price: 150,
    name: t('Popcorn Chicken', 'بوب كورن تشيكن'),
    description: t('Bite-sized crispy chicken, great for sharing.', 'قطع فراخ كرسبي صغيرة، تنفع للمشاركة.'),
    optionGroups: [size(50), spice, dips],
  },

  // Ice cream
  {
    slug: 'lotus-sundae', category: 'ice-cream', price: 130,
    name: t('Lotus Sundae', 'صنداي لوتس'),
    description: t('Vanilla ice cream, Lotus sauce and biscuit crumbs.', 'آيس كريم فانيليا وصوص لوتس وبسكوت مطحون.'),
    optionGroups: [scoops, iceCreamToppings],
  },
  {
    slug: 'brownie-sundae', category: 'ice-cream', price: 150,
    name: t('Brownie Sundae', 'صنداي براوني'),
    description: t('Warm brownie under cold ice cream and hot fudge.', 'براوني سخن تحت آيس كريم ساقع وهوت فادج.'),
    optionGroups: [scoops, iceCreamToppings],
  },

  // Cakes
  {
    slug: 'molten-cake', category: 'cakes', price: 145, featured: true,
    name: t('Molten Chocolate Cake', 'مولتن كيك'),
    description: t('Warm chocolate cake with a melting center.', 'كيكة شوكولاتة سخنة قلبها سايح.'),
    optionGroups: [{ name: t('Serve with', 'تتقدم مع'), selection: 'multiple', maxSelections: 2, choices: [
      { name: t('Vanilla ice cream', 'آيس كريم فانيليا'), priceModifier: 35 },
      { name: t('Whipped cream', 'كريمة شانتيه'), priceModifier: 15 },
    ] }],
  },
  {
    slug: 'san-sebastian', category: 'cakes', price: 165, featured: true,
    name: t('San Sebastian Cheesecake', 'تشيز كيك سان سباستيان'),
    description: t('Burnt Basque cheesecake, creamy center.', 'تشيز كيك محروق من بره وكريمي من جوه.'),
    optionGroups: [{ name: t('Topping', 'التوبينج'), selection: 'single', required: true, choices: [
      { name: t('Plain', 'سادة'), isDefault: true },
      { name: t('Nutella', 'نوتيلا'), priceModifier: 25 },
      { name: t('Pistachio', 'فستق'), priceModifier: 35 },
    ] }],
  },
  {
    slug: 'red-velvet-slice', category: 'cakes', price: 125,
    name: t('Red Velvet Slice', 'قطعة ريد فيلفت'),
    description: t('Soft red velvet layers with cream cheese frosting.', 'طبقات ريد فيلفت طرية بكريمة الجبنة.'),
  },

  // Drinks
  {
    slug: 'lotus-shake', category: 'drinks', price: 120, featured: true,
    name: t('Lotus Milkshake', 'ميلك شيك لوتس'),
    description: t('Thick vanilla shake blended with Lotus biscuits.', 'ميلك شيك فانيليا تقيل متخفوق مع بسكوت لوتس.'),
    optionGroups: [drinkSize(25), milkChoice],
  },
  {
    slug: 'iced-spanish-latte', category: 'drinks', price: 95,
    name: t('Iced Spanish Latte', 'آيس سبانش لاتيه'),
    description: t('Espresso, condensed milk and cold milk over ice.', 'اسبريسو ولبن مكثف ولبن ساقع على تلج.'),
    optionGroups: [drinkSize(20), milkChoice],
  },
  {
    slug: 'fresh-lemonade', category: 'drinks', price: 65,
    name: t('Fresh Mint Lemonade', 'ليمون نعناع فريش'),
    description: t('Freshly squeezed lemon with mint.', 'ليمون معصور فريش بالنعناع.'),
    optionGroups: [drinkSize(15)],
  },
  {
    slug: 'soft-drink', category: 'drinks', price: 35,
    name: t('Soft Drink', 'مشروب غازي'),
    description: t('Chilled can.', 'كانز ساقع.'),
    optionGroups: [{ name: t('Flavor', 'النوع'), selection: 'single', required: true, choices: [
      { name: t('Cola', 'كولا'), isDefault: true },
      { name: t('Diet cola', 'كولا دايت') },
      { name: t('Lemon-lime', 'ليمون') },
      { name: t('Orange', 'برتقال') },
    ] }],
  },
];

// ---------------------------------------------------------------------------
// Delivery areas (placeholders) — one city, a few areas, each with its own fee
// ---------------------------------------------------------------------------

export interface AreaSeed {
  city: L;
  name: L;
  fee: number;
}

const cairo = t('Cairo', 'القاهرة');

export const deliveryAreas: AreaSeed[] = [
  { city: cairo, name: t('Nasr City', 'مدينة نصر'), fee: 30 },
  { city: cairo, name: t('Heliopolis', 'مصر الجديدة'), fee: 40 },
  { city: cairo, name: t('New Cairo', 'القاهرة الجديدة'), fee: 50 },
];
