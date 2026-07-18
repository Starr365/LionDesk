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

// Mock notification service
jest.unstable_mockModule('../src/services/notification.service.js', () => {
  return {
    createNotification: jest.fn().mockResolvedValue({ id: 99 }),
    notifyByRole: jest.fn().mockResolvedValue([]),
    getUserNotifications: jest.fn().mockResolvedValue([
      { id: 1, user_id: 2, title: 'Ticket assigned', is_read: 0 }
    ]),
    markAsRead: jest.fn().mockResolvedValue(true)
  };
});

// Import app after mocks are defined
const app = (await import('../src/app.js')).default;
const notifService = await import('../src/services/notification.service.js');

describe('Notification API Endpoint Tests', () => {
  let userToken;

  beforeAll(() => {
    userToken = jwt.sign({ id: 2, role: 'student', full_name: 'Stella Starr' }, process.env.JWT_SECRET || 'secret');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/notifications', () => {
    it('should return list of user notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('title', 'Ticket assigned');
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const res = await request(app)
        .patch('/api/notifications/1/read')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Notification marked as read.');
    });
  });
});
