import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Mock the database pool
jest.unstable_mockModule('../src/config/db.js', () => {
  return {
    pool: {
      query: jest.fn(),
      getConnection: jest.fn()
    },
    testConnection: jest.fn()
  };
});

jest.unstable_mockModule('../src/services/routing.service.js', () => {
  return {
    assignStaffByCategory: jest.fn().mockResolvedValue({ id: 3 }),
    incrementWorkload: jest.fn().mockResolvedValue(true),
    decrementWorkload: jest.fn().mockResolvedValue(true)
  };
});

jest.unstable_mockModule('../src/services/notification.service.js', () => {
  return {
    createNotification: jest.fn().mockResolvedValue({ id: 99 }),
    notifyByRole: jest.fn().mockResolvedValue([]),
    getUserNotifications: jest.fn().mockResolvedValue([]),
    markAsRead: jest.fn().mockResolvedValue(true)
  };
});

// Import app after mocks are defined
const app = (await import('../src/app.js')).default;
const dbConfig = await import('../src/config/db.js');

describe('Category Admin API Endpoint Tests', () => {
  let adminToken;
  let studentToken;

  beforeAll(() => {
    adminToken = jwt.sign({ id: 9, role: 'admin', full_name: 'HOD Admin' }, process.env.JWT_SECRET || 'secret');
    studentToken = jwt.sign({ id: 1, role: 'student', full_name: 'Stella' }, process.env.JWT_SECRET || 'secret');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/admin/categories', () => {
    it('should allow admin to create a new ticket category', async () => {
      // Mock category existence check (returns empty list ➔ name is unique)
      dbConfig.pool.query.mockResolvedValueOnce([[]]);
      // Mock insert query
      dbConfig.pool.query.mockResolvedValueOnce([{ insertId: 5 }]);

      const res = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Exams & Results Verification',
          description: 'Issues relating to test marks and grades register',
          escalation_hours: 48
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message');
    });

    it('should forbid student users from creating categories', async () => {
      const res = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Academic Disputes',
          escalation_hours: 24
        });

      expect(res.statusCode).toEqual(403);
    });
  });
});
