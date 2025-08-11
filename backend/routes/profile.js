import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/:wa_id', async (req, res) => {
  try {
    const user = await User.findOne({ wa_id: req.params.wa_id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update avatar
router.post('/:wa_id/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findOneAndUpdate({ wa_id: req.params.wa_id }, { avatar }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
