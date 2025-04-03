import express from 'express';
import {
  makePayment,
  getPayment,
  changePaymentStatus,
  removePayment
} from '../controllers/paymentController.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyUser);

router.post('/', makePayment);
router.get('/:id', getPayment);
router.put('/:id', changePaymentStatus);
router.delete('/:id', removePayment);

export default router;
