import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { NotificationCreateSchema, NotificationItem } from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma, ensureUserProfile } from '../../lib/db';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export const notificationsRouter = Router();

// GET /api/v1/notifications - List authenticated user's notifications with pagination
notificationsRouter.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10)));
    const skip = (page - 1) * limit;

    if (isUsingPrisma && prisma) {
      const [items, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, read: false } }),
      ]);
      res.json({
        success: true,
        data: items,
        unreadCount,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
      return;
    }

    const userNotifs = Array.from(inMemoryStore.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const unreadCount = userNotifs.filter((n) => !n.read).length;
    res.json({
      success: true,
      data: userNotifs.slice(skip, skip + limit),
      unreadCount,
      meta: {
        page,
        limit,
        total: userNotifs.length,
        totalPages: Math.ceil(userNotifs.length / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/notifications - Create a notification for authenticated user
notificationsRouter.post(
  '/',
  requireAuth,
  validateBody(NotificationCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = req.body;

      if (isUsingPrisma && prisma) {
        await ensureUserProfile(req.user!);
        const created = await prisma.notification.create({
          data: {
            ...data,
            userId,
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const item: NotificationItem = {
        id,
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'system',
        read: false,
        link: data.link || null,
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.notifications.set(id, item);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/notifications/read-all - Mark all notifications as read
notificationsRouter.patch('/read-all', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      res.json({ success: true, message: 'All notifications marked as read.' });
      return;
    }

    for (const [id, n] of inMemoryStore.notifications.entries()) {
      if (n.userId === userId && !n.read) {
        inMemoryStore.notifications.set(id, { ...n, read: true });
      }
    }
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/notifications/:id/read - Mark single notification as read
notificationsRouter.patch('/:id/read', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.notification.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Notification not found');
      if (existing.userId !== userId) throw new ForbiddenError('Access denied');

      const updated = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      res.json({ success: true, data: updated });
      return;
    }

    const existing = inMemoryStore.notifications.get(id);
    if (!existing) throw new NotFoundError('Notification not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    const updated = { ...existing, read: true };
    inMemoryStore.notifications.set(id, updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/notifications/:id - Dismiss notification
notificationsRouter.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.notification.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Notification not found');
      if (existing.userId !== userId) throw new ForbiddenError('Access denied');

      await prisma.notification.delete({ where: { id } });
      res.json({ success: true, message: 'Notification deleted' });
      return;
    }

    const existing = inMemoryStore.notifications.get(id);
    if (!existing) throw new NotFoundError('Notification not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    inMemoryStore.notifications.delete(id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
});
