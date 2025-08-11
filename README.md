# WhatsApp Web–like Chat App

This repository contains a full-stack WhatsApp Web–like chat application.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose
- **Frontend:** React, TailwindCSS
- **Bonus:** Socket.IO for real-time updates

## Features
- Webhook API for WhatsApp Business API payloads
- Chat list and chat window UI
- Send message functionality
- Responsive design
- Real-time updates (optional)

## Setup Instructions

### 1. MongoDB Atlas
- Create a free MongoDB Atlas account.
- Create a cluster and database named `whatsapp`.
- Create a collection named `processed_messages`.
- Obtain your connection string and update the backend `.env` file.

### 2. Running Locally
#### Backend
- Navigate to `backend` folder
- Install dependencies: `npm install`
- Create `.env` with your MongoDB URI
- Start server: `npm start`

#### Frontend
- Navigate to `frontend` folder
- Install dependencies: `npm install`
- Start app: `npm start`

### 3. Deployment
#### Backend
- Deploy to Render or Heroku
- Update frontend API URLs to point to deployed backend

#### Frontend
- Deploy to Vercel or Netlify

## Folder Structure
- `backend/` — Node.js/Express API
- `frontend/` — React/TailwindCSS app
- `.github/` — Copilot instructions

## Bonus
- Socket.IO for real-time chat updates

---

For detailed instructions, see comments in code and deployment guides in each folder.
