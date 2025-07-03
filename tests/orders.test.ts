import request from 'supertest';
import app from '../src/app';
import { v4 as uuid } from 'uuid';

describe('Stock Order API', () => {
  it('should create a buy order', async () => {
    const userRes = await request(app).post('/api/users').send({
      name: 'Order User',
      email: `order_${uuid()}@example.com`,
      phone: '+123456789'
    }).expect(201);
    const user = userRes.body;
    await new Promise(r => setTimeout(r, 50));
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
    const userRes2 = await request(app).post('/api/users').send({
      name: 'Order User 2',
      email: `order_${uuid()}@example.com`,
      phone: '+987654321'
    }).expect(201);
    const user = userRes2.body;
    await new Promise(r => setTimeout(r, 50));
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