import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function seedUsers() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = [
    {
      wa_id: 'user1',
      name: 'Alice',
      password: await bcrypt.hash('password1', 10),
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      online: true
    },
    {
      wa_id: 'user2',
      name: 'Bob',
      password: await bcrypt.hash('password2', 10),
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      online: false
    }
  ];
  for (const user of users) {
    await User.findOneAndUpdate({ wa_id: user.wa_id }, user, { upsert: true });
    console.log(`Seeded user: ${user.name}`);
  }
  mongoose.disconnect();
}

seedUsers();
