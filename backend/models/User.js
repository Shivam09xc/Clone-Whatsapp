import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  wa_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String }, // URL or base64
  online: { type: Boolean, default: false }
}, { collection: 'users' });

export default mongoose.model('User', userSchema);
