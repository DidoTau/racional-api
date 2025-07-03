import request from 'supertest';
import app from '../src/app';
import { createTestUser } from './helpers/testHelpers';

describe('User API', () => {
  it('should create a user', async () => {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '+1234567890'
    };
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    expect(response.body).toMatchObject({
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    });
  });

  it('should update user information', async () => {
    const user = await createTestUser();
    const updateData = {
      name: 'Updated Name',
      email: `updated${Date.now()}@example.com`,
      phone: '+9876543210'
    };
    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .send(updateData)
      .expect(200);
    expect(response.body).toMatchObject({
      id: user.id,
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone
    });
  });
}); 