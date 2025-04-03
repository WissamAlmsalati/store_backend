import poolPromise from '../config/db.js';

// جلب جميع المنتجات
export const getAllProducts = async () => {
    const pool = await poolPromise;
    const [products] = await pool.query('SELECT * FROM products');
    return products;
};

// جلب منتج معين عبر الـ ID
export const getProductById = async (productId) => {
    const pool = await poolPromise;
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    return products.length > 0 ? products[0] : null;
};

// إنشاء منتج جديد (يتطلب صلاحية Admin)
export const createProduct = async (name, description, price, stock, role) => {
    if (role !== 'admin') {
        throw new Error('Access denied. Only admins can add products.');
    }

    const pool = await poolPromise;
    const [result] = await pool.query(
        'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
        [name, description, price, stock]
    );
    return result.insertId;
};

// تحديث بيانات المنتج (يتطلب صلاحية Admin)
export const updateProduct = async (productId, name, description, price, stock, role) => {
    if (role !== 'admin') {
        throw new Error('Access denied. Only admins can update products.');
    }

    const pool = await poolPromise;
    await pool.query(
        'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
        [name, description, price, stock, productId]
    );
};

// حذف منتج (يتطلب صلاحية Admin)
export const deleteProduct = async (productId, role) => {
    if (role !== 'admin') {
        throw new Error('Access denied. Only admins can delete products.');
    }

    const pool = await poolPromise;
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
};
