const dotenv = require('dotenv');
dotenv.config();

const express = require('express'); 

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const uploadRoutes = require ('./routes/uploadRoutes')
const reviewRoutes = require("./routes/reviewRoutes")

const cookieParser = require("cookie-parser");
const cors = require('cors')
const connectDB = require('./config/db');

connectDB();

const app = express();

app.get('/api/test-env', (req, res) => {
  res.json({
    mongoUri: process.env.MONGO_URI ? 'set' : 'missing',
    clientUrl: process.env.CLIENT_URL ? 'set' : 'missing',
    jwtAccess: process.env.JWT_ACCESS_SECRET ? 'set' : 'missing',
  });
});

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cookieParser());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use("/api/reviews", reviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
