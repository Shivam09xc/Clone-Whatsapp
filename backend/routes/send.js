import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

export default (io) => {
  router.post('/', async (req, res) => {
    try {
      const { wa_id, name, message } = req.body;
      const newMsg = await Message.create({
        wa_id,
        name,
        message,
        timestamp: new Date(),
        status: 'sent',
        meta_msg_id: `${wa_id}-${Date.now()}`
      });
      io.emit('newMessage', newMsg);
      res.json(newMsg);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  return router;
};
