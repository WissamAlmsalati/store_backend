import express from 'express';
import {
  createAddress,
  listAddresses,
  updateAddressDetails,
  removeAddress
} from '../controllers/addressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createAddress);
router.get('/', listAddresses);
router.put('/:id', updateAddressDetails);
router.delete('/:id', removeAddress);

export default router;
