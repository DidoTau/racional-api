import request from 'supertest';
import app from '../src/app';
import { createTestUser } from './helpers/testHelpers';

describe('Transaction API', () => {
  it('should create a deposit transaction', async () => {
    const user = await createTestUser();
    const transactionData = {
      userId: user.id,
      type: 'DEPOSIT',
      amount: 1000.0,
      description: 'Initial deposit',
      status: 'PENDING'
    };
    const response = await request(app)
      .post('/api/transactions')
      .send(transactionData)
      .expect(201);
    expect(response.body).toMatchObject({
      userId: user.id,
      type: 'DEPOSIT',
      amount: '1000',
      description: 'Initial deposit',
      status: 'PENDING'
    });
  });

  it('should create a withdrawal transaction', async () => {
    const user = await createTestUser();
    const transactionData = {
      userId: user.id,
      type: 'WITHDRAWAL',
      amount: 500.0,
      description: 'Cash withdrawal',
      status: 'PENDING'
    };
    const response = await request(app)
      .post('/api/transactions')
      .send(transactionData)
      .expect(201);
    expect(response.body).toMatchObject({
      userId: user.id,
      type: 'WITHDRAWAL',
      amount: '500',
      description: 'Cash withdrawal',
      status: 'PENDING'
    });
  });
}); 