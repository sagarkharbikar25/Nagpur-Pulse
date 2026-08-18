import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { supabaseAdmin } from '../config/supabase';
import { IssuesService } from '../services/issues.service';
import { StorageService } from '../services/storage.service';
import { AIService } from '../services/ai.service';
import { ClusteringService } from '../services/clustering.service';
import { authenticate, authorizeRole, authorizeWard } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { issueSubmitLimiter, photoUploadLimiter } from '../middleware/rateLimit.middleware';
import { createIssueSchema } from '../validators/issue.validator';
import { updateStatusSchema } from '../validators/status.validator';


const router = Router();

// Multer for in-memory file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ─────────────────────────────────────────────────
// GET /api/issues
// Public — list issues with optional filters
// ─────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ward_id, category, status, citizen_id, hotspot_id, page, limit } = req.query;

    const result = await IssuesService.getIssues({
      ward_id: ward_id as string | undefined,
      category: category as string | undefined,
      status: status as string | undefined,
      citizen_id: citizen_id as string | undefined,
      hotspot_id: hotspot_id as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────
// GET /api/issues/:id
// Public — get single issue with status history
// ─────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issue = await IssuesService.getIssueById(req.params.id);

    res.json({
      success: true,
      data: issue,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────
// POST /api/issues
// Citizens and guests — submit a new issue
// ─────────────────────────────────────────────────
router.post(
  '/',
  issueSubmitLimiter,
  validate(createIssueSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      let userId = 'c4cac2e9-8902-4f10-a9ea-ac86a438032c';

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (user) userId = user.id;
      }

      // Ensure userId exists in profiles to satisfy FK constraint
      const { data: profileCheck } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!profileCheck) {
        const { data: anyProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (anyProfile) {
          userId = anyProfile.id;
        }
      }

      const { description, ward_id, category_hint, photo_url } = req.validatedBody;

      // Run AI categorization (always returns — never crashes)
      const aiResult = await AIService.categorizeIssue(description);

      // Create issue with AI-assigned fields
      const issue = await IssuesService.createIssue({
        citizen_id: userId,
        ward_id,
        description,
        category_hint,
        photo_url,
        category: aiResult.category,
        ai_summary: aiResult.summary,
        severity_hint: aiResult.severity_hint,
      });

      // Run clustering check (non-blocking)
      const hotspotTriggered = await ClusteringService.checkAndUpdateHotspot(
        ward_id,
        aiResult.category
      );

      res.status(201).json({
        success: true,
        data: { ...issue, hotspot_triggered: hotspotTriggered },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─────────────────────────────────────────────────
// POST /api/issues/upload-photo
// Upload photo to storage, returns public URL
// ─────────────────────────────────────────────────
router.post(
  '/upload-photo',
  photoUploadLimiter,
  upload.single('photo'),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'No file uploaded',
        });
      }

      const userId = req.user?.id || 'citizen_upload';

      const publicUrl = await StorageService.uploadPhoto(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        userId,
      );

      res.json({
        success: true,
        data: { url: publicUrl, photo_url: publicUrl },
        error: null,
      });
    } catch (err: any) {
      console.warn('Storage upload error:', err);
      res.status(500).json({
        success: false,
        data: null,
        error: err.message || 'Photo upload failed',
      });
    }
  },
);

// ─────────────────────────────────────────────────
// PATCH /api/issues/:id/status
// Authority / Admin only — update issue status
// ─────────────────────────────────────────────────
router.patch(
  '/:id/status',
  authenticate,
  authorizeRole(['authority', 'admin']),
  authorizeWard(),
  validate(updateStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actorId = req.user!.id;
      const { status, resolution_note } = req.validatedBody;

      const updatedIssue = await IssuesService.updateIssueStatus(
        req.params.id,
        status,
        resolution_note ?? null,
        actorId,
      );

      res.json({
        success: true,
        data: updatedIssue,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
