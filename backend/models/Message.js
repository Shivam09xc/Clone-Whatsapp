import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  wa_id: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read'], required: true },
  meta_msg_id: { type: String, required: true }
}, { collection: 'processed_messages' });

export default mongoose.model('Message', messageSchema);
