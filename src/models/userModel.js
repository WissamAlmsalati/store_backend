import poolPromise from '../config/db.js';

export const findUserByEmail = async (email) => {
    const pool = await poolPromise;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return users.length > 0 ? users[0] : null;
};

export const findUserByUsernameOrEmail = async (username, email) => {
    const pool = await poolPromise;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    return users.length > 0 ? users[0] : null;
};

export const createUser = async (username, email, hashedPassword, role) => {
    const pool = await poolPromise;
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
    );
    return result.insertId;
};
