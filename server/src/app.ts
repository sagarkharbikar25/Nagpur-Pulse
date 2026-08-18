import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimit.middleware';

// Routes
import issuesRoutes from './routes/issues.routes';
import wardsRoutes from './routes/wards.routes';
import hotspotsRoutes from './routes/hotspots.routes';
import dashboardRoutes from './routes/dashboard.routes';
import authRoutes from './routes/auth.routes';

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
    origin: true,
    credentials: true,
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
app.use('/api/wards', wardsRoutes);
app.use('/api/hotspots', hotspotsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

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