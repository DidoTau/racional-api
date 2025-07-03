import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API Racional',
    version: '1.0.0',
    status: 'running'
  });
});


// Transaction endpoints
app.post('/api/transactions', async (req, res, next) => {
  try {
    const { userId, amount, type, description, status } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!amount) return res.status(400).json({ error: 'amount is required' });
    if (!type) return res.status(400).json({ error: 'type is required' });
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        status
      }
    });
    res.status(201).json(transaction);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    return next(error);
  }
});


// Stock Order endpoints
app.post('/api/stock-orders', async (req, res, next) => {
  try {
    const { userId, stock, quantity, type, price, description, status } = req.body;
    const stockOrder = await prisma.stockOrder.create({
      data: { userId, stock, quantity, type, price, description, status }
    });
    res.status(201).json(stockOrder);
  } catch (error) {
    next(error);
  }
});


// User endpoints
app.post('/api/users', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone
      }
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.put('/api/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, phone }
    });
    res.status(200).json(user);
  } catch (error: any) {

    return next(error);
  }
});

// Portfolio endpoints
app.post('/api/portfolios', async (req, res, next) => {
  try {
    let { userId, name, description, holdings } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!name) return res.status(400).json({ error: 'name is required' });
    if (!holdings) holdings = [];
    const portfolio = await prisma.portfolio.create({
      data: { 
        userId, 
        name, 
        description, 
        holdings: {
          create: holdings.map((holding: any) => ({
            stock: holding.stock,
            quantity: holding.quantity,
            averagePrice: holding.averagePrice
          }))
        }
      }
    });
    res.status(201).json(portfolio);
  } catch (error: any) {

    return next(error);
  }
});

app.put('/api/portfolios/:portfolioId', async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { name, description } = req.body;
    const updated = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { name, description }
    });
    res.status(200).json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    return next(error);
  }
});

app.post('/api/portfolios/:portfolioId/holdings', async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { stock, quantity, averagePrice } = req.body;
    const holding = await prisma.holding.create({
      data: { portfolioId, stock, quantity, averagePrice}
    });
    res.status(201).json(holding);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/portfolios/:portfolioId/holdings/:holdingId', async (req, res, next) => {
  try {
    const { portfolioId, holdingId } = req.params;
    await prisma.holding.delete({
      where: { id: holdingId }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.put('/api/portfolios/:portfolioId/holdings/:holdingId', async (req, res, next) => {
  try {
    const { portfolioId, holdingId } = req.params;
    const { stock, quantity, averagePrice } = req.body;
    const holding = await prisma.holding.update({
      where: { id: holdingId },
      data: { stock, quantity, averagePrice }
    });
    res.status(200).json(holding);
  } catch (error) {
    next(error);
  }
});

app.get('/api/portfolios/:portfolioId/total', async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    // Get all holdings for the portfolio
    const holdings = await prisma.holding.findMany({
      where: { portfolioId }
    });

    // Calculate sum of (quantity * averagePrice)
    const total = holdings.reduce((acc, holding) => {
      // averagePrice is a Prisma.Decimal, so convert to Number
      const avgPrice = typeof holding.averagePrice === 'object' && 'toNumber' in holding.averagePrice
        ? holding.averagePrice.toNumber()
        : Number(holding.averagePrice);
      return acc + (holding.quantity * avgPrice);
    }, 0);

    res.status(200).json({
      total,
      holdings
    });
  } catch (error) {
    next(error);
  }
});

// Integration endpoints
app.get('/api/users/:userId/movements', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Get all stock orders for the user
    const stockOrders = await prisma.stockOrder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      transactions,
      stockOrders
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

export default app; 