import { Router, Request, Response } from 'express';

export const openApiRouter = Router();

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Gebere 360 Centralized Platform API',
    version: '1.0.0',
    description:
      'Centralized REST API powering Gebere 360 Web (Next.js) and Mobile (React Native / Expo) applications for Ethiopian agriculture.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Base Path',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Health', description: 'Service & database health telemetry' },
    { name: 'Auth', description: 'Unified Web & Mobile authentication' },
    { name: 'Users', description: 'User profiles & admin role management' },
    { name: 'Farms', description: 'Farm registration, activities, and performance' },
    { name: 'Land', description: 'Land area, valuation, and GPS/polygon records' },
    { name: 'Expenses', description: 'Farm operational expenses' },
    { name: 'Harvests', description: 'Harvest yields & revenue tracking' },
    { name: 'Finance', description: 'Profit/loss summaries and seasonal reports' },
    { name: 'Marketplace', description: 'Agricultural produce listings & inquiries' },
    { name: 'CropHealth', description: 'Gebere Vision AI disease diagnosis & Q&A' },
    { name: 'CropProtection', description: 'MoA/EAA registered crop protection medicines' },
    { name: 'Notifications', description: 'User notifications across web & mobile' },
    { name: 'Catalog', description: 'Ethiopian crops and administrative locations' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Get API and database health status',
        security: [],
        responses: { '200': { description: 'Healthy' }, '503': { description: 'Database degraded' } },
      },
    },
    '/auth/status': {
      get: {
        tags: ['Auth'],
        summary: 'Check authentication subsystem status',
        security: [],
        responses: { '200': { description: 'Auth status' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new Gebere 360 user',
        security: [],
        responses: { '201': { description: 'User registered' }, '400': { description: 'Validation error' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate user and issue access & refresh tokens',
        security: [],
        responses: { '200': { description: 'Authenticated' }, '401': { description: 'Invalid credentials' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token using refreshToken',
        security: [],
        responses: { '200': { description: 'Token refreshed' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Sign out current session',
        responses: { '200': { description: 'Logged out' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset email',
        security: [],
        responses: { '200': { description: 'Reset link sent' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user context',
        responses: { '200': { description: 'Authenticated user' } },
      },
    },
    '/users/me': {
      get: { tags: ['Users'], summary: 'Get current user profile', responses: { '200': { description: 'Profile' } } },
      patch: { tags: ['Users'], summary: 'Update current user profile', responses: { '200': { description: 'Updated' } } },
    },
    '/users': {
      get: { tags: ['Users'], summary: 'Admin: List all users (paginated)', responses: { '200': { description: 'User list' }, '403': { description: 'Forbidden' } } },
    },
    '/users/{userId}/role': {
      patch: { tags: ['Users'], summary: 'Admin: Update user role', responses: { '200': { description: 'Role updated' } } },
    },
    '/farms': {
      get: { tags: ['Farms'], summary: 'List user farms', responses: { '200': { description: 'Farm list' } } },
      post: { tags: ['Farms'], summary: 'Register a new farm', responses: { '201': { description: 'Farm created' } } },
    },
    '/farms/{farmId}': {
      get: { tags: ['Farms'], summary: 'Get farm details', responses: { '200': { description: 'Farm detail' } } },
      patch: { tags: ['Farms'], summary: 'Update farm', responses: { '200': { description: 'Farm updated' } } },
      delete: { tags: ['Farms'], summary: 'Delete farm', responses: { '200': { description: 'Farm deleted' } } },
    },
    '/farms/{farmId}/activities': {
      get: { tags: ['Farms'], summary: 'List farm activities', responses: { '200': { description: 'Activity list' } } },
      post: { tags: ['Farms'], summary: 'Record a farm activity', responses: { '201': { description: 'Activity created' } } },
    },
    '/farms/{farmId}/performance': {
      get: { tags: ['Farms'], summary: 'Get farm performance summary (expenses, revenue, profit, ROI)', responses: { '200': { description: 'Performance metrics' } } },
    },
    '/land/calculate': {
      post: { tags: ['Land'], summary: 'Calculate land area and valuation (rectangular or polygon)', security: [], responses: { '200': { description: 'Calculation result' } } },
    },
    '/land/records': {
      get: { tags: ['Land'], summary: 'List saved land records', responses: { '200': { description: 'Land records' } } },
      post: { tags: ['Land'], summary: 'Save a land record', responses: { '201': { description: 'Land record saved' } } },
    },
    '/land/records/{id}': {
      get: { tags: ['Land'], summary: 'Get land record by ID', responses: { '200': { description: 'Land record' } } },
      patch: { tags: ['Land'], summary: 'Update land record', responses: { '200': { description: 'Updated' } } },
      delete: { tags: ['Land'], summary: 'Delete land record', responses: { '200': { description: 'Deleted' } } },
    },
    '/expenses': {
      get: { tags: ['Expenses'], summary: 'List user expenses', responses: { '200': { description: 'Expenses' } } },
      post: { tags: ['Expenses'], summary: 'Log a farm expense', responses: { '201': { description: 'Expense created' } } },
    },
    '/expenses/{id}': {
      patch: { tags: ['Expenses'], summary: 'Update an expense', responses: { '200': { description: 'Updated' } } },
      delete: { tags: ['Expenses'], summary: 'Delete an expense', responses: { '200': { description: 'Deleted' } } },
    },
    '/harvests': {
      get: { tags: ['Harvests'], summary: 'List user harvests', responses: { '200': { description: 'Harvests' } } },
      post: { tags: ['Harvests'], summary: 'Log a harvest record', responses: { '201': { description: 'Harvest created' } } },
    },
    '/harvests/{id}': {
      patch: { tags: ['Harvests'], summary: 'Update a harvest record', responses: { '200': { description: 'Updated' } } },
      delete: { tags: ['Harvests'], summary: 'Delete a harvest record', responses: { '200': { description: 'Deleted' } } },
    },
    '/finance/summary': {
      get: { tags: ['Finance'], summary: 'Get financial P&L summary', responses: { '200': { description: 'Finance summary' } } },
    },
    '/finance/reports': {
      get: { tags: ['Finance'], summary: 'Get historical season-by-season P&L report', responses: { '200': { description: 'Financial report' } } },
    },
    '/marketplace/listings': {
      get: { tags: ['Marketplace'], summary: 'Browse/search/filter marketplace listings', security: [], responses: { '200': { description: 'Listings' } } },
      post: { tags: ['Marketplace'], summary: 'Create a marketplace listing', responses: { '201': { description: 'Created' } } },
    },
    '/marketplace/listings/{listingId}': {
      get: { tags: ['Marketplace'], summary: 'Get listing detail', security: [], responses: { '200': { description: 'Detail' } } },
      patch: { tags: ['Marketplace'], summary: 'Update own listing', responses: { '200': { description: 'Updated' } } },
      delete: { tags: ['Marketplace'], summary: 'Delete own listing', responses: { '200': { description: 'Deleted' } } },
    },
    '/marketplace/listings/{listingId}/inquiries': {
      post: { tags: ['Marketplace'], summary: 'Submit purchase inquiry to seller', security: [], responses: { '201': { description: 'Inquiry sent' } } },
    },
    '/marketplace/inquiries': {
      get: { tags: ['Marketplace'], summary: 'List inquiries for seller listings or sent by buyer', responses: { '200': { description: 'Inquiries' } } },
    },
    '/marketplace/inquiries/{inquiryId}': {
      patch: { tags: ['Marketplace'], summary: 'Seller updates inquiry status', responses: { '200': { description: 'Updated' } } },
    },
    '/crop-health/diagnose': {
      post: { tags: ['CropHealth'], summary: 'Diagnose crop disease via Gebere Vision AI', responses: { '200': { description: 'Diagnosis result' } } },
    },
    '/crop-health/ask': {
      post: { tags: ['CropHealth'], summary: 'Ask general agricultural guidance question', responses: { '200': { description: 'Advisory answer' } } },
    },
    '/crop-health/history': {
      get: { tags: ['CropHealth'], summary: 'Get diagnostic scan history', responses: { '200': { description: 'History logs' } } },
    },
    '/crop-health/request-expert': {
      post: { tags: ['CropHealth'], summary: 'Escalate diagnosis to Woreda Agricultural Expert', responses: { '201': { description: 'Escalated' } } },
    },
    '/notifications': {
      get: { tags: ['Notifications'], summary: 'List user notifications', responses: { '200': { description: 'Notifications' } } },
      post: { tags: ['Notifications'], summary: 'Create notification', responses: { '201': { description: 'Created' } } },
    },
    '/notifications/read-all': {
      patch: { tags: ['Notifications'], summary: 'Mark all notifications as read', responses: { '200': { description: 'Updated' } } },
    },
    '/notifications/{id}/read': {
      patch: { tags: ['Notifications'], summary: 'Mark notification as read', responses: { '200': { description: 'Updated' } } },
    },
    '/notifications/{id}': {
      delete: { tags: ['Notifications'], summary: 'Delete notification', responses: { '200': { description: 'Deleted' } } },
    },
    '/crop-protection/products': {
      get: { tags: ['CropProtection'], summary: 'List MoA/EAA registered crop protection products', security: [], responses: { '200': { description: 'Products' } } },
    },
    '/crops': {
      get: { tags: ['Catalog'], summary: 'List priority Ethiopian crops', security: [], responses: { '200': { description: 'Crops' } } },
    },
    '/locations/regions': {
      get: { tags: ['Catalog'], summary: 'List Ethiopian administrative regions', security: [], responses: { '200': { description: 'Regions' } } },
    },
  },
};

openApiRouter.get('/openapi.json', (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

openApiRouter.get('/', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Gebere 360 API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({ url: '/api/v1/docs/openapi.json', dom_id: '#swagger-ui' });
    };
  </script>
</body>
</html>`);
});
