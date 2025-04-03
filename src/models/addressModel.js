import poolPromise from '../config/db.js';

export const addAddress = async (userId, address, city, country, postal_code) => {
  const pool = await poolPromise;
  const [result] = await pool.query(
    'INSERT INTO addresses (user_id, address, city, country, postal_code) VALUES (?, ?, ?, ?, ?)',
    [userId, address, city, country, postal_code]
  );
  return result.insertId;
};

export const getAddressesByUser = async (userId) => {
  const pool = await poolPromise;
  const [addresses] = await pool.query(
    'SELECT * FROM addresses WHERE user_id = ?',
    [userId]
  );
  return addresses;
};

export const updateAddress = async (id, address, city, country, postal_code) => {
  const pool = await poolPromise;
  await pool.query(
    'UPDATE addresses SET address = ?, city = ?, country = ?, postal_code = ? WHERE id = ?',
    [address, city, country, postal_code, id]
  );
};

export const deleteAddress = async (id) => {
  const pool = await poolPromise;
  await pool.query('DELETE FROM addresses WHERE id = ?', [id]);
};
