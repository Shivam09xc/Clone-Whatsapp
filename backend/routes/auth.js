import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { wa_id, name, password, avatar } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ wa_id, name, password: hash, avatar });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { wa_id, password } = req.body;
    const user = await User.findOne({ wa_id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign({ wa_id: user.wa_id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
