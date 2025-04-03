import express from 'express';
import {
  addItemToCart,
  getCartItems,
  deleteCartItem,
  clearCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All cart endpoints require authentication
router.use(authenticate);

router.post('/', addItemToCart);
router.get('/', getCartItems);
router.delete('/:id', deleteCartItem);
router.delete('/', clearCart);

export default router;
