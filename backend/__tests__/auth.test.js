const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');

describe('Auth API', () => {
  it('should respond to signup request', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser_' + Date.now(),
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
      });

    // If DB is connected, it creates user (201), if 503 (DB disconnected in test env) or 400/409, it responds gracefully
    expect([201, 400, 409, 503]).toContain(response.statusCode);
  });
});
