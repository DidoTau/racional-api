import request from 'supertest';
import app from '../src/app';
import { v4 as uuid } from 'uuid';

describe('Transaction API', () => {
  it('should create a deposit transaction', async () => {
    const userData = {
      name: 'Tx User',
      email: `tx_${uuid()}@example.com`,
      phone: '+111111111'
    };
    const userRes = await request(app).post('/api/users').send(userData).expect(201);
    const user = userRes.body;
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
    const userData = {
      name: 'Tx User 2',
      email: `tx_${uuid()}@example.com`,
      phone: '+222222222'
    };
    const userRes = await request(app).post('/api/users').send(userData).expect(201);
    const user = userRes.body;
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