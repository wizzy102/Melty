/**
 * Replaces the menu + delivery areas with the placeholder data in ./data.ts.
 *
 *   npm run seed                         → menu + areas (orders untouched)
 *   npm run seed -- --sample-orders      → also adds a few demo orders
 *   npm run seed -- --reset-orders       → also deletes ALL orders
 */
import { connectDb, disconnectDb } from '../db.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { DeliveryArea } from '../models/DeliveryArea.js';
import { Order, type OrderStatus } from '../models/Order.js';
import { Counter, nextSequence } from '../models/Counter.js';
import { priceCart } from '../services/pricing.js';
import { categories, deliveryAreas, products } from './data.js';

const args = new Set(process.argv.slice(2));

async function seedMenu() {
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), DeliveryArea.deleteMany({})]);

  const createdCategories = await Category.insertMany(
    categories.map((c, i) => ({ ...c, displayOrder: i, active: true })),
  );
  const categoryId = new Map(createdCategories.map((c) => [c.slug, c._id]));

  await Product.insertMany(
    products.map((p, i) => {
      const category = categoryId.get(p.category);
      if (!category) throw new Error(`Unknown category "${p.category}" for product "${p.slug}"`);
      return { ...p, category, displayOrder: i, available: p.available ?? true };
    }),
  );

  await DeliveryArea.insertMany(deliveryAreas.map((a, i) => ({ ...a, displayOrder: i, active: true })));

  console.log(
    `[seed] ${createdCategories.length} categories, ${products.length} products, ${deliveryAreas.length} delivery areas`,
  );
}

const SAMPLE_CUSTOMERS = [
  { name: 'Mariam Adel', phone: '01012345678', address: '14 Abbas El Akkad St., Building 3, Floor 5, Apt 12', instructions: 'Ring the bell twice please' },
  { name: 'Youssef Hany', phone: '01123456789', address: '7 Merghany St., next to the pharmacy, Floor 2', instructions: '' },
  { name: 'Nour Khaled', phone: '01234567890', address: 'Fifth Settlement, District 1, Villa 22', instructions: 'Call when you arrive at the gate' },
  { name: 'Omar Tarek', phone: '01556789012', address: '33 Makram Ebeid St., Floor 8, Apt 81', instructions: '' },
];

async function seedSampleOrders() {
  const allProducts = await Product.find({ available: true }).lean();
  const areas = await DeliveryArea.find().lean();
  const statuses: OrderStatus[] = ['new', 'new', 'preparing', 'completed'];

  for (const [i, customer] of SAMPLE_CUSTOMERS.entries()) {
    // Two products per order, picking each group's default / first choice.
    const lines = [allProducts[(i * 5) % allProducts.length], allProducts[(i * 5 + 3) % allProducts.length]].map(
      (p, j) => ({
        productId: String(p._id),
        quantity: j + 1,
        selections: p.optionGroups
          .filter((g) => g.required)
          .map((g) => ({
            groupId: String(g._id),
            choiceIds: [String((g.choices.find((c) => c.isDefault) ?? g.choices[0])._id)],
          })),
      }),
    );
    const { items, subtotal } = await priceCart(lines);
    const area = areas[i % areas.length];
    const status = statuses[i];
    const createdAt = new Date(Date.now() - (SAMPLE_CUSTOMERS.length - i) * 17 * 60 * 1000);

    await Order.create({
      orderNumber: await nextSequence('order'),
      customer: { name: customer.name, phone: customer.phone },
      fulfillmentType: 'delivery',
      delivery: {
        area: area._id,
        city: area.city,
        areaName: area.name,
        address: customer.address,
        instructions: customer.instructions,
      },
      items,
      subtotal,
      deliveryFee: area.fee,
      total: subtotal + area.fee,
      status,
      statusHistory: status === 'new' ? [{ status: 'new', at: createdAt }] : [{ status: 'new', at: createdAt }, { status, at: new Date() }],
      createdAt,
    });
  }
  console.log(`[seed] ${SAMPLE_CUSTOMERS.length} sample orders`);
}

async function main() {
  await connectDb();

  if (args.has('--reset-orders')) {
    await Promise.all([Order.deleteMany({}), Counter.deleteOne({ _id: 'order' })]);
    console.log('[seed] all orders deleted');
  }

  await seedMenu();

  if (args.has('--sample-orders')) await seedSampleOrders();
}

main()
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
