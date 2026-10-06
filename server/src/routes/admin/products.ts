import { Router } from 'express';
import { z } from 'zod';
import { Category } from '../../models/Category.js';
import { Product } from '../../models/Product.js';
import { notFound } from '../../utils/httpError.js';
import { assertObjectId } from '../../utils/validate.js';
import { serializeCategory, serializeProduct } from '../../services/serializers.js';

/**
 * Menu-management foundation. For the prototype staff can only toggle
 * availability ("sold out"). Full CRUD can be layered on these same models.
 */
export const adminProductsRouter = Router();

adminProductsRouter.get('/', async (_req, res) => {
  const [categories, products] = await Promise.all([
    Category.find().sort({ displayOrder: 1, _id: 1 }).lean(),
    Product.find().sort({ displayOrder: 1, _id: 1 }).lean(),
  ]);
  res.json({
    categories: categories.map(serializeCategory),
    products: products.map(serializeProduct),
  });
});

const AvailabilityInput = z.object({ available: z.boolean() });

adminProductsRouter.patch('/:id/availability', async (req, res) => {
  const id = assertObjectId(req.params.id);
  const { available } = AvailabilityInput.parse(req.body);
  const product = await Product.findByIdAndUpdate(id, { $set: { available } }, { returnDocument: 'after' }).lean();
  if (!product) throw notFound('product_not_found');
  res.json({ product: serializeProduct(product) });
});
