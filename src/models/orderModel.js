import poolPromise from '../config/db.js';

export const createOrder = async (userId, totalPrice) => {
  const pool = await poolPromise;
  const [result] = await pool.query(
    'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
    [userId, totalPrice]
  );
  return result.insertId;
};

export const getOrderById = async (orderId) => {
  const pool = await poolPromise;
  const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  return orders.length > 0 ? orders[0] : null;
};

export const getOrdersByUser = async (userId) => {
  const pool = await poolPromise;
  const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return orders;
};

export const updateOrderStatus = async (orderId, status) => {
  const pool = await poolPromise;
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
};

export const deleteOrder = async (orderId) => {
  const pool = await poolPromise;
  await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
};
