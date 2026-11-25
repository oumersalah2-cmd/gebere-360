import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import {
  UserProfileUpdateSchema,
  AdminUserRoleUpdateSchema,
  UserProfile,
} from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError } from '../../middleware/errorHandler';

export const usersRouter = Router();

// GET /api/v1/users/me - Current authenticated user profile
usersRouter.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      let profile = await prisma.userProfile.findUnique({ where: { id: userId } });
      if (!profile) {
        profile = await prisma.userProfile.create({
          data: {
            id: userId,
            email: req.user!.email,
            fullName: req.user!.email.split('@')[0] || 'Gebere 360 User',
            role: req.user!.role,
          },
        });
      }
      res.json({ success: true, data: profile });
      return;
    }

    let profile = inMemoryStore.profiles.get(userId);
    if (!profile) {
      profile = {
        id: userId,
        email: req.user!.email,
        fullName: 'Gebere 360 Farmer',
        role: req.user!.role,
        region: 'Oromia',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.profiles.set(userId, profile);
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/users/me - Update own profile
usersRouter.patch(
  '/me',
  requireAuth,
  validateBody(UserProfileUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const updated = await prisma.userProfile.update({
          where: { id: userId },
          data: updates,
        });
        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.profiles.get(userId);
      if (!existing) throw new NotFoundError('User profile not found');

      const updated: UserProfile = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.profiles.set(userId, updated);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/users - Admin-only paginated user directory
usersRouter.get(
  '/',
  requireAuth,
  requireRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
      const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
      const skip = (page - 1) * limit;

      if (isUsingPrisma && prisma) {
        const [users, total] = await Promise.all([
          prisma.userProfile.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.userProfile.count(),
        ]);
        res.json({
          success: true,
          data: users,
          meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
        return;
      }

      const all = Array.from(inMemoryStore.profiles.values());
      const paged = all.slice(skip, skip + limit);
      res.json({
        success: true,
        data: paged,
        meta: { page, limit, total: all.length, totalPages: Math.ceil(all.length / limit) },
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/users/:userId/role - Admin-only role assignment
usersRouter.patch(
  '/:userId/role',
  requireAuth,
  requireRole('admin'),
  validateBody(AdminUserRoleUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = String(req.params.userId);
      const { role } = req.body;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.userProfile.findUnique({ where: { id: userId } });
        if (!existing) throw new NotFoundError('User not found');
        const updated = await prisma.userProfile.update({
          where: { id: userId },
          data: { role },
        });
        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.profiles.get(userId);
      if (!existing) throw new NotFoundError('User not found');
      const updated: UserProfile = {
        ...existing,
        role,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.profiles.set(userId, updated);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);
