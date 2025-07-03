import request from 'supertest';
import app from '../src/app';
import { createTestUser } from './helpers/testHelpers';

describe('Stock Order API', () => {
  it('should create a buy order', async () => {
    const user = await createTestUser();
    const orderData = {
      userId: user.id,
      stock: 'AAPL',
      type: 'BUY',
      quantity: 10,
      price: 150.0,
      description: 'Buying Apple stock',
      status: 'PENDING'
    };
    const response = await request(app)
      .post('/api/stock-orders')
      .send(orderData)
      .expect(201);
    expect(response.body).toMatchObject({
      userId: user.id,
      stock: 'AAPL',
      type: 'BUY',
      quantity: 10,
      price: '150',
      description: 'Buying Apple stock',
      status: 'PENDING'
    });
  });

  it('should create a sell order', async () => {
    const user = await createTestUser();
    const orderData = {
      userId: user.id,
      stock: 'GOOGL',
      type: 'SELL',
      quantity: 5,
      price: 2800.0,
      description: 'Selling Google stock',
      status: 'PENDING'
    };
    const response = await request(app)
      .post('/api/stock-orders')
      .send(orderData)
      .expect(201);
    expect(response.body).toMatchObject({
      userId: user.id,
      stock: 'GOOGL',
      type: 'SELL',
      quantity: 5,
      price: '2800',
      description: 'Selling Google stock',
      status: 'PENDING'
    });
  });
}); 