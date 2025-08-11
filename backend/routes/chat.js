import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:wa_id', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
