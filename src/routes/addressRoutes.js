import express from 'express';
import {
  createAddress,
  listAddresses,
  updateAddressDetails,
  removeAddress
} from '../controllers/addressController.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyUser);

router.post('/', createAddress);
router.get('/', listAddresses);
router.put('/:id', updateAddressDetails);
router.delete('/:id', removeAddress);

export default router;
