import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';  // use `import` instead of `require`

dotenv.config();  // Load environment variables from .env

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)  // Use env variable for MongoDB connection URL
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// CORS setup: allow cross-origin requests
app.use(cors({
  origin: process.env.FRONTEND_URL, // replace with your frontend URL 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  
}));

app.use(express.json());
app.use(cookieParser());

// Define routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Handle errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;  // Use port from environment or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
