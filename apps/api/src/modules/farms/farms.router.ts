import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import {
  FarmCreateSchema,
  FarmUpdateSchema,
  FarmActivityCreateSchema,
  FarmActivityUpdateSchema,
  Farm,
  FarmActivity,
  FarmPerformance,
  calculateExpenseTotal,
  calculateTotalRevenue,
  calculateProfit,
} from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma, ensureUserProfile } from '../../lib/db';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export const farmsRouter = Router();

// GET /api/v1/farms - Lists user's private farms
farmsRouter.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const farms = await prisma.farm.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: farms });
      return;
    }

    // In-memory filter strictly by authenticated userId
    const userFarms = Array.from(inMemoryStore.farms.values()).filter((f) => f.userId === userId);
    res.json({ success: true, data: userFarms });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/farms - Creates a new farm for user
farmsRouter.post(
  '/',
  requireAuth,
  validateBody(FarmCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const farmData = req.body;

      if (isUsingPrisma && prisma) {
        await ensureUserProfile(req.user!);
        const created = await prisma.farm.create({
          data: {
            ...farmData,
            plantingDate: farmData.plantingDate ? new Date(farmData.plantingDate) : null,
            harvestingDate: farmData.harvestingDate ? new Date(farmData.harvestingDate) : null,
            userId,
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const id = `farm-${Date.now()}`;
      const now = new Date().toISOString();
      const newFarm: Farm = {
        id,
        userId,
        name: farmData.name,
        region: farmData.region,
        zone: farmData.zone || null,
        woreda: farmData.woreda || null,
        kebele: farmData.kebele || null,
        soilType: farmData.soilType || null,
        totalHectares: farmData.totalHectares,
        primaryCrop: farmData.primaryCrop || null,
        plantingDate: farmData.plantingDate || null,
        harvestingDate: farmData.harvestingDate || null,
        notes: farmData.notes || null,
        createdAt: now,
        updatedAt: now,
      };

      inMemoryStore.farms.set(id, newFarm);
      res.status(201).json({ success: true, data: newFarm });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/farms/:farmId - Get single farm with ownership check
farmsRouter.get('/:farmId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const farm = await prisma.farm.findUnique({
        where: { id: farmId },
      });

      if (!farm) throw new NotFoundError('Farm not found');
      if (farm.userId !== userId) throw new ForbiddenError('You do not have permission to view this farm.');

      res.json({ success: true, data: farm });
      return;
    }

    const farm = inMemoryStore.farms.get(farmId);
    if (!farm) throw new NotFoundError('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenError('You do not have permission to view this farm.');

    res.json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/farms/:farmId - Update farm with ownership check
farmsRouter.patch(
  '/:farmId',
  requireAuth,
  validateBody(FarmUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const farmId = req.params.farmId as string;
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.farm.findUnique({ where: { id: farmId } });
        if (!existing) throw new NotFoundError('Farm not found');
        if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to modify this farm.');

        const updated = await prisma.farm.update({
          where: { id: farmId },
          data: updates,
        });

        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.farms.get(farmId);
      if (!existing) throw new NotFoundError('Farm not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to modify this farm.');

      const updated: Farm = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.farms.set(farmId, updated);

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/farms/:farmId - Delete farm with ownership check
farmsRouter.delete('/:farmId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = req.params.farmId as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.farm.findUnique({ where: { id: farmId } });
      if (!existing) throw new NotFoundError('Farm not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this farm.');

      await prisma.farm.delete({ where: { id: farmId } });
      res.json({ success: true, message: 'Farm deleted successfully' });
      return;
    }

    const existing = inMemoryStore.farms.get(farmId);
    if (!existing) throw new NotFoundError('Farm not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this farm.');

    inMemoryStore.farms.delete(farmId);
    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/farms/:farmId/activities - List farm activities
farmsRouter.get('/:farmId/activities', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = String(req.params.farmId);
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const farm = await prisma.farm.findUnique({ where: { id: farmId } });
      if (!farm) throw new NotFoundError('Farm not found');
      if (farm.userId !== userId) throw new ForbiddenError('Access denied');

      const activities = await prisma.farmActivity.findMany({
        where: { farmId, userId },
        orderBy: { activityDate: 'desc' },
      });
      res.json({ success: true, data: activities });
      return;
    }

    const farm = inMemoryStore.farms.get(farmId);
    if (!farm) throw new NotFoundError('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenError('Access denied');

    const activities = Array.from(inMemoryStore.farmActivities.values())
      .filter((a) => a.farmId === farmId && a.userId === userId)
      .sort((a, b) => b.activityDate.localeCompare(a.activityDate));
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/farms/:farmId/activities - Record a farm activity
farmsRouter.post(
  '/:farmId/activities',
  requireAuth,
  validateBody(FarmActivityCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const farmId = String(req.params.farmId);
      const userId = req.user!.id;
      const data = req.body;

      if (isUsingPrisma && prisma) {
        const farm = await prisma.farm.findUnique({ where: { id: farmId } });
        if (!farm) throw new NotFoundError('Farm not found');
        if (farm.userId !== userId) throw new ForbiddenError('Access denied');

        const created = await prisma.farmActivity.create({
          data: {
            ...data,
            farmId,
            userId,
            activityDate: new Date(data.activityDate),
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const farm = inMemoryStore.farms.get(farmId);
      if (!farm) throw new NotFoundError('Farm not found');
      if (farm.userId !== userId) throw new ForbiddenError('Access denied');

      const id = `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();
      const activity: FarmActivity = {
        id,
        userId,
        farmId,
        activityType: data.activityType,
        title: data.title,
        description: data.description || null,
        activityDate: data.activityDate,
        status: data.status || 'planned',
        costETB: data.costETB ?? null,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryStore.farmActivities.set(id, activity);
      res.status(201).json({ success: true, data: activity });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/farms/:farmId/activities/:activityId - Update activity
farmsRouter.patch(
  '/:farmId/activities/:activityId',
  requireAuth,
  validateBody(FarmActivityUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const farmId = String(req.params.farmId);
      const activityId = String(req.params.activityId);
      const userId = req.user!.id;
      const updates = req.body;

      if (isUsingPrisma && prisma) {
        const existing = await prisma.farmActivity.findUnique({ where: { id: activityId } });
        if (!existing || existing.farmId !== farmId) throw new NotFoundError('Farm activity not found');
        if (existing.userId !== userId) throw new ForbiddenError('Access denied');

        const updated = await prisma.farmActivity.update({
          where: { id: activityId },
          data: {
            ...updates,
            ...(updates.activityDate ? { activityDate: new Date(updates.activityDate) } : {}),
          },
        });
        res.json({ success: true, data: updated });
        return;
      }

      const existing = inMemoryStore.farmActivities.get(activityId);
      if (!existing || existing.farmId !== farmId) throw new NotFoundError('Farm activity not found');
      if (existing.userId !== userId) throw new ForbiddenError('Access denied');

      const updated: FarmActivity = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.farmActivities.set(activityId, updated);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/farms/:farmId/activities/:activityId - Delete activity
farmsRouter.delete('/:farmId/activities/:activityId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = String(req.params.farmId);
    const activityId = String(req.params.activityId);
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.farmActivity.findUnique({ where: { id: activityId } });
      if (!existing || existing.farmId !== farmId) throw new NotFoundError('Farm activity not found');
      if (existing.userId !== userId) throw new ForbiddenError('Access denied');

      await prisma.farmActivity.delete({ where: { id: activityId } });
      res.json({ success: true, message: 'Activity deleted successfully' });
      return;
    }

    const existing = inMemoryStore.farmActivities.get(activityId);
    if (!existing || existing.farmId !== farmId) throw new NotFoundError('Farm activity not found');
    if (existing.userId !== userId) throw new ForbiddenError('Access denied');

    inMemoryStore.farmActivities.delete(activityId);
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/farms/:farmId/performance - Aggregated farm performance metrics
farmsRouter.get('/:farmId/performance', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmId = String(req.params.farmId);
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const farm = await prisma.farm.findUnique({ where: { id: farmId } });
      if (!farm) throw new NotFoundError('Farm not found');
      if (farm.userId !== userId) throw new ForbiddenError('Access denied');

      const [expenses, harvests, landRecords, activities] = await Promise.all([
        prisma.expense.findMany({ where: { farmId, userId } }),
        prisma.harvest.findMany({ where: { farmId, userId } }),
        prisma.landRecord.findMany({ where: { farmId, userId } }),
        prisma.farmActivity.findMany({ where: { farmId, userId } }),
      ]);

      const totalExpensesETB = calculateExpenseTotal(expenses);
      const totalRevenueETB = calculateTotalRevenue(harvests);
      const netProfitETB = calculateProfit(totalRevenueETB, totalExpensesETB);
      const roiPercent = totalExpensesETB > 0 ? Number(((netProfitETB / totalExpensesETB) * 100).toFixed(2)) : 0;
      const measuredHectares = landRecords.reduce((sum: number, r: any) => sum + (r.areaHectares || 0), 0);

      const perf: FarmPerformance = {
        farmId: farm.id,
        farmName: farm.name,
        totalHectares: farm.totalHectares,
        measuredHectares: Number(measuredHectares.toFixed(4)),
        totalExpensesETB,
        totalRevenueETB,
        netProfitETB,
        roiPercent,
        expenseCount: expenses.length,
        harvestCount: harvests.length,
        activityCount: activities.length,
        completedActivityCount: activities.filter((a: any) => a.status === 'completed').length,
      };
      res.json({ success: true, data: perf });
      return;
    }

    const farm = inMemoryStore.farms.get(farmId);
    if (!farm) throw new NotFoundError('Farm not found');
    if (farm.userId !== userId) throw new ForbiddenError('Access denied');

    const expenses = Array.from(inMemoryStore.expenses.values()).filter((e) => e.farmId === farmId && e.userId === userId);
    const harvests = Array.from(inMemoryStore.harvests.values()).filter((h) => h.farmId === farmId && h.userId === userId);
    const landRecords = Array.from(inMemoryStore.landRecords.values()).filter((l) => l.farmId === farmId && l.userId === userId);
    const activities = Array.from(inMemoryStore.farmActivities.values()).filter((a) => a.farmId === farmId && a.userId === userId);

    const totalExpensesETB = calculateExpenseTotal(expenses);
    const totalRevenueETB = calculateTotalRevenue(harvests);
    const netProfitETB = calculateProfit(totalRevenueETB, totalExpensesETB);
    const roiPercent = totalExpensesETB > 0 ? Number(((netProfitETB / totalExpensesETB) * 100).toFixed(2)) : 0;
    const measuredHectares = landRecords.reduce((sum, r) => sum + r.areaHectares, 0);

    const perf: FarmPerformance = {
      farmId: farm.id,
      farmName: farm.name,
      totalHectares: farm.totalHectares,
      measuredHectares: Number(measuredHectares.toFixed(4)),
      totalExpensesETB,
      totalRevenueETB,
      netProfitETB,
      roiPercent,
      expenseCount: expenses.length,
      harvestCount: harvests.length,
      activityCount: activities.length,
      completedActivityCount: activities.filter((a) => a.status === 'completed').length,
    };
    res.json({ success: true, data: perf });
  } catch (err) {
    next(err);
  }
});
