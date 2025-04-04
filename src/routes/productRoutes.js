import express from 'express';
import {
    getProducts,
    getProduct,
    addProduct,
    updateProductDetails,
    removeProduct,
    calculateExpectedProfits,
    getProductsByCategoryId
} from '../controllers/productController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes

// حساب الأرباح المتوقعة
router.route('/profits-products').get(calculateExpectedProfits);
router.route('/:id').get(getProduct);

router.route('/').get(getProducts);

router.get('/category/:category_id', getProductsByCategoryId);


// Admin routes (protected by verifyAdmin middleware)
router.use(verifyAdmin);
router.route('/').post(addProduct);
router.route('/:id').put(updateProductDetails).delete(removeProduct);


export default router;