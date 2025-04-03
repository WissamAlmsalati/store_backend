import express from 'express';
import {
  listCategories,
  getCategory,
  addCategory,
  updateCategoryDetails,
  removeCategory
} from '../controllers/categoryController.js';
import { verifyUser, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', listCategories);
router.get('/:id', getCategory);

// Admin protected routes
router.use(verifyUser);
router.use(verifyAdmin);
router.post('/', addCategory);
router.put('/:id', updateCategoryDetails);
router.delete('/:id', removeCategory);

export default router;
