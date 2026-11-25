import { Router, Request, Response, NextFunction } from 'express';
import { requireBotApiKey, optionalAuth } from '../../middleware/auth';
import { cropHealthService } from './crop-health.service';
import { GebereVisionAIEngine } from './gebere-vision.engine';
import { inMemoryStore, isUsingPrisma, prisma, ensureUserProfile } from '../../lib/db';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { BadRequestError } from '../../middleware/errorHandler';
import { DiagnosisRequestInput, AgriculturalQuestionInput } from '@gebere/shared';

export const cropHealthRouter = Router();

const MAX_IMAGE_DATA_URI_BYTES = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const AI_DISCLAIMER =
  'Advisory Notice: AI-generated crop diagnoses and recommendations are preliminary observations and do not replace verification by a qualified agricultural expert or Kebele Development Agent (DA).';

function validateCropImage(imageUrl?: string): void {
  if (!imageUrl) return;
  if (imageUrl.startsWith('data:')) {
    const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new BadRequestError('Invalid image data URI format.');
    }
    const mimeType = match[1].toLowerCase();
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestError('Unsupported image format. Allowed formats: JPEG, PNG, WebP.');
    }
    const approxBytes = Math.ceil((match[2].length * 3) / 4);
    if (approxBytes > MAX_IMAGE_DATA_URI_BYTES) {
      throw new BadRequestError('Image file size exceeds the 10 MB maximum limit.');
    }
  } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    throw new BadRequestError('imageUrl must be a valid HTTP(S) URL or base64 image data URI.');
  }
}

const DiagnosisRequestSchema = z.object({
  crop: z.string().min(1, 'Crop name is required'),
  region: z.string().optional(),
  zone: z.string().optional(),
  imageUrl: z.string().optional(),
  observedSymptoms: z.string().optional(),
});

const AgriculturalQuestionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(1500),
  crop: z.string().max(80).optional(),
  region: z.string().max(80).optional(),
  language: z.enum(['en', 'om', 'am']).optional().default('en'),
});

const RequestExpertSchema = z.object({
  diagnosisId: z.string().optional().default('DIAG-MANUAL'),
  crop: z.string().min(1),
  location: z.string().optional(),
  region: z.string().optional(),
  zone: z.string().optional(),
  woreda: z.string().optional(),
  contactPhone: z.string().optional(),
  farmerContact: z.string().optional(),
  farmerName: z.string().optional(),
  disease: z.string().optional(),
  notes: z.string().optional(),
});

const BotDiagnosticSyncSchema = z.object({
  farmerTelegramId: z.string().optional(),
  crop: z.string().min(1),
  symptoms: z.string().optional(),
  diseaseIdentified: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
  region: z.string().optional(),
  language: z.string().optional(),
});

// GET /api/v1/crop-health/status - Reports honest bot connection status
cropHealthRouter.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await cropHealthService.getStatus();
    res.json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/crop-health/diagnose - Gebere Vision AI Diagnostic Analysis Engine
cropHealthRouter.post(
  '/diagnose',
  optionalAuth,
  validateBody(DiagnosisRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: DiagnosisRequestInput = req.body;
      validateCropImage(input.imageUrl);

      const rawResult = await GebereVisionAIEngine.analyzeCrop(input);
      const result = {
        ...rawResult,
        disclaimer: AI_DISCLAIMER,
      };
      const userId = req.user?.id || null;

      // Save diagnostic log
      if (isUsingPrisma && prisma) {
        if (req.user) {
          await ensureUserProfile(req.user);
        }
        await prisma.cropDiagnosisLog.create({
          data: {
            userId,
            source: 'gebere_vision_ai_web',
            crop: result.crop,
            symptoms: result.observedSymptoms.join('; '),
            diseaseIdentified: result.diseaseName,
            scientificName: result.scientificName,
            severity: result.severity,
            confidence: result.confidenceScore,
            managementAdvice: result.approvedManagementAdvice,
            imageUrl: input.imageUrl && !input.imageUrl.startsWith('data:') ? input.imageUrl : null,
            disclaimer: AI_DISCLAIMER,
            region: input.region || null,
            status: result.status,
          },
        });
      } else {
        inMemoryStore.diagnosisLogs.unshift({
          ...result,
          userId,
          region: input.region,
          zone: input.zone,
          source: 'gebere_vision_ai_web',
        });
      }

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/crop-health/ask - Agricultural advisory Q&A
cropHealthRouter.post(
  '/ask',
  optionalAuth,
  validateBody(AgriculturalQuestionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: AgriculturalQuestionInput = req.body;
      const answer = await GebereVisionAIEngine.answerAgriculturalQuestion(input);
      res.status(200).json({ success: true, data: answer });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/crop-health/history - Retrieve diagnostic scan records (scoped to user when authenticated)
cropHealthRouter.get('/history', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '10'), 10)));

    if (isUsingPrisma && prisma) {
      const logs = await prisma.cropDiagnosisLog.findMany({
        where: userId ? { userId } : {},
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, count: logs.length, data: logs });
      return;
    }

    const filtered = userId
      ? inMemoryStore.diagnosisLogs.filter((l) => !l.userId || l.userId === userId)
      : inMemoryStore.diagnosisLogs;
    const logs = filtered.slice(0, limit);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/crop-health/request-expert - Request extension agronomist field visit
cropHealthRouter.post(
  '/request-expert',
  optionalAuth,
  validateBody(RequestExpertSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { diagnosisId, crop, location, region, zone, woreda, contactPhone, farmerContact, notes, farmerName, disease } = req.body;
      const resolvedLocation = location || [region, zone, woreda].filter(Boolean).join(', ') || 'Ethiopia';
      const resolvedContact = contactPhone || farmerContact || 'Unknown';
      const escalationId = `ESC-${Date.now()}`;
      const escalationRecord = {
        id: `esc-${Date.now()}`,
        escalationId,
        diagnosisId: diagnosisId || 'DIAG-MANUAL',
        crop,
        disease: disease || 'Unspecified Condition',
        farmerName: farmerName || 'Anonymous Farmer',
        location: resolvedLocation,
        contactPhone: resolvedContact,
        notes: notes || 'Farmer requested agronomist field visit via Gebere Vision AI.',
        status: 'pending_woreda_assignment',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: 'Escalation request submitted. The local Woreda Agricultural Extension Office will contact you.',
        data: escalationRecord,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/crop-health/bot-sync - Secure webhook endpoint for existing Telegram Bot
cropHealthRouter.post(
  '/bot-sync',
  requireBotApiKey,
  validateBody(BotDiagnosticSyncSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      if (isUsingPrisma && prisma) {
        const record = await prisma.cropDiagnosisLog.create({
          data: {
            source: 'telegram_bot',
            farmerTelegramId: data.farmerTelegramId || null,
            crop: data.crop,
            symptoms: data.symptoms || null,
            diseaseIdentified: data.diseaseIdentified || null,
            confidence: data.confidence || null,
            region: data.region || null,
            language: data.language || null,
            status: 'synced_from_bot',
          },
        });
        res.status(201).json({ success: true, message: 'Diagnosis synced successfully from Telegram Bot', data: record });
        return;
      }

      const log = {
        id: `diag-sync-${Date.now()}`,
        ...data,
        source: 'telegram_bot',
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.diagnosisLogs.push(log);

      res.status(201).json({ success: true, message: 'Diagnosis synced successfully from Telegram Bot', data: log });
    } catch (err) {
      next(err);
    }
  }
);
