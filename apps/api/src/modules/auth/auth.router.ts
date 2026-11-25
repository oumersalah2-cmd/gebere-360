import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, isSupabaseAuthConfigured, supabaseAdmin } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { config } from '../../config';
import { prisma, isUsingPrisma, inMemoryStore, ensureUserProfile } from '../../lib/db';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../../middleware/errorHandler';
import {
  AuthRegisterSchema,
  AuthLoginSchema,
  AuthRefreshSchema,
  AuthForgotPasswordSchema,
} from '@gebere/shared';

export const authRouter = Router();

// GET /api/v1/auth/status - Reports current authentication subsystem status
authRouter.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      supabaseAuthConfigured: isSupabaseAuthConfigured,
      environment: config.nodeEnv,
      isProduction: config.isProduction,
      demoTokensAllowed: !config.isProduction,
    },
  });
});

// POST /api/v1/auth/register - Unified Web & Mobile registration
authRouter.post(
  '/register',
  validateBody(AuthRegisterSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isSupabaseAuthConfigured || !supabaseAdmin) {
        throw new BadRequestError('Authentication provider is not configured on the server.');
      }

      const { email, password, fullName, phone, region, zone, woreda, role } = req.body;
      const { data, error } = await supabaseAdmin.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { fullName, phone, region, zone, woreda, role },
        },
      });

      if (error) {
        throw new BadRequestError(error.message);
      }

      if (data.user) {
        if (isUsingPrisma && prisma) {
          await prisma.userProfile.upsert({
            where: { id: data.user.id },
            update: { fullName, phoneNumber: phone || null, region, zone: zone || null, woreda: woreda || null, role },
            create: {
              id: data.user.id,
              email: data.user.email || email,
              fullName,
              phoneNumber: phone || null,
              region: region || 'Oromia',
              zone: zone || null,
              woreda: woreda || null,
              role: role || 'farmer',
            },
          });
        } else {
          inMemoryStore.profiles.set(data.user.id, {
            id: data.user.id,
            email: data.user.email || email,
            fullName,
            phone: phone || null,
            region: region || 'Oromia',
            zone: zone || null,
            woreda: woreda || null,
            role: role || 'farmer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      res.status(201).json({
        success: true,
        data: {
          user: data.user
            ? { id: data.user.id, email: data.user.email, role: role || 'farmer', fullName }
            : null,
          accessToken: data.session?.access_token || null,
          refreshToken: data.session?.refresh_token || null,
          expiresIn: data.session?.expires_in || null,
          emailConfirmationRequired: Boolean(data.user && !data.session),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/login - Unified Web & Mobile login
authRouter.post(
  '/login',
  validateBody(AuthLoginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isSupabaseAuthConfigured || !supabaseAdmin) {
        throw new UnauthorizedError('Authentication provider is not configured on the server.');
      }

      const { email, password } = req.body;
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.session || !data.user) {
        throw new UnauthorizedError(error?.message || 'Invalid email or password.');
      }

      if (isUsingPrisma && prisma) {
        await ensureUserProfile({
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role,
          fullName: data.user.user_metadata?.fullName,
        });
      }

      res.json({
        success: true,
        data: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
          user: {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'farmer',
            fullName: data.user.user_metadata?.fullName || null,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/refresh - Refresh access token for mobile & web clients
authRouter.post(
  '/refresh',
  validateBody(AuthRefreshSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isSupabaseAuthConfigured || !supabaseAdmin) {
        throw new UnauthorizedError('Authentication provider is not configured.');
      }

      const { refreshToken } = req.body;
      const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken });
      if (error || !data.session) {
        throw new UnauthorizedError(error?.message || 'Invalid or expired refresh token.');
      }

      res.json({
        success: true,
        data: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/logout - Sign out current session
authRouter.post('/logout', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/forgot-password - Send password reset email
authRouter.post(
  '/forgot-password',
  validateBody(AuthForgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isSupabaseAuthConfigured || !supabaseAdmin) {
        throw new BadRequestError('Authentication provider is not configured.');
      }
      const { email, redirectTo } = req.body;
      const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: redirectTo || `${config.frontendUrl || 'http://localhost:3001'}/auth/login`,
      });
      if (error) {
        throw new BadRequestError(error.message);
      }
      res.json({
        success: true,
        message: 'If an account exists for this email, a password reset link has been sent.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/auth/me - Return authenticated user context
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ success: true, data: req.user });
});

// POST /api/v1/auth/claim-demo-data - Safely associates demo farm/plot records with a real account
authRouter.post('/claim-demo-data', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const realUserId = req.user!.id;
    const { demoUserId } = req.body;

    if (!demoUserId || typeof demoUserId !== 'string') {
      throw new BadRequestError('demoUserId string is required to transfer records.');
    }

    if (config.isProduction) {
      throw new ForbiddenError('Demo data transfer is strictly prohibited in production mode.');
    }

    // Strict security enforcement: Only allow claiming from authorized demo identifiers
    const isAuthorizedDemoUser =
      demoUserId.startsWith('demo-') ||
      demoUserId.startsWith('usr-demo-') ||
      demoUserId === 'usr-demo-farmer-1';

    if (!isAuthorizedDemoUser) {
      throw new ForbiddenError('Security violation: Only verified demo accounts can be claimed into real accounts.');
    }

    if (demoUserId === realUserId) {
      res.json({ success: true, message: 'Source and target account IDs are identical; no transfer needed.', transferredCount: 0 });
      return;
    }

    let transferredFarms = 0;
    let transferredPlots = 0;
    let transferredExpenses = 0;
    let transferredHarvests = 0;

    if (isUsingPrisma && prisma) {
      await ensureUserProfile(req.user!);

      const farmUpdate = await prisma.farm.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredFarms = farmUpdate.count;

      const plotUpdate = await prisma.landRecord.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredPlots = plotUpdate.count;

      const expenseUpdate = await prisma.expense.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredExpenses = expenseUpdate.count;

      const harvestUpdate = await prisma.harvest.updateMany({
        where: { userId: demoUserId },
        data: { userId: realUserId },
      });
      transferredHarvests = harvestUpdate.count;
    } else {
      // In-memory fallback transfer
      for (const [id, f] of inMemoryStore.farms.entries()) {
        if (f.userId === demoUserId) {
          f.userId = realUserId;
          transferredFarms++;
        }
      }
      for (const [id, p] of inMemoryStore.landRecords.entries()) {
        if (p.userId === demoUserId) {
          p.userId = realUserId;
          transferredPlots++;
        }
      }
      for (const [id, e] of inMemoryStore.expenses.entries()) {
        if (e.userId === demoUserId) {
          e.userId = realUserId;
          transferredExpenses++;
        }
      }
      for (const [id, h] of inMemoryStore.harvests.entries()) {
        if (h.userId === demoUserId) {
          h.userId = realUserId;
          transferredHarvests++;
        }
      }
    }

    res.json({
      success: true,
      message: `Successfully transferred records from ${demoUserId} to ${realUserId}`,
      transferred: {
        farms: transferredFarms,
        plots: transferredPlots,
        expenses: transferredExpenses,
        harvests: transferredHarvests,
        total: transferredFarms + transferredPlots + transferredExpenses + transferredHarvests,
      },
    });
  } catch (err) {
    next(err);
  }
});
