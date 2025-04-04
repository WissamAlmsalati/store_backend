import poolPromise from '../config/db.js';
import { uploadSingle } from '../middleware/multer.js';  // Import the multer middleware

// جلب جميع المنتجات
export const getProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const percentage = req.query.percentage ? parseFloat(req.query.percentage) : 30;

        // لو في بحث بالاسم
        if (req.query.name) {
            const [products] = await pool.query(
                `SELECT p.*, c.name AS category_name 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id 
                 WHERE p.name LIKE ?`,
                [`%${req.query.name}%`]
            );
            if (products.length === 0) {
                return res.status(404).json({ message: 'لم يتم العثور على المنتج' });
            }

            const transformedProducts = products.map(product => {
                const price = parseFloat(product.price);
                const stock = parseInt(product.stock, 10);
                const increasedPrice = price * (1 + percentage / 100);
                const expectedProfit = (increasedPrice - price) * stock;

                return {
                    ...product,
                    image: product.image ? `${req.protocol}://${req.get('host')}/${product.image.replace(/\\/g, '/')}` : null,
                    expectedProfit: expectedProfit.toFixed(2),
                    increasedPrice: increasedPrice.toFixed(2),
                    percentageUsed: percentage
                };
            });

            return res.json(transformedProducts);
        }

        // عرض جميع المنتجات مع pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [products] = await pool.query(
            `SELECT p.*, c.name AS category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const transformedProducts = products.map(product => {
            const price = parseFloat(product.price);
            const stock = parseInt(product.stock, 10);
            const increasedPrice = price * (1 + percentage / 100);
            const expectedProfit = (increasedPrice - price) * stock;

            return {
                ...product,
                image: product.image ? `${req.protocol}://${req.get('host')}/${product.image.replace(/\\/g, '/')}` : null,
                expectedProfit: expectedProfit.toFixed(2),
                increasedPrice: increasedPrice.toFixed(2),
                percentageUsed: percentage
            };
        });

        const [totalProducts] = await pool.query('SELECT COUNT(*) AS count FROM products');
        const totalCount = totalProducts[0].count;
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            products: transformedProducts,
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

        const percentage = req.query.percentage ? parseFloat(req.query.percentage) : 30;

        const product = products[0];
        const price = parseFloat(product.price);
        const stock = parseInt(product.stock, 10);
        const increasedPrice = price * (1 + percentage / 100);
        const expectedProfit = (increasedPrice - price) * stock;

        // Return the found product with expected profit
        return res.json({
            ...product,
            expectedProfit: expectedProfit.toFixed(2),
            increasedPrice: increasedPrice.toFixed(2),
            percentageUsed: percentage
        });
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
            const { name, description, price, stock, category_id } = req.body; // Include category_id
            const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Normalize path for URL

            // Validate required fields
            if (!name || !description || !price || !stock || !category_id) {
                return res.status(400).json({ message: 'الرجاء تقديم جميع البيانات المطلوبة' });
            }

            const pool = await poolPromise;
            const [result] = await pool.query(
                'INSERT INTO products (name, description, price, stock, image, category_id) VALUES (?, ?, ?, ?, ?, ?)',
                [name, description, price, stock, imagePath, category_id]
            );

            // Construct the full image URL
            const imageUrl = imagePath ? `${req.protocol}://${req.get('host')}/${imagePath}` : null;

            res.status(201).json({ 
                message: 'تمت إضافة المنتج بنجاح', 
                productId: result.insertId,
                imageUrl // Return the full image URL
            });
        } catch (error) {
            console.error("Database error:", error); // Log database error
            res.status(500).json({ message: 'حدث خطأ أثناء إضافة المنتج.', error: error.message });
        }
    });
};

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



// حساب الأرباح المتوقعة
export const calculateExpectedProfits = async (req, res) => {
    try {
        console.log('🟢 API Request received at /calculateExpectedProfits');

        // ✅ Validate percentage input
        const percentage = parseFloat(req.query.percentage);
        if (isNaN(percentage) || percentage <= 0) {
            console.error('❌ Invalid percentage:', req.query.percentage);
            return res.status(400).json({ message: 'يرجى تقديم نسبة مئوية صحيحة أكبر من 0.' });
        }
        console.log(`✅ Valid percentage received: ${percentage}%`);

        // ✅ Establish DB connection
        const pool = await poolPromise;
        console.log('✅ Database connection established.');

        // ✅ Fetch products
        console.log("📌 Executing Query: SELECT id, name, price, stock FROM products;");
        const [products] = await pool.query('SELECT id, name, price, stock FROM products');

        console.log("📌 Raw Query Result:", products); // Log full query result

        // ❌ Check if products array is empty
        if (!products || products.length === 0) {
            console.warn('⚠️ No products found.');
            return res.status(404).json({ message: 'لم يتم العثور على أي منتجات في قاعدة البيانات' });
        }

        // ✅ Calculate profits
        const productsWithProfits = products.map(product => {
            console.log(`🔹 Processing product ID: ${product.id}, Name: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`);

            const increasedPrice = parseFloat(product.price) * (1 + percentage / 100);
            const expectedProfit = (increasedPrice - parseFloat(product.price)) * parseInt(product.stock, 10);

            return {
                id: product.id,
                name: product.name,
                originalPrice: parseFloat(product.price).toFixed(2),
                stock: parseInt(product.stock, 10),
                increasedPrice: increasedPrice.toFixed(2),
                expectedProfit: expectedProfit.toFixed(2)
            };
        });

        console.log('✅ Final Computed Profits:', productsWithProfits);

        res.json({
            message: 'تم حساب الأرباح المتوقعة بنجاح',
            products: productsWithProfits
        });

    } catch (error) {
        console.error("❌ Error calculating expected profits:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء حساب الأرباح المتوقعة.', error: error.message });
    }
};



export const getProductsByCategoryId = async (req, res) => {
    try {
        const pool = await poolPromise;
        const categoryId = req.params.category_id;

        const [products] = await pool.query(
            `SELECT p.*, c.name AS category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.category_id = ?`,
            [categoryId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على منتجات لهذه الفئة' });
        }

        const transformedProducts = products.map(product => ({
            ...product,
            image: product.image ? `${req.protocol}://${req.get('host')}/${product.image.replace(/\\/g, '/')}` : null
        }));

        res.json(transformedProducts);
    } catch (error) {
        console.error("Error fetching products by category ID:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المنتجات لهذه الفئة.' });
    }
};