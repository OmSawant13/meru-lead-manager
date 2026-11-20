import request from 'supertest';
import app from '../app';
import prisma from '../prisma';

describe('Leads API Endpoints', () => {
  let userToken: string;
  let otherUserToken: string;
  let createdLeadId: string;

  beforeAll(async () => {
    // Create test user 1
    const email1 = `lead_tester_1_${Date.now()}@example.com`;
    const res1 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Lead Tester One',
        email: email1,
        password: 'password123',
      });
    userToken = res1.body.data.token;

    // Create test user 2 (for tenant isolation test)
    const email2 = `lead_tester_2_${Date.now()}@example.com`;
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Lead Tester Two',
        email: email2,
        password: 'password123',
      });
    otherUserToken = res2.body.data.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'lead_tester_' } },
    });
    await prisma.$disconnect();
  });

  describe('Authentication protection', () => {
    it('should reject unauthenticated request to /api/leads with 401', async () => {
      const res = await request(app).get('/api/leads');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/leads - Create Lead', () => {
    it('should create a new lead with valid data and default status/source', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Bruce Wayne',
          email: 'bruce@wayneenterprises.com',
          phone: '+1 (555) 019-2834',
          company: 'Wayne Enterprises',
          source: 'Website',
          status: 'New',
          notes: 'High net worth lead interested in defensive tech.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Bruce Wayne');
      expect(res.body.data.status).toBe('New');
      expect(res.body.data.id).toBeDefined();

      createdLeadId = res.body.data.id;
    });

    it('should fail with 400 when required fields are missing or invalid email', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: '',
          email: 'invalid-email-address',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/leads - List Leads', () => {
    it('should return list of leads with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/leads?page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.leads)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(1);
    });

    it('should filter leads by status', async () => {
      const res = await request(app)
        .get('/api/leads?status=New')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.leads.every((l: any) => l.status === 'New')).toBe(true);
    });

    it('should search leads by name or company', async () => {
      const res = await request(app)
        .get('/api/leads?search=Wayne')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.leads.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.leads[0].company).toContain('Wayne');
    });

    it('should NOT return leads belonging to another user', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.leads.length).toBe(0);
    });
  });

  describe('GET /api/leads/stats - Dashboard Counts', () => {
    it('should return lead counts grouped by status and total', async () => {
      const res = await request(app)
        .get('/api/leads/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBeGreaterThanOrEqual(1);
      expect(res.body.data.byStatus).toBeDefined();
      expect(typeof res.body.data.byStatus.New).toBe('number');
      expect(typeof res.body.data.byStatus.Contacted).toBe('number');
      expect(typeof res.body.data.byStatus.Qualified).toBe('number');
      expect(typeof res.body.data.byStatus.Lost).toBe('number');
    });
  });

  describe('GET /api/leads/:id', () => {
    it('should return the lead details for the owner', async () => {
      const res = await request(app)
        .get(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdLeadId);
      expect(res.body.data.name).toBe('Bruce Wayne');
    });

    it('should return 404 if accessed by a different user', async () => {
      const res = await request(app)
        .get(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/leads/:id - Update Lead', () => {
    it('should update lead status and company', async () => {
      const res = await request(app)
        .put(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'Qualified',
          company: 'Wayne Enterprises Holdings',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Qualified');
      expect(res.body.data.company).toBe('Wayne Enterprises Holdings');
    });

    it('should reject update with invalid status', async () => {
      const res = await request(app)
        .put(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'UnknownStatus',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/leads/:id - Delete Lead', () => {
    it('should prevent other users from deleting the lead', async () => {
      const res = await request(app)
        .delete(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(404);
    });

    it('should allow the owner to delete the lead', async () => {
      const res = await request(app)
        .delete(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const verifyRes = await request(app)
        .get(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(verifyRes.status).toBe(404);
    });
  });
});
