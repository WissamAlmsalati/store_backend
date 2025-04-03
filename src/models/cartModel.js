import poolPromise from '../config/db.js';

export const addCartItem = async (userId, productId, quantity = 1) => {
  const pool = await poolPromise;
  // Check if the item already exists in the user's cart
  const [existing] = await pool.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  if (existing.length > 0) {
    // Update the quantity
    await pool.query(
      'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
      [quantity, existing[0].id]
    );
    return existing[0].id;
  } else {
    // Insert new cart item
    const [result] = await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
    return result.insertId;
  }
};

export const getCartItemsByUser = async (userId) => {
  const pool = await poolPromise;
  const [items] = await pool.query('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
  return items;
};

export const removeCartItem = async (id) => {
  const pool = await poolPromise;
  await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
};

export const clearCartByUser = async (userId) => {
  const pool = await poolPromise;
  await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
};
