import { Router } from 'express';
import { z } from 'zod';
import { Order, ORDER_STATUSES } from '../../models/Order.js';
import { notFound } from '../../utils/httpError.js';
import { assertObjectId } from '../../utils/validate.js';

export const adminOrdersRouter = Router();

const ListQuery = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

type OrderLean = Awaited<ReturnType<typeof loadOrder>>;
const loadOrder = (id: string) => Order.findById(id).lean();

const summarize = (o: NonNullable<OrderLean>) => ({
  id: String(o._id),
  orderNumber: o.orderNumber,
  createdAt: o.createdAt,
  status: o.status,
  customer: { name: o.customer.name, phone: o.customer.phone },
  area: { city: o.delivery.city, name: o.delivery.areaName },
  itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
  total: o.total,
});

const detail = (o: NonNullable<OrderLean>) => ({
  ...summarize(o),
  updatedAt: o.updatedAt,
  locale: o.locale,
  fulfillmentType: o.fulfillmentType,
  delivery: {
    city: o.delivery.city,
    area: o.delivery.areaName,
    address: o.delivery.address,
    instructions: o.delivery.instructions,
  },
  items: o.items.map((i) => ({
    productId: String(i.product),
    name: i.name,
    basePrice: i.basePrice,
    unitPrice: i.unitPrice,
    quantity: i.quantity,
    lineTotal: i.lineTotal,
    selections: i.selections.map((s) => ({
      groupName: s.groupName,
      choiceName: s.choiceName,
      priceModifier: s.priceModifier,
    })),
  })),
  subtotal: o.subtotal,
  deliveryFee: o.deliveryFee,
  statusHistory: o.statusHistory.map((h) => ({ status: h.status, at: h.at })),
});

/** Orders list + per-status counts. Polled by the dashboard. */
adminOrdersRouter.get('/', async (req, res) => {
  const { status, limit } = ListQuery.parse(req.query);

  const [orders, countsAgg] = await Promise.all([
    Order.find(status ? { status } : {}).sort({ createdAt: -1 }).limit(limit).lean(),
    Order.aggregate<{ _id: string; n: number }>([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
  ]);

  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<string, number>;
  for (const c of countsAgg) counts[c._id] = c.n;

  res.json({ orders: orders.map(summarize), counts, serverTime: new Date() });
});

adminOrdersRouter.get('/:id', async (req, res) => {
  const order = await loadOrder(assertObjectId(req.params.id));
  if (!order) throw notFound('order_not_found');
  res.json({ order: detail(order) });
});

const StatusInput = z.object({ status: z.enum(ORDER_STATUSES) });

adminOrdersRouter.patch('/:id/status', async (req, res) => {
  const id = assertObjectId(req.params.id);
  const { status } = StatusInput.parse(req.body);

  const current = await Order.findById(id).select('status').lean();
  if (!current) throw notFound('order_not_found');

  // Prototype rule: staff may move an order to any status (no enforced
  // workflow). Only record history when the status actually changes.
  if (current.status !== status) {
    await Order.updateOne({ _id: id }, { $set: { status }, $push: { statusHistory: { status, at: new Date() } } });
  }

  const order = await loadOrder(id);
  res.json({ order: detail(order!) });
});
