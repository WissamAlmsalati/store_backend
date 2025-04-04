import poolPromise from '../config/db.js';

// جلب جميع المستخدمين
export const getUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const [users] = await pool.query('SELECT id, username, email, role, image, created_at FROM users');

        // تحويل مسار الصورة إلى URL كامل
        const transformedUsers = users.map(user => ({
            ...user,
            image: user.image ? `${req.protocol}://${req.get('host')}/uploads/${user.image}` : null
        }));

        res.json(transformedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين.' });
    }
};

// جلب مستخدم معين
export const getUserById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const [users] = await pool.query('SELECT id, username, email, role, image, created_at FROM users WHERE id = ?', [req.params.id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على المستخدم' });
        }

        const user = users[0];
        user.image = user.image ? `${req.protocol}://${req.get('host')}/uploads/${user.image}` : null;

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدم.' });
    }
};

// إضافة مستخدم جديد
export const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'يرجى تقديم جميع البيانات المطلوبة.' });
        }

        const pool = await poolPromise;
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );

        res.status(201).json({ message: 'تمت إضافة المستخدم بنجاح', userId: result.insertId });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء إضافة المستخدم.' });
    }
};

// تحديث بيانات مستخدم
export const updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const pool = await poolPromise;
        await pool.query(
            'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?',
            [username, email, password, role, req.params.id]
        );

        res.json({ message: 'تم تحديث بيانات المستخدم بنجاح' });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث بيانات المستخدم.' });
    }
};
// حذف مستخدم
export const deleteUser = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.json({ message: 'تم حذف المستخدم بنجاح' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء حذف المستخدم.' });
    }
};



export const getUserByToken = async (req, res) => {
    try {
        const userId = req.user.id; // الحصول على ID المستخدم من التوكن
        const pool = await poolPromise;

        const [users] = await pool.query('SELECT id, username, email, role, image, created_at FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'لم يتم العثور على المستخدم' });
        }

        const user = users[0];
        user.image = user.image ? `${req.protocol}://${req.get('host')}/uploads/${user.image}` : null;

        res.json(user);
    } catch (error) {
        console.error("Error fetching user by token:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المستخدم.' });
    }
};