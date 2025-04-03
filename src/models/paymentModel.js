import poolPromise from '../config/db.js';

export const createPayment = async (orderId, payment_method) => {
  const pool = await poolPromise;
  const [result] = await pool.query(
    'INSERT INTO payments (order_id, payment_method) VALUES (?, ?)',
    [orderId, payment_method]
  );
  return result.insertId;
};

export const getPaymentById = async (id) => {
  const pool = await poolPromise;
  const [payments] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
  return payments.length > 0 ? payments[0] : null;
};

export const updatePaymentStatus = async (id, status) => {
  const pool = await poolPromise;
  await pool.query('UPDATE payments SET status = ? WHERE id = ?', [status, id]);
};

export const deletePayment = async (id) => {
  const pool = await poolPromise;
  await pool.query('DELETE FROM payments WHERE id = ?', [id]);
};
