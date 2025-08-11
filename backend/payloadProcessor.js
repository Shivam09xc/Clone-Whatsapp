import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from './models/Message.js';

dotenv.config();

const payloadsDir = path.join(process.cwd(), 'backend', 'payloads');

async function processPayloads() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const files = fs.readdirSync(payloadsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(payloadsDir, file), 'utf8'));
    const { wa_id, name, message, timestamp, status, meta_msg_id } = data;
    let msg = await Message.findOne({ meta_msg_id });
    if (msg) {
      msg.status = status;
      await msg.save();
      console.log(`Updated: ${meta_msg_id}`);
    } else {
      await Message.create({ wa_id, name, message, timestamp, status, meta_msg_id });
      console.log(`Inserted: ${meta_msg_id}`);
    }
  }
  mongoose.disconnect();
}

processPayloads();
