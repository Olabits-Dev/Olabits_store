import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.userId },
      include: { product: true }
    });
    res.json(wishlist.map(item => item.product));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle Wishlist
router.post('/:productId', authenticateToken, async (req, res) => {
  const productId = parseInt(req.params.productId);
  const userId = req.user.userId;

  try {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return res.json({ message: 'Removed from wishlist', added: false });
    } else {
      await prisma.wishlist.create({
        data: { userId, productId }
      });
      return res.json({ message: 'Added to wishlist', added: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
