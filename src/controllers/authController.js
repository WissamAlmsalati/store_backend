import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserByUsernameOrEmail, createUser } from '../models/userModel.js';
import { generateToken } from '../utils/tokenUtils.js';

const saltRounds = 10;

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Restrict role to 'user' or 'admin', default to 'user' if invalid
    const userRole = ['admin', 'user'].includes(role) ? role : 'user';

    try {
        const existingUser = await findUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userId = await createUser(username, email, hashedPassword, userRole);

        const token = generateToken(userId, userRole);
        res.status(201).json({ token });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user.id, user.role);
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};
