import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js';
import webhookRouter from './routes/webhook.js';
import chatsRouter from './routes/chats.js';
import chatRouter from './routes/chat.js';
import sendRouter from './routes/send.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import groupsRouter from './routes/groups.js';
import searchRouter from './routes/search.js';
import usersRouter from './routes/users.js';

dotenv.config();
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: "https://clone-whatsapp-dxbp.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

async function connectMongoDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;
    console.log('MongoDB URI available:', !!mongoURI);
    await mongoose.connect(mongoURI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Full error stack:', err.stack);
    throw err;
  }
}
connectMongoDB();

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('typing', ({ wa_id }) => {
    socket.broadcast.emit('typing', { wa_id });
  });
  socket.on('stopTyping', ({ wa_id }) => {
    socket.broadcast.emit('stopTyping', { wa_id });
  });
});

// API routes
app.use('/webhook', webhookRouter(io));
app.use('/chats', chatsRouter);
app.use('/chat', chatRouter);
app.use('/send', sendRouter(io));
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/groups', groupsRouter);
app.use('/search', searchRouter);
app.use('/users', usersRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'WhatsApp Clone Backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
