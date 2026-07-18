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
      getConnection: jest.fn().mockReturnValue({
        release: jest.fn(),
        query: jest.fn().mockResolvedValue([[]]),
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn()
      })
    },
    testConnection: jest.fn()
  };
});

// Mock service layers
jest.unstable_mockModule('../src/services/routing.service.js', () => {
  return {
    assignStaffByCategory: jest.fn().mockResolvedValue({ id: 3 }),
    incrementWorkload: jest.fn().mockResolvedValue(true),
    decrementWorkload: jest.fn().mockResolvedValue(true)
  };
});

jest.unstable_mockModule('../src/services/notification.service.js', () => {
  return {
    createNotification: jest.fn().mockResolvedValue({ id: 99, title: 'Mock Notification' }),
    notifyByRole: jest.fn().mockResolvedValue([]),
    getUserNotifications: jest.fn().mockResolvedValue([]),
    markAsRead: jest.fn().mockResolvedValue(true)
  };
});

// Import app after mocks are defined
const app = (await import('../src/app.js')).default;
const dbConfig = await import('../src/config/db.js');

describe('Ticket API Endpoint Tests', () => {
  let studentToken;

  beforeAll(() => {
    // Generate valid mock JWT token
    studentToken = jwt.sign({ id: 1, role: 'student', full_name: 'Stella Starr' }, process.env.JWT_SECRET || 'secret');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tickets', () => {
    it('should submit a ticket and auto-assign active category specialist', async () => {
      // 1. Mock Category validity check
      dbConfig.pool.query.mockResolvedValueOnce([[{ id: 1, name: 'Academic', is_active: 1 }]]);
      // 2. Mock INSERT ticket
      dbConfig.pool.query.mockResolvedValueOnce([{ insertId: 100 }]);

      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Missing elective grade',
          description: 'Detailing issues with my final elective results registration.',
          category_id: 1
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message');
    });

    it('should reject tickets with short description body details', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Too short',
          description: 'Tiny desc',
          category_id: 1
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
