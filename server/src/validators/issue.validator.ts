import { z } from 'zod';

// Validation schema for issue creation
export const createIssueSchema = z.object({
  ward_id: z.string().uuid(),
  description: z.string().min(20).max(500),
  category_hint: z.enum(['pothole', 'streetlight', 'water', 'garbage', 'drainage', 'encroachment', 'other']).optional(),
  photo_url: z.string().url().optional()
});

export type CreateIssueDTO = z.infer<typeof createIssueSchema>;

// Validation schema for status update
export const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'flagged']),
  resolution_note: z.string().optional()
});

export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;