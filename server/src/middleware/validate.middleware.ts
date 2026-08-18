import { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    ...req.body,
    ...req.params,
    ...req.query,
  });

  if (result.success) {
    req.validatedBody = result.data;
    next();
  } else {
    const message = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    res.status(400).json({
      success: false,
      data: null,
      error: `Validation error: ${message}`,
    });
  }
};