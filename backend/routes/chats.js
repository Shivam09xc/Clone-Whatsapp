import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const chats = await Message.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          lastMessage: { $first: '$message' },
          lastTimestamp: { $first: '$timestamp' },
          status: { $first: '$status' },
          meta_msg_id: { $first: '$meta_msg_id' }
        }
      },
      {
        $sort: { lastTimestamp: -1 }
      }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
