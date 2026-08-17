import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimit.middleware';

// Routes
import issuesRoutes from './routes/issues.routes';

// Express request augmentation
declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      user?: {
        id: string;
        name: string;
        role: string;
        ward_id: string | null;
      };
    }
  }
}

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Global rate limiting
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'nagpur-pulse-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    error: null,
  });
});

// ─────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────
app.use('/api/issues', issuesRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;