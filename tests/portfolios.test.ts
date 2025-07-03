import request from 'supertest';
import app from '../src/app';
import { v4 as uuid } from 'uuid';

describe('Portfolio API', () => {
  it('should create a portfolio with holdings', async () => {
    const userRes = await request(app).post('/api/users').send({
      name: 'Portfolio User',
      email: `port_${uuid()}@example.com`,
      phone: '+555555555'
    }).expect(201);
    const user = userRes.body;
    const portfolioData = {
      userId: user.id,
      name: 'My Portfolio',
      description: 'Test portfolio',
      holdings: [
        { stock: 'AAPL', quantity: 10, averagePrice: 150.0 },
        { stock: 'GOOGL', quantity: 5, averagePrice: 2800.0 }
      ]
    };
    const response = await request(app)
      .post('/api/portfolios')
      .send(portfolioData)
      .expect(201);
    expect(response.body).toMatchObject({
      userId: user.id,
      name: 'My Portfolio',
      description: 'Test portfolio'
    });
  });

  it('should update portfolio information', async () => {
    const userRes2 = await request(app).post('/api/users').send({
      name: 'Portfolio User 2',
      email: `port_${uuid()}@example.com`,
      phone: '+666666666'
    }).expect(201);
    const user = userRes2.body;
    const portfolioRes = await request(app)
      .post('/api/portfolios')
      .send({ userId: user.id, name: 'Old Name', description: 'Old desc', holdings: [] })
      .expect(201);
    const updateData = {
      name: 'Updated Portfolio',
      description: 'Updated portfolio description'
    };
    const response = await request(app)
      .put(`/api/portfolios/${portfolioRes.body.id}`)
      .send(updateData)
      .expect(200);
    expect(response.body).toMatchObject({
      id: portfolioRes.body.id,
      userId: user.id,
      name: 'Updated Portfolio',
      description: 'Updated portfolio description'
    });
  });

  it('should add, update, and delete a holding', async () => {
    const userRes3 = await request(app).post('/api/users').send({
      name: 'Portfolio User 3',
      email: `port_${uuid()}@example.com`,
      phone: '+777777777'
    }).expect(201);
    const user = userRes3.body;
    const portfolioRes = await request(app)
      .post('/api/portfolios')
      .send({ userId: user.id, name: 'Portfolio', description: '', holdings: [] })
      .expect(201);
    // Add holding
    const holdingRes = await request(app)
      .post(`/api/portfolios/${portfolioRes.body.id}/holdings`)
      .send({ stock: 'AAPL', quantity: 10, averagePrice: 150.0 })
      .expect(201);
    expect(holdingRes.body).toMatchObject({ stock: 'AAPL', quantity: 10 });
    // Update holding
    const updatedHolding = await request(app)
      .put(`/api/portfolios/${portfolioRes.body.id}/holdings/${holdingRes.body.id}`)
      .send({ stock: 'AAPL', quantity: 20, averagePrice: 155.0 })
      .expect(200);
    expect(updatedHolding.body).toMatchObject({ stock: 'AAPL', quantity: 20, averagePrice: '155' });
    // Delete holding
    await request(app)
      .delete(`/api/portfolios/${portfolioRes.body.id}/holdings/${holdingRes.body.id}`)
      .expect(204);
  });

  it('should get portfolio total value', async () => {
    const userRes4 = await request(app).post('/api/users').send({
      name: 'Portfolio User 4',
      email: `port_${uuid()}@example.com`,
      phone: '+888888888'
    }).expect(201);
    const user = userRes4.body;
    const portfolioRes = await request(app)
      .post('/api/portfolios')
      .send({ userId: user.id, name: 'Portfolio', description: '', holdings: [] })
      .expect(201);
    await request(app)
      .post(`/api/portfolios/${portfolioRes.body.id}/holdings`)
      .send({ stock: 'AAPL', quantity: 10, averagePrice: 150.0 })
      .expect(201);
    await request(app)
      .post(`/api/portfolios/${portfolioRes.body.id}/holdings`)
      .send({ stock: 'GOOGL', quantity: 5, averagePrice: 2800.0 })
      .expect(201);
    const response = await request(app)
      .get(`/api/portfolios/${portfolioRes.body.id}/total`)
      .expect(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('holdings');
    expect(response.body.holdings).toHaveLength(2);
  });
}); 