import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Global error handler — must be registered LAST in Express
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error('⚠️  Server Error:', err);

  let statusCode = 500;
  let message: string | object = 'Internal server error';

  // Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return res.status(statusCode).json({
      success: false,
      data: null,
      error: message,
    });
  }

  // Unique constraint violation
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  // Record not found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'The requested record does not exist';
  }

  // Supabase JWT errors
  if (err.message?.includes('JWT')) {
    statusCode = 401;
    message = 'Authentication error';
  }

  // Generic application errors
  if (err.message && statusCode === 500) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
  });
};