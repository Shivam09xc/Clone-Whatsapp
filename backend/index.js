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
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
