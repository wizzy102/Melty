import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { DeliveryArea } from '../models/DeliveryArea.js';
import { Order } from '../models/Order.js';
import { nextSequence } from '../models/Counter.js';
import { CreateOrderInput, QuoteInput } from '../services/orderInput.js';
import { getActiveArea, priceCart } from '../services/pricing.js';
import {
  serializeArea,
  serializeCategory,
  serializePricedLine,
  serializeProduct,
} from '../services/serializers.js';

export const publicRouter = Router();

/**
 * Entire public menu in one request: active categories and their products.
 * Unavailable products are included (shown as "sold out"), products in
 * inactive categories are not.
 */
publicRouter.get('/menu', async (_req, res) => {
  const categories = await Category.find({ active: true }).sort({ displayOrder: 1, _id: 1 }).lean();
  const products = await Product.find({ category: { $in: categories.map((c) => c._id) } })
    .sort({ displayOrder: 1, _id: 1 })
    .lean();

  res.json({
    categories: categories.map(serializeCategory),
    products: products.map(serializeProduct),
  });
});

publicRouter.get('/delivery-areas', async (_req, res) => {
  const areas = await DeliveryArea.find({ active: true }).sort({ displayOrder: 1, _id: 1 }).lean();
  res.json({ areas: areas.map(serializeArea) });
});

/** Server-priced preview used by the cart / review screens. */
publicRouter.post('/orders/quote', async (req, res) => {
  const input = QuoteInput.parse(req.body);
  const { items, subtotal } = await priceCart(input.items);
  const area = input.areaId ? await getActiveArea(input.areaId) : null;
  const deliveryFee = area?.fee ?? 0;

  res.json({
    items: items.map(serializePricedLine),
    subtotal,
    deliveryFee: area ? deliveryFee : null,
    total: subtotal + deliveryFee,
    area: area ? serializeArea(area) : null,
  });
});

// Basic abuse protection for anonymous order submission. Kept generous because
// customers on shared mall Wi-Fi can appear as a single IP address.
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  skip: () => !env.isProd,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'too_many_requests' } },
});

publicRouter.post('/orders', orderLimiter, async (req, res) => {
  const input = CreateOrderInput.parse(req.body);

  // Everything monetary is recomputed here from the database.
  const { items, subtotal } = await priceCart(input.items);
  const area = await getActiveArea(input.delivery.areaId);
  const deliveryFee = area.fee;
  const total = subtotal + deliveryFee;

  const order = await Order.create({
    orderNumber: await nextSequence('order'),
    customer: input.customer,
    fulfillmentType: 'delivery',
    delivery: {
      area: area._id,
      city: area.city,
      areaName: area.name,
      address: input.delivery.address,
      instructions: input.delivery.instructions,
    },
    items,
    subtotal,
    deliveryFee,
    total,
    locale: input.locale,
  });

  // The confirmation screen gets everything it needs from this response, so
  // there is no public "look up an order" endpoint that could leak data.
  res.status(201).json({
    order: {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      customerName: order.customer.name,
      area: { city: area.city, name: area.name },
      items: items.map(serializePricedLine),
      subtotal,
      deliveryFee,
      total,
    },
  });
});
