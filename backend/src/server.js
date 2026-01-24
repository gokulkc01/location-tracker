require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initializeSocket } = require('./utils/socketHandler');

const app = express();
const server = http.createServer(app);

// Allow multiple frontend ports and ngrok domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

// Dynamic CORS to allow any ngrok domain
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow ngrok domains
    if (origin.includes('ngrok-free.dev') || origin.includes('ngrok.io')) {
      return callback(null, true);
    }

    // Allow listed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(null, true); // Allow all for development
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

// Connect to database
connectDB();

// Initialize Socket.io
initializeSocket(io);

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/circles', require('./routes/circles'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/geofences', require('./routes/geofences'));
app.use('/api/invitations', require('./routes/invitations'));
app.use('/api/notifications', require('./routes/notification'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server initialized`);
});