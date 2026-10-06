import type { MessageKey } from './en';

/** Arabic UI copy (Egyptian, friendly). Western digits are used everywhere. */
export const ar: Record<MessageKey, string> = {
  // Brand / global
  'brand.tagline': 'معمول عشان نفسك فيه.',
  'brand.taglineSub': 'مليان طعم. ومش هيتنسي.',
  'lang.switch': 'English',
  'lang.switchLabel': 'تغيير اللغة إلى الإنجليزية',
  'nav.home': 'الرئيسية',
  'nav.menu': 'المنيو',
  'nav.cart': 'السلة',
  'nav.openCart': 'افتح السلة، {count} منتجات',
  'common.back': 'رجوع',
  'common.close': 'إغلاق',
  'common.retry': 'حاول تاني',
  'common.loading': 'جاري التحميل…',
  'common.seeAll': 'عرض الكل',
  'common.optional': 'اختياري',
  'common.required': 'مطلوب',

  // Prices
  'price.from': 'من {price}',
  'price.free': 'مجاناً',

  // Home
  'home.hero.eyebrow': 'حلويات · بطاطس · فراخ',
  'home.hero.cta': 'تصفح المنيو',
  'home.hero.secondary': 'إزاي تطلب',
  'home.hero.badge': 'اطلب دليفري',
  'home.categories.title': 'نفسك في إيه؟',
  'home.categories.sub': 'اختار قسم وابدأ.',
  'home.featured.title': 'مفضلات ميلتي',
  'home.featured.sub': 'اللي الكل بيرجع عشانها.',
  'home.how.title': 'الطلب سهل',
  'home.how.1.title': 'اختار اللي نفسك فيه',
  'home.how.1.body': 'اتفرج على المنيو واختار اللي على مزاجك.',
  'home.how.2.title': 'ظبطه على مزاجك',
  'home.how.2.body': 'اختار الحجم والإضافات، والسعر بيتحدث قدامك.',
  'home.how.3.title': 'بنوصلك',
  'home.how.3.body': 'ابعت طلبك وميلتي هتتواصل معاك قريب للتأكيد.',
  'home.cta.title': 'جعت خلاص؟',
  'home.cta.body': 'المنيو كله على بعد ضغطة.',

  // Product card
  'product.add': 'أضف',
  'product.addNamed': 'أضف {name}',
  'product.soldOut': 'خلصان',
  'product.customizable': 'قابل للتعديل',

  // Menu page
  'menu.title': 'المنيو',
  'menu.sub': 'حلويات وبطاطس وفراخ ومشروبات — بتتعمل مخصوص ليك.',
  'menu.search': 'دور في المنيو',
  'menu.searchClear': 'امسح البحث',
  'menu.results': '{count} نتيجة لـ «{query}»',
  'menu.noResults.title': 'مفيش حاجة بـ «{query}»',
  'menu.noResults.body': 'جرب كلمة تانية، أو اتفرج على الأقسام.',
  'menu.categories': 'أقسام المنيو',

  // Product page
  'product.basePrice': 'السعر الأساسي',
  'product.chooseOne': 'اختار 1',
  'product.chooseUpTo': 'اختار لحد {max}',
  'product.chooseAny': 'اختار براحتك',
  'product.selectedCount': '{count}/{max} مختار',
  'product.quantity': 'الكمية',
  'product.addToCart': 'أضف للسلة',
  'product.update': 'حدّث الطلب',
  'product.yourOrder': 'اختياراتك',
  'product.each': '{price} للواحد',
  'product.soldOutBody': 'المنتج ده خلصان دلوقتي. ارجع تاني قريب!',
  'product.choiceSoldOut': 'خلصان',
  'product.notFound.title': 'المنتج ده مش في المنيو',
  'product.notFound.body': 'ممكن يكون اتشال. اتفرج على باقي المنيو.',
  'product.backToMenu': 'ارجع للمنيو',
  'product.added': '{name} اتضاف للسلة',
  'product.updated': 'الطلب اتحدّث',
  'error.option_required': 'من فضلك اختار من هنا.',
  'error.too_many_selections': 'اخترت أكتر من المسموح — شيل واحدة.',

  // Cart page
  'cart.title': 'سلتك',
  'cart.empty.title': 'السلة فاضية',
  'cart.empty.body': 'ضيف حاجة حلوة من المنيو وابدأ.',
  'cart.empty.cta': 'تصفح المنيو',
  'cart.edit': 'تعديل',
  'cart.remove': 'حذف',
  'cart.removeNamed': 'احذف {name}',
  'cart.unitPrice': '{price} للواحد',
  'cart.problem.missing': 'المنتج ده مبقاش في المنيو. من فضلك احذفه.',
  'cart.problem.unavailable': 'المنتج ده خلص دلوقتي. احذفه عشان تكمل.',
  'cart.summary': 'ملخص الطلب',
  'cart.subtotal': 'المجموع',
  'cart.deliveryFee': 'مصاريف التوصيل',
  'cart.deliverTo': 'التوصيل لـ',
  'cart.feeFrom': 'من {price}',
  'cart.feeHint': 'اختار منطقتك عشان تشوف مصاريف التوصيل بالظبط.',
  'cart.total': 'الإجمالي',
  'cart.totalPlusDelivery': '{price} + التوصيل',
  'cart.checkout': 'كمّل الطلب',
  'cart.addMore': 'ضيف حاجات تانية',
  'cart.fixProblems': 'احذف المنتجات الخلصانة عشان تكمل.',

  // Cart bar
  'cartbar.view': 'عرض السلة',
  'cartbar.items': '{count} منتجات',
  'cartbar.item': 'منتج واحد',

  // States
  'state.error.title': 'حصلت مشكلة',
  'state.error.body': 'مقدرناش نحمل ده دلوقتي. اتأكد من الإنترنت وحاول تاني.',
  'state.notFound.title': 'الصفحة مش موجودة',
  'state.notFound.body': 'الصفحة اللي بتدور عليها مش موجودة.',
  'state.notFound.cta': 'ارجع للرئيسية',
  'state.soon.title': 'جاية في المرحلة الجاية',
  'state.soon.body': 'الشاشة دي جزء من المرحلة الجاية في بناء النموذج.',

  // Footer
  'footer.followUs': 'تابع ميلتي',
  'footer.prototype': 'نموذج تجريبي — المنيو والأسعار ومصاريف التوصيل المعروضة للتوضيح فقط.',
  'footer.rights': '© {year} ميلتي',

  // Forms (shared)
  'form.name': 'الاسم بالكامل',
  'form.phone': 'رقم الموبايل',
  'form.phoneHint': 'موبايل مصري، مثال: 010 1234 5678',
  'form.area': 'المنطقة',
  'form.areaPlaceholder': 'اختار منطقتك',
  'form.address': 'العنوان بالتفصيل',
  'form.instructions': 'تعليمات التوصيل',

  // Error codes from the API
  'error.network_error': 'مش قادرين نوصل لميلتي دلوقتي. اتأكد من الإنترنت.',
  'error.server_error': 'حصلت مشكلة عندنا. حاول تاني من فضلك.',
  'error.name_required': 'من فضلك اكتب اسمك.',
  'error.phone_required': 'من فضلك اكتب رقم موبايلك.',
  'error.phone_invalid': 'اكتب رقم موبايل مصري صحيح (مثال: 01012345678).',
  'error.address_required': 'من فضلك اكتب عنوانك بالتفصيل.',
  'error.area_not_found': 'من فضلك اختار منطقة التوصيل.',
  'error.too_long': 'النص ده طويل زيادة.',
};
