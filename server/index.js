import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import path from 'path';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initSocket } from './utils/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

if (!process.env.VERCEL) {
  initSocket(httpServer);
}

const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(',').map((entry) => entry.trim()).filter(Boolean));
const allowedOrigins = [...new Set(configuredOrigins)];
const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === 'true' || process.env.NODE_ENV === 'production';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve a favicon when the server receives a request for /favicon.ico
app.get('/favicon.ico', (_req, res) => {
  const faviconPath = path.resolve('client', 'public', 'favicon.svg');
  res.sendFile(faviconPath, (err) => {
    if (err) {
      res.status(404).end();
    }
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Queue API is running' });
});

// Friendly root route to help browsers visiting the server root
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Queue API root. Use /api/health for health checks or /api routes for the API.' });
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'SmartQueue Admin';

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    const wantsUpdate = existingAdmin.email !== adminEmail || existingAdmin.name !== adminName;

    if (wantsUpdate) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.name = adminName;
      existingAdmin.email = adminEmail;
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`Admin account updated: ${adminEmail}`);
    } else {
      console.log('Admin user already exists:', existingAdmin.email);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin'
  });

  console.log(`Default admin created: ${adminEmail}`);
};

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminUser();

    if (process.env.VERCEL) {
      console.log('Server ready for Vercel serverless runtime');
      return;
    }

    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

startServer();

export { app, httpServer };
export default app;
