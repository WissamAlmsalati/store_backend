import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import poolPromise from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressesRoutes from './routes/addressRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// filepath: c:\Users\wissa\Documents\clothing-store-backend\src\index.js
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase URL-encoded payload limit to 10MB

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (pool) {
            res.json({ status: 'ok', database: 'connected' });
        } else {
            res.status(503).json({ status: 'error', database: 'disconnected' });
        }
    } catch (error) {
        console.error('Health check error:', error.message);
        res.status(503).json({ status: 'error', database: 'disconnected' });
    }
});


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressesRoutes);


(async () => {
    const pool = await poolPromise.catch(() => null);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        if (!pool) {
            console.warn('Server started, but database is not connected. Check MySQL status.');
        }
    });
})();