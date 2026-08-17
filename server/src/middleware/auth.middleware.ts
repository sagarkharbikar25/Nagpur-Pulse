import { Request, Response, NextFunction } from 'express';
import { supabaseAnon } from '../config/supabase';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'No token provided',
    });
  }

  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid or expired token',
    });
  }

  // Fetch user profile to get role and ward_id
  const { data: profile, error: profileError } = await supabaseAnon
    .from('profiles')
    .select('id, name, role, ward_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'User profile not found',
    });
  }

  // Attach user info to request
  // @ts-ignore - extending Express Request type
  req.user = {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    ward_id: profile.ward_id,
  };

  next();
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Insufficient permissions',
      });
    }
    next();
  };
};

export const authorizeWard = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user;
    const issueId = req.params.id;

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
      });
    }

    // Admin can access any ward
    if (user.role === 'admin') {
      next();
      return;
    }

    // For authority roles, check if they belong to the issue's ward
    if (user.role === 'authority') {
      if (!user.ward_id) {
        return res.status(403).json({
          success: false,
          data: null,
          error: 'Authority not assigned to any ward',
        });
      }

      // Check if the issue belongs to the user's ward
      const { data: issue, error } = await supabaseAnon
        .from('issues')
        .select('ward_id')
        .eq('id', issueId)
        .single();

      if (error || !issue) {
        return res.status(404).json({
          success: false,
          data: null,
          error: 'Issue not found',
        });
      }

      if (issue.ward_id !== user.ward_id) {
        return res.status(403).json({
          success: false,
          data: null,
          error: 'Access denied: issue belongs to different ward',
        });
      }
    }

    next();
  };
};