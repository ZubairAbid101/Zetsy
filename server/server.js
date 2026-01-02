import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { serve } from "inngest/express";
import {inngest, functions} from './inngest/index.js'
import connectDB from './configs/db.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/inngest', serve({ client: inngest, functions }));

// Start the server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});