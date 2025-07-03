import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TestUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
}

export interface TestPortfolio {
  id: string;
  userId: string;
  name: string;
  description: string | null;
}

export interface TestHolding {
  id: string;
  portfolioId: string;
  stock: string;
  quantity: number;
  averagePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestStockOrder {
  id: string;
  userId: string;
  stock: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestTransaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  description: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export const createTestUser = async (userData?: Partial<TestUser>): Promise<TestUser> => {
  return await prisma.user.create({
    data: {
      email: userData?.email || `test${Date.now()}_${Math.floor(Math.random()*100000)}@example.com`,
      name: userData?.name || 'Test User',
      phone: userData?.phone || '+1234567890',
    },
  });
};

export const createTestPortfolio = async (userId: string, portfolioData?: Partial<TestPortfolio>): Promise<TestPortfolio> => {
  return await prisma.portfolio.create({
    data: {
      userId,
      name: portfolioData?.name || 'Test Portfolio',
      description: portfolioData?.description || 'Test portfolio description',
    },
  });
};

export const createTestHolding = async (portfolioId: string, holdingData?: Partial<TestHolding>): Promise<TestHolding> => {
  const holding = await prisma.holding.create({
    data: {
      portfolioId,
      stock: holdingData?.stock || 'AAPL',
      quantity: holdingData?.quantity || 10,
      averagePrice: holdingData?.averagePrice || 150.0,
    },
  });
  return {
    ...holding,
    averagePrice: typeof holding.averagePrice === 'object' && 'toNumber' in holding.averagePrice
      ? holding.averagePrice.toNumber()
      : holding.averagePrice,
  };
};

export const createTestStockOrder = async (userId: string, orderData?: Partial<TestStockOrder>): Promise<TestStockOrder> => {
  const order = await prisma.stockOrder.create({
    data: {
      userId,
      stock: orderData?.stock || 'AAPL',
      type: orderData?.type || 'BUY',
      quantity: orderData?.quantity || 5,
      price: orderData?.price || 150.0,
      status: orderData?.status || 'COMPLETED',
      description: orderData?.description || null,
    },
  });
  return {
    ...order,
    price: typeof order.price === 'object' && 'toNumber' in order.price
      ? order.price.toNumber()
      : order.price,
  };
};

export const createTestTransaction = async (userId: string, transactionData?: Partial<TestTransaction>): Promise<TestTransaction> => {
  if (!userId) throw new Error('userId is required');

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: transactionData?.type || 'DEPOSIT',
      amount: transactionData?.amount || 1000.0,
      description: transactionData?.description || null,
      status: transactionData?.status || 'COMPLETED',
    },
  });
  return {
    ...transaction,
    amount: typeof transaction.amount === 'object' && 'toNumber' in transaction.amount
      ? transaction.amount.toNumber()
      : transaction.amount,
  };
};

export const generateAuthToken = (userId: string): string => {
  // In a real app, this would generate a JWT token
  // For testing purposes, we'll use a simple string
  return `test-token-${userId}`;
};

export const setupTestData = async () => {
  const user = await createTestUser();
  const portfolio = await createTestPortfolio(user.id);
  const holding = await createTestHolding(portfolio.id);
  const stockOrder = await createTestStockOrder(user.id);
  const transaction = await createTestTransaction(user.id);

  return {
    user,
    portfolio,
    holding,
    stockOrder,
    transaction,
  };
}; 