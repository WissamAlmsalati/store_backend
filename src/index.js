import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import poolPromise from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express ();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

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




app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);



(async () => {
    const pool = await poolPromise.catch(() => null);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        if (!pool) {
            console.warn('Server started, but database is not connected. Check MySQL status.');
        }
    });
})();