import express from 'express';
import {
  placeOrder,
  getOrder,
  listUserOrders,
  changeOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// All endpoints below require authentication
router.use(verifyUser);

router.post('/', placeOrder);
router.get('/:id', getOrder);
router.get('/', listUserOrders);
router.put('/:id', changeOrderStatus);
router.delete('/:id', cancelOrder);

export default router;
