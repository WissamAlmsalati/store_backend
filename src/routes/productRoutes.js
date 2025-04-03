import express from 'express';
import {
    getProducts,
    getProduct,
    addProduct,
    updateProductDetails,
    removeProduct
} from '../controllers/productController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
// GET /api/products - list products, and if ?name=... is provided, perform a search
router.route('/').get(getProducts);

// GET /api/products/:id - get a specific product by its ID
router.route('/:id').get(getProduct);

// Admin routes (protected by verifyAdmin middleware)
router.use(verifyAdmin);
router.route('/').post(addProduct);
router.route('/:id').put(updateProductDetails).delete(removeProduct);

export default router;
