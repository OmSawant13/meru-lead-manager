import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
