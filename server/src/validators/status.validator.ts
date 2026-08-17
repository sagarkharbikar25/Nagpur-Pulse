import { z } from 'zod';

// Validation schema for status update
export const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'flagged'], {
    errorMap: () => ({
      message: "Status must be one of: open, in_progress, resolved, flagged",
    }),
  }),
  resolution_note: z
    .string()
    .max(1000, 'Resolution note must be under 1000 characters')
    .optional(),
});

export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;
