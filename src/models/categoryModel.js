
import poolPromise from '../config/db.js';

export const getAllCategories = async () => {
  const pool = await poolPromise;
  const [categories] = await pool.query('SELECT * FROM categories');
  return categories;
};

export const getCategoryById = async (id) => {
  const pool = await poolPromise;
  const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return categories.length > 0 ? categories[0] : null;
};

export const createCategory = async (name) => {
  const pool = await poolPromise;
  const [result] = await pool.query(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );
  return result.insertId;
};

export const updateCategory = async (id, name) => {
  const pool = await poolPromise;
  await pool.query(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  );
};

export const deleteCategory = async (id) => {
  const pool = await poolPromise;
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
};
