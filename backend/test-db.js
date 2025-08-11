import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connection successful!');
    await mongoose.disconnect();
    console.log('Disconnected successfully');
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();
