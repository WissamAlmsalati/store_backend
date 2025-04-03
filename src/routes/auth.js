import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example admin-only endpoint
router.get('/admin', authenticate, restrictTo('admin'), (req, res) => {
    res.json({ message: 'Welcome, admin!' });
});

export default router;