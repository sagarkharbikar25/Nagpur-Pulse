import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// ─────────────────────────────────────────────────
// POST /api/auth/demo-login
// Seamless demo login for Authority & Admin (guaranteed zero friction)
// ─────────────────────────────────────────────────
router.post('/demo-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      (email === 'authority@nagpurpulse.com' && password === 'authority123') ||
      (email === 'admin@nagpurpulse.com' && password === 'admin123')
    ) {
      const role = email.includes('authority') ? 'authority' : 'admin';
      const defaultId = role === 'authority' 
        ? 'b2ba4d23-7401-4d09-9b7e-9b7e9b7e9b7e' 
        : 'a1aa3d12-6301-4c08-8a6e-8a6e8a6e8a6e';
      const defaultName = role === 'authority' ? 'Ward Officer Sharma' : 'Municipal Commissioner';

      // Try to get first ward id if authority
      let wardId: string | null = null;
      try {
        const { data: wards } = await supabaseAdmin.from('wards').select('id').limit(1);
        wardId = wards?.[0]?.id || null;
      } catch {
        // Non-blocking
      }

      // Try to sync with DB profiles (non-blocking)
      try {
        await supabaseAdmin.from('profiles').upsert({
          id: defaultId,
          name: defaultName,
          role,
          ward_id: role === 'authority' ? wardId : null,
        });
      } catch {
        // Non-blocking
      }

      return res.json({
        success: true,
        data: {
          user: {
            id: defaultId,
            email,
            name: defaultName,
            role,
            ward_id: role === 'authority' ? wardId : null,
          },
        },
        error: null,
      });
    }

    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid credentials',
    });
  } catch (err: any) {
    console.error('Demo login error:', err);
    res.status(500).json({
      success: false,
      data: null,
      error: err.message || 'Authentication failed',
    });
  }
});

export default router;
