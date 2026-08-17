import rateLimit from 'express-rate-limit';

// Global rate limiter for issue submission
export const issueSubmitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  message: {
    success: false,
    data: null,
    error: 'Too many issue submissions, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for photo uploads (10 per hour per user)
export const photoUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    success: false,
    data: null,
    error: 'Too many photo uploads, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if available, otherwise IP
    // @ts-ignore
    return req.user?.id || req.ip || 'anonymous';
  },
});

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    data: null,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});