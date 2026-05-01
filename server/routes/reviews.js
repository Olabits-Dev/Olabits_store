import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a review
router.post('/:productId', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const productId = parseInt(req.params.productId);
  const userId = req.user.userId;

  try {
    // Check if user already reviewed
    const existing = await prisma.review.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId,
        productId
      },
      include: { user: { select: { name: true } } }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
