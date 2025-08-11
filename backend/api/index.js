import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://whatsapp-clone-frontend-l04ligwu4.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: ["https://whatsapp-clone-frontend-l04ligwu4.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Add headers for CORS preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://whatsapp-clone-frontend-l04ligwu4.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// MongoDB connection with connection pooling
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Health check route
// Message schema
const messageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  status: String,
  meta_msg_id: String
});

// Create Message model
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// Health check endpoint
app.get('/api', async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({
      status: 'ok',
      message: 'WhatsApp Clone Backend is running',
      mongodb: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Send message endpoint
app.post('/api/send', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { wa_id, name, message } = req.body;
    
    if (!wa_id || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'wa_id and message are required'
      });
    }

    const newMessage = new Message({
      wa_id,
      name,
      message,
      timestamp: new Date(),
      status: 'sent',
      meta_msg_id: `${wa_id}-${Date.now()}`
    });

    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get messages endpoint
app.get('/api/messages', async (req, res) => {
  try {
    await connectToDatabase();
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('typing', ({ wa_id }) => {
    socket.broadcast.emit('typing', { wa_id });
  });

  socket.on('stopTyping', ({ wa_id }) => {
    socket.broadcast.emit('stopTyping', { wa_id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export the server instead of just the app
export default server;
