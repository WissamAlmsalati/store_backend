import express from 'express';
import {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getUserByToken
} from '../controllers/userController.js';
import { verifyAdmin,authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyAdmin);


router.get('/me', authenticate, getUserByToken);


// جلب جميع المستخدمين
router.get('/', getUsers);

// جلب مستخدم معين
router.get('/:id', getUserById);

// إضافة مستخدم جديد
router.post('/', addUser);

// تحديث بيانات مستخدم
router.put('/:id', updateUser);

// حذف مستخدم
router.delete('/:id', deleteUser);

export default router;