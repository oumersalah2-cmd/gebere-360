const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../../dist/app');

const app = createApp();

describe('Gebere 360 - Extended Platform Modules & Security Suite', () => {
  const farmerA = 'Bearer demo-user-farmer-alpha';
  const farmerB = 'Bearer demo-user-farmer-beta';
  const adminToken = 'Bearer demo-user-admin-1';

  describe('1. Farm Activities & Performance Analytics', () => {
    let farmId;
    let activityId;

    it('creates a farm with planting and harvesting dates', async () => {
      const res = await request(app)
        .post('/api/v1/farms')
        .set('Authorization', farmerA)
        .send({
          name: 'Adaa Teff Estate',
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          totalHectares: 3,
          primaryCrop: 'Teff',
          plantingDate: '2026-07-10',
          harvestingDate: '2026-11-20',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.data.plantingDate, '2026-07-10');
      assert.equal(res.body.data.harvestingDate, '2026-11-20');
      farmId = res.body.data.id;
    });

    it('records, updates, and lists farm activities with ownership isolation', async () => {
      const createRes = await request(app)
        .post(`/api/v1/farms/${farmId}/activities`)
        .set('Authorization', farmerA)
        .send({
          activityType: 'planting',
          title: 'Row sowing Magna Teff',
          activityDate: '2026-07-10',
          status: 'completed',
          costETB: 4500,
        });

      assert.equal(createRes.status, 201);
      activityId = createRes.body.data.id;

      // Farmer B cannot view or add activities to Farmer A's farm
      const forbiddenRes = await request(app)
        .get(`/api/v1/farms/${farmId}/activities`)
        .set('Authorization', farmerB);
      assert.equal(forbiddenRes.status, 403);

      const patchRes = await request(app)
        .patch(`/api/v1/farms/${farmId}/activities/${activityId}`)
        .set('Authorization', farmerA)
        .send({ title: 'Row sowing Magna Teff (Verified)' });
      assert.equal(patchRes.status, 200);
      assert.equal(patchRes.body.data.title, 'Row sowing Magna Teff (Verified)');
    });

    it('computes farm performance summary', async () => {
      const res = await request(app)
        .get(`/api/v1/farms/${farmId}/performance`)
        .set('Authorization', farmerA);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.farmId, farmId);
      assert.equal(res.body.data.activityCount, 1);
      assert.equal(res.body.data.completedActivityCount, 1);
    });
  });

  describe('2. Land Price Calculation & GPS Readiness', () => {
    it('calculates 250m x 120m = 30,000 sqm = 3 hectares and land price', async () => {
      const res = await request(app)
        .post('/api/v1/land/calculate')
        .send({
          method: 'rectangular',
          length: 250,
          width: 120,
          lengthUnit: 'meters',
          widthUnit: 'meters',
          pricePerHectare: 200000,
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.squareMeters, 30000);
      assert.equal(res.body.data.hectares, 3);
      assert.equal(res.body.data.estimatedValueETB, 600000);
    });
  });

  describe('3. Financial Updates & Seasonal P&L Reports', () => {
    let farmId;
    let expenseId;
    let harvestId;

    it('creates farm, expense, harvest, updates them, and retrieves P&L report', async () => {
      const farmRes = await request(app)
        .post('/api/v1/farms')
        .set('Authorization', farmerA)
        .send({ name: 'Bale Wheat Plot', region: 'Oromia', totalHectares: 2 });
      farmId = farmRes.body.data.id;

      const expRes = await request(app)
        .post('/api/v1/expenses')
        .set('Authorization', farmerA)
        .send({
          farmId,
          season: '2026 Meher',
          category: 'seeds',
          description: 'Certified wheat seed',
          amount: 25000,
          date: '2026-07-01',
        });
      assert.equal(expRes.status, 201);
      expenseId = expRes.body.data.id;

      const hrvRes = await request(app)
        .post('/api/v1/harvests')
        .set('Authorization', farmerA)
        .send({
          farmId,
          crop: 'Wheat',
          season: '2026 Meher',
          harvestDate: '2026-11-15',
          quantity: 30,
          unit: 'Quintals',
          sellingPricePerUnit: 2000,
        });
      assert.equal(hrvRes.status, 201);
      harvestId = hrvRes.body.data.id;

      const patchExp = await request(app)
        .patch(`/api/v1/expenses/${expenseId}`)
        .set('Authorization', farmerA)
        .send({ description: 'Certified Kingbird wheat seed' });
      assert.equal(patchExp.status, 200);

      const patchHrv = await request(app)
        .patch(`/api/v1/harvests/${harvestId}`)
        .set('Authorization', farmerA)
        .send({ buyerName: 'Oromia Union' });
      assert.equal(patchHrv.status, 200);

      const reportRes = await request(app)
        .get('/api/v1/finance/reports')
        .set('Authorization', farmerA);
      assert.equal(reportRes.status, 200);
      assert.ok(Array.isArray(reportRes.body.data.seasons));
      assert.equal(reportRes.body.data.overall.estimatedProfit, 35000);
    });
  });

  describe('4. Marketplace Inquiry Management', () => {
    let listingId;
    let inquiryId;

    it('allows seller to view and update inquiry status on their listing', async () => {
      const lstRes = await request(app)
        .post('/api/v1/marketplace/listings')
        .set('Authorization', farmerA)
        .send({
          commodityName: 'White Teff',
          variety: 'Magna',
          category: 'cereals_grains',
          description: 'Clean highland white teff ready for wholesale buyers.',
          volumeAmount: 50,
          volumeUnit: 'Quintals',
          askingPriceAmount: 6500,
          priceUnit: 'Quintal',
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          contactPerson: 'Abebe',
          contactPhone: '+251911000000',
          harvestYear: 2026,
        });
      assert.equal(lstRes.status, 201);
      listingId = lstRes.body.data.id;

      const inqRes = await request(app)
        .post(`/api/v1/marketplace/listings/${listingId}/inquiries`)
        .set('Authorization', farmerB)
        .send({
          senderName: 'Buyer Bekele',
          senderPhone: '+251922000000',
          message: 'Interested in buying 20 quintals.',
          offeredPrice: 6400,
        });
      assert.equal(inqRes.status, 201);
      inquiryId = inqRes.body.data.id;

      const listInq = await request(app)
        .get('/api/v1/marketplace/inquiries')
        .set('Authorization', farmerA);
      assert.equal(listInq.status, 200);
      assert.ok(listInq.body.data.some((i) => i.id === inquiryId));

      // Buyer cannot update seller's inquiry status
      const buyerUpdate = await request(app)
        .patch(`/api/v1/marketplace/inquiries/${inquiryId}`)
        .set('Authorization', farmerB)
        .send({ status: 'responded' });
      assert.equal(buyerUpdate.status, 403);

      // Seller updates status
      const sellerUpdate = await request(app)
        .patch(`/api/v1/marketplace/inquiries/${inquiryId}`)
        .set('Authorization', farmerA)
        .send({ status: 'responded' });
      assert.equal(sellerUpdate.status, 200);
      assert.equal(sellerUpdate.body.data.status, 'responded');
    });
  });

  describe('5. Gebere Vision AI Validation & Q&A', () => {
    it('rejects unsupported image MIME types', async () => {
      const res = await request(app)
        .post('/api/v1/crop-health/diagnose')
        .set('Authorization', farmerA)
        .send({
          crop: 'Coffee',
          imageUrl: 'data:application/pdf;base64,JVBERi0xLjQ=',
        });
      assert.equal(res.status, 400);
    });

    it('includes advisory disclaimer on diagnosis and answers agricultural questions', async () => {
      const diagRes = await request(app)
        .post('/api/v1/crop-health/diagnose')
        .set('Authorization', farmerA)
        .send({ crop: 'Barley', observedSymptoms: 'yellow leaves' });
      assert.equal(diagRes.status, 200);
      assert.ok(diagRes.body.data.disclaimer.includes('Advisory Notice'));

      const askRes = await request(app)
        .post('/api/v1/crop-health/ask')
        .set('Authorization', farmerA)
        .send({ question: 'How should I rotate teff with legumes in East Shewa?', crop: 'Teff' });
      assert.equal(askRes.status, 200);
      assert.ok(askRes.body.data.answer.length > 10);
    });
  });

  describe('6. RBAC, Notifications & OpenAPI Docs', () => {
    it('enforces admin role on /api/v1/users', async () => {
      const nonAdmin = await request(app)
        .get('/api/v1/users')
        .set('Authorization', farmerA);
      assert.equal(nonAdmin.status, 403);

      const adminRes = await request(app)
        .get('/api/v1/users')
        .set('Authorization', adminToken)
        .set('x-demo-role', 'admin');
      assert.equal(adminRes.status, 200);
    });

    it('manages user-scoped notifications', async () => {
      const createRes = await request(app)
        .post('/api/v1/notifications')
        .set('Authorization', farmerA)
        .send({ title: 'Harvest Reminder', message: 'Check moisture level', type: 'farm' });
      assert.equal(createRes.status, 201);
      const notifId = createRes.body.data.id;

      const forbiddenRead = await request(app)
        .patch(`/api/v1/notifications/${notifId}/read`)
        .set('Authorization', farmerB);
      assert.equal(forbiddenRead.status, 403);

      const okRead = await request(app)
        .patch(`/api/v1/notifications/${notifId}/read`)
        .set('Authorization', farmerA);
      assert.equal(okRead.status, 200);
      assert.equal(okRead.body.data.read, true);
    });

    it('serves OpenAPI 3.0.3 documentation', async () => {
      const res = await request(app).get('/api/v1/docs/openapi.json');
      assert.equal(res.status, 200);
      assert.equal(res.body.openapi, '3.0.3');
      assert.ok(res.body.info.title.includes('Gebere 360'));
    });
  });
});
