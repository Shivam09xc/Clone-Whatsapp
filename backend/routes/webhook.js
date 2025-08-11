import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

export default (io) => {
  router.post('/', async (req, res) => {
    const payload = req.body;
    // Example: handle message status update or insert
    try {
      const { wa_id, name, message, timestamp, status, meta_msg_id } = payload;
      let msg = await Message.findOne({ meta_msg_id });
      if (msg) {
        msg.status = status;
        await msg.save();
        io.emit('statusUpdate', msg);
        return res.json({ updated: true });
      } else {
        const newMsg = await Message.create({ wa_id, name, message, timestamp, status, meta_msg_id });
        io.emit('newMessage', newMsg);
        return res.json({ inserted: true });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  return router;
};
