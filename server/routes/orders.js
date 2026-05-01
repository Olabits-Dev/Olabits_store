import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create Order (Checkout)
router.post('/', authenticateToken, async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.userId;

  try {
    // 1. Start a Transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      
      // 2. Validate stock levels for all items first
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product?.name || 'item'}`);
        }
      }

      // 3. Create the Order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          orderItems: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price, // Snapshot price at time of purchase
            })),
          },
        },
      });

      // 4. Update Inventory (Decrement stock)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      return order;
    });

    res.status(201).json({ message: 'Order placed successfully', order: result });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Checkout failed' });
  }
});

// Get User Orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
