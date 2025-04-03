import poolPromise from '../config/db.js';
import { uploadSingle } from '../middleware/multer.js';  // Import the multer middleware

// جلب جميع المنتجات
export const getProducts = async (req, res) => {
    try {
        const pool = await poolPromise;

        // If a search term is provided via ?name=...
        if (req.query.name) {
            const [products] = await pool.query(
                'SELECT * FROM products WHERE name LIKE ?',
                [`%${req.query.name}%`]
            );
            if (products.length === 0) {
                return res.status(404).json({ message: 'لم يتم العثور على المنتج' });
            }
            // Return all matching products
            return res.json(products);
        }

        // Otherwise, list products with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [products] = await pool.query(
            'SELECT * FROM products LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Query total count for pagination info
        const [totalProducts] = await pool.query('SELECT COUNT(*) AS count FROM products');
        const totalCount = totalProducts[0].count;
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            products,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المنتجات.' });
    }
};

// جلب منتج معين
// Get a specific product by its ID
export const getProduct = async (req, res) => {
    try {
        const pool = await poolPromise;
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على المنتج' });
        }
        // Return the found product
        return res.json(products[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المنتج' });
    }
};


// إضافة منتج جديد
export const addProduct = async (req, res) => {
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err); // Log multer error
            return res.status(400).json({ message: 'خطأ في تحميل الملف', error: err.message });
        }

        try {
            const { name, description, price, stock } = req.body;
            const imagePath = req.file ? req.file.path : null; // Handle file path if file uploaded

            if (!name || !description || !price || !stock) {
                return res.status(400).json({ message: 'الرجاء تقديم جميع البيانات المطلوبة' });
            }

            const pool = await poolPromise;
            const [result] = await pool.query(
                'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)',
                [name, description, price, stock, imagePath]
            );

            res.status(201).json({ message: 'تمت إضافة المنتج بنجاح', productId: result.insertId });
        } catch (error) {
            console.error("Database error:", error); // Log database error
            res.status(500).json({ message: 'حدث خطأ أثناء إضافة المنتج.', error: error.message });
        }
    });
};

// تحديث منتج
export const updateProductDetails = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const pool = await poolPromise;
        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
            [name, description, price, stock, req.params.id]
        );

        res.json({ message: 'تم تحديث المنتج بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث المنتج.' });
    }
};

// حذف منتج
export const removeProduct = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        res.json({ message: 'تم حذف المنتج بنجاح' });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء حذف المنتج.' });
    }
};
