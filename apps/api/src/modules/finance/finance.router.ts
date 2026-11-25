import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { calculateFinanceSummary, Expense, Harvest } from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';

export const financeRouter = Router();

// GET /api/v1/finance/summary?farmId=...&season=...
financeRouter.get('/summary', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { farmId, season } = req.query;

    let userExpenses: Expense[] = [];
    let userHarvests: Harvest[] = [];
    let totalHectares = 0;

    if (isUsingPrisma && prisma) {
      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          ...(farmId ? { farmId: String(farmId) } : {}),
          ...(season ? { season: String(season) } : {}),
        },
      });

      const harvests = await prisma.harvest.findMany({
        where: {
          userId,
          ...(farmId ? { farmId: String(farmId) } : {}),
          ...(season ? { season: String(season) } : {}),
        },
      });

      // Calculate cultivated hectares
      if (farmId) {
        const farm = await prisma.farm.findUnique({ where: { id: String(farmId) } });
        if (farm && farm.userId === userId) {
          totalHectares = farm.totalHectares;
        }
      } else {
        const farms = await prisma.farm.findMany({ where: { userId } });
        totalHectares = farms.reduce((acc: number, f: any) => acc + f.totalHectares, 0);
      }

      userExpenses = expenses.map((e: any) => ({
        ...e,
        category: e.category as Expense['category'],
        currency: e.currency as Expense['currency'],
        date: e.date.toISOString().split('T')[0],
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }));

      userHarvests = harvests.map((h: any) => ({
        ...h,
        unit: h.unit as Harvest['unit'],
        currency: h.currency as Harvest['currency'],
        harvestDate: h.harvestDate.toISOString().split('T')[0],
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      }));
    } else {
      userExpenses = Array.from(inMemoryStore.expenses.values()).filter(
        (e) =>
          e.userId === userId &&
          (!farmId || e.farmId === farmId) &&
          (!season || e.season === season)
      );

      userHarvests = Array.from(inMemoryStore.harvests.values()).filter(
        (h) =>
          h.userId === userId &&
          (!farmId || h.farmId === farmId) &&
          (!season || h.season === season)
      );

      if (farmId) {
        const farm = inMemoryStore.farms.get(String(farmId));
        if (farm && farm.userId === userId) {
          totalHectares = farm.totalHectares;
        }
      } else {
        const userFarms = Array.from(inMemoryStore.farms.values()).filter((f) => f.userId === userId);
        totalHectares = userFarms.reduce((acc, f) => acc + f.totalHectares, 0);
      }
    }

    const summary = calculateFinanceSummary(
      userExpenses,
      userHarvests,
      totalHectares,
      'ETB',
      farmId ? String(farmId) : undefined,
      season ? String(season) : undefined
    );

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/finance/reports - Historical P&L breakdown by season and farm
financeRouter.get('/reports', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    let userExpenses: Expense[] = [];
    let userHarvests: Harvest[] = [];

    if (isUsingPrisma && prisma) {
      const [expenses, harvests] = await Promise.all([
        prisma.expense.findMany({ where: { userId } }),
        prisma.harvest.findMany({ where: { userId } }),
      ]);
      userExpenses = expenses.map((e: any) => ({
        ...e,
        date: e.date.toISOString().split('T')[0],
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }));
      userHarvests = harvests.map((h: any) => ({
        ...h,
        harvestDate: h.harvestDate.toISOString().split('T')[0],
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      }));
    } else {
      userExpenses = Array.from(inMemoryStore.expenses.values()).filter((e) => e.userId === userId);
      userHarvests = Array.from(inMemoryStore.harvests.values()).filter((h) => h.userId === userId);
    }

    const seasons = Array.from(
      new Set([...userExpenses.map((e) => e.season), ...userHarvests.map((h) => h.season)])
    ).sort();

    const bySeason = seasons.map((seasonName) => {
      const sExpenses = userExpenses.filter((e) => e.season === seasonName);
      const sHarvests = userHarvests.filter((h) => h.season === seasonName);
      const summary = calculateFinanceSummary(sExpenses, sHarvests, 0, 'ETB', undefined, seasonName);
      return {
        season: seasonName,
        totalExpensesETB: summary.totalCost,
        totalRevenueETB: summary.totalRevenue,
        netProfitETB: summary.estimatedProfit,
        expenseCount: summary.expenseCount,
        harvestCount: summary.harvestCount,
      };
    });

    res.json({
      success: true,
      data: {
        seasons: bySeason,
        overall: calculateFinanceSummary(userExpenses, userHarvests, 0, 'ETB'),
      },
    });
  } catch (err) {
    next(err);
  }
});
