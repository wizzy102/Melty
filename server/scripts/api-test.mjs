/**
 * End-to-end API checks against a RUNNING server with the seeded placeholder menu.
 *
 *   npm run test:api            (from the project root, while `npm run dev` is running)
 *
 * Env overrides: API_URL (default http://localhost:4000/api), ADMIN_USERNAME, ADMIN_PASSWORD.
 * Note: it places a few real test orders and briefly toggles one product's availability,
 * so run it against development data only.
 */
const B = process.env.API_URL ?? 'http://localhost:4000/api';
const ADMIN_USER = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? 'melty-demo-2026';

for (let i = 0; i < 40; i++) {
  try {
    if ((await fetch(B + '/health')).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const j = async (path, opts = {}) => {
  const r = await fetch(B + path, { ...opts, headers: { 'content-type': 'application/json', ...(opts.headers || {}) } });
  return { status: r.status, body: await r.json().catch(() => null), headers: r.headers };
};
const post = (p, body, h) => j(p, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: h });
let fails = 0;
const ok = (label, cond, extra = '') => {
  if (!cond) fails++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? '  -> ' + extra : ''}`);
};

// ---- public menu
const menu = (await j('/menu')).body;
ok('menu loads', menu.categories.length > 0 && menu.products.length > 0, `${menu.categories.length} categories / ${menu.products.length} products`);
ok('no internal fields leaked', !('createdAt' in menu.products[0]) && !('__v' in menu.products[0]) && !('_id' in menu.products[0]));
const areas = (await j('/delivery-areas')).body.areas;
ok('delivery areas load', areas.length > 0, areas.map((a) => `${a.name.en}=${a.fee}`).join(', '));

const lotus = menu.products.find((p) => p.slug === 'lotus-pancake');
const sizeG = lotus.optionGroups[0];
const addG = lotus.optionGroups[1];
const large = sizeG.choices.find((c) => c.name.en === 'Large');
const nutella = addG.choices.find((c) => c.name.en === 'Extra Nutella');
const kinder = addG.choices.find((c) => c.name.en === 'Kinder');
const line = {
  productId: lotus.id,
  quantity: 2,
  selections: [
    { groupId: sizeG.id, choiceIds: [large.id] },
    { groupId: addG.id, choiceIds: [nutella.id, kinder.id] },
  ],
};
const area = areas[1] ?? areas[0];
const expectedUnit = lotus.price + large.priceModifier + nutella.priceModifier + kinder.priceModifier;
const expectedTotal = expectedUnit * 2 + area.fee;

// ---- pricing
const q = await post('/orders/quote', { items: [line], areaId: area.id });
ok('server quote math', q.body.subtotal === expectedUnit * 2 && q.body.deliveryFee === area.fee && q.body.total === expectedTotal, JSON.stringify({ subtotal: q.body.subtotal, fee: q.body.deliveryFee, total: q.body.total }));

const customer = { name: 'Test Customer', phone: '+20 100 123 4567' };
const delivery = { areaId: area.id, address: '12 Test Street, Floor 3', instructions: 'Leave at door' };
const tampered = await post('/orders', { items: [{ ...line, price: 1, unitPrice: 1 }], customer, delivery: { ...delivery, fee: 0 }, subtotal: 1, deliveryFee: 0, total: 1 });
ok('order created; manipulated price/fee/total ignored', tampered.status === 201 && tampered.body.order.total === expectedTotal, `status ${tampered.status}, total ${tampered.body?.order?.total}, #${tampered.body?.order?.orderNumber}`);

// ---- invalid orders
const bad = async (label, body, expectStatus, expectCode) => {
  const r = await post('/orders', body);
  const codes = [r.body?.error?.code, ...(r.body?.error?.details?.map?.((d) => d.code) ?? [])];
  ok(label, r.status === expectStatus && codes.includes(expectCode), `${r.status} ${JSON.stringify(r.body?.error)}`.slice(0, 160));
};
await bad('missing name', { items: [line], customer: { ...customer, name: '' }, delivery }, 400, 'name_required');
await bad('name of only invisible characters', { items: [line], customer: { ...customer, name: '‮\u0007⁦' }, delivery }, 400, 'name_required');
await bad('invalid phone', { items: [line], customer: { ...customer, phone: '12345' }, delivery }, 400, 'phone_invalid');
await bad('missing address', { items: [line], customer, delivery: { ...delivery, address: '' } }, 400, 'address_required');
await bad('empty cart', { items: [], customer, delivery }, 400, 'cart_empty');
await bad('invalid product id (format)', { items: [{ ...line, productId: 'abc' }], customer, delivery }, 400, 'invalid_id');
await bad('unknown product id', { items: [{ ...line, productId: '0123456789abcdef01234567' }], customer, delivery }, 400, 'product_not_found');
await bad('quantity 0', { items: [{ ...line, quantity: 0 }], customer, delivery }, 400, 'invalid_quantity');
await bad('quantity 999', { items: [{ ...line, quantity: 999 }], customer, delivery }, 400, 'invalid_quantity');
await bad('fractional quantity', { items: [{ ...line, quantity: 1.5 }], customer, delivery }, 400, 'invalid_quantity');
const soldOut = menu.products.find((p) => !p.available);
if (soldOut) {
  await bad('unavailable product', { items: [{ productId: soldOut.id, quantity: 1, selections: [] }], customer, delivery }, 409, 'product_unavailable');
} else {
  ok('unavailable product (needs one sold-out item — run `npm run seed`)', false);
}
await bad('missing required option (size)', { items: [{ ...line, selections: [] }], customer, delivery }, 400, 'option_required');
await bad('two choices in single group', { items: [{ ...line, selections: [{ groupId: sizeG.id, choiceIds: sizeG.choices.map((c) => c.id) }] }], customer, delivery }, 400, 'invalid_option');
await bad('choice from another product', { items: [{ ...line, selections: [{ groupId: sizeG.id, choiceIds: [menu.products[5].optionGroups[0].choices[0].id] }] }], customer, delivery }, 400, 'invalid_option');
await bad('too many add-ons', { items: [{ ...line, selections: [line.selections[0], { groupId: addG.id, choiceIds: addG.choices.map((c) => c.id) }] }], customer, delivery }, 400, 'too_many_selections');
await bad('unknown delivery area', { items: [line], customer, delivery: { ...delivery, areaId: '0123456789abcdef01234567' } }, 400, 'area_not_found');
await bad('NoSQL operator injection in areaId', { items: [line], customer, delivery: { ...delivery, areaId: { $ne: null } } }, 400, 'validation_failed');
const mal = await post('/orders', '{bad json');
ok('malformed JSON', mal.status === 400 && mal.body.error.code === 'invalid_json');

// ---- admin
const unauth = await j('/admin/orders');
ok('admin orders without session -> 401', unauth.status === 401, unauth.body.error.code);
const forged = await j('/admin/orders', { headers: { cookie: 'melty_admin=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4Iiwicm9sZSI6ImFkbWluIn0.invalid' } });
ok('forged/invalid token -> 401', forged.status === 401, forged.body.error.code);
const wrong = await post('/admin/auth/login', { username: ADMIN_USER, password: 'definitely-wrong' });
ok('wrong password -> 401', wrong.status === 401, wrong.body.error.code);
const login = await post('/admin/auth/login', { username: ADMIN_USER, password: ADMIN_PASS });
const setCookie = login.headers.get('set-cookie') || '';
ok('login ok, httpOnly + SameSite=Strict cookie', login.status === 200 && /HttpOnly/i.test(setCookie) && /SameSite=Strict/i.test(setCookie), login.body?.error?.code);
const cookie = setCookie.split(';')[0];
const list = await j('/admin/orders', { headers: { cookie } });
ok('admin sees orders', list.status === 200 && list.body.orders.length >= 1, `${list.body.orders?.length} orders, counts ${JSON.stringify(list.body.counts)}`);
const newest = list.body.orders[0];
const det = await j('/admin/orders/' + newest.id, { headers: { cookie } });
ok('order detail exact', det.body.order.customer.phone === '01001234567' && det.body.order.items[0].selections.length === 3 && det.body.order.total === expectedTotal, `phone normalized to ${det.body.order.customer.phone}`);

// hidden-character stripping (checked through the admin view of a fresh order)
const sneaky = await post('/orders', { items: [line], customer: { ...customer, name: 'Evil‮gnirts\u0007 Name' }, delivery: { ...delivery, address: 'Line one⁦\nLine two\u0000' } });
const sneakyDet = sneaky.status === 201 ? (await j('/admin/orders/' + (await j('/admin/orders', { headers: { cookie } })).body.orders[0].id, { headers: { cookie } })).body.order : null;
ok('invisible/bidi characters stripped from customer text', sneakyDet && sneakyDet.customer.name === 'Evilgnirts Name' && sneakyDet.delivery.address === 'Line one\nLine two', JSON.stringify(sneakyDet?.customer.name));

const upd = await j('/admin/orders/' + newest.id + '/status', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ status: 'confirmed' }) });
ok('status update', upd.body.order.status === 'confirmed' && upd.body.order.statusHistory.length === 2);
const same = await j('/admin/orders/' + newest.id + '/status', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ status: 'confirmed' }) });
ok('same status again does not duplicate history', same.body.order.statusHistory.length === 2);
const badStatus = await j('/admin/orders/' + newest.id + '/status', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ status: 'paid' }) });
ok('invalid status rejected', badStatus.status === 400);
const badId = await j('/admin/orders/not-an-id', { headers: { cookie } });
ok('bad order id -> 400', badId.status === 400);
const tog = await j('/admin/products/' + lotus.id + '/availability', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ available: false }) });
ok('toggle availability', tog.body.product.available === false);
await j('/admin/products/' + lotus.id + '/availability', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ available: true }) });
const lo = await post('/admin/auth/logout', {}, { cookie });
ok('logout clears cookie', /melty_admin=;/.test(lo.headers.get('set-cookie') || ''));

console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exitCode = fails ? 1 : 0;
