"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API Racional',
        version: '1.0.0',
        status: 'running'
    });
});
app.post('/api/transactions', async (req, res, next) => {
    try {
        const { userId, amount, type, description, status } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId is required' });
        if (!amount)
            return res.status(400).json({ error: 'amount is required' });
        if (!type)
            return res.status(400).json({ error: 'type is required' });
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
    }
    catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        next(error);
    }
});
app.post('/api/stock-orders', async (req, res, next) => {
    try {
        const { userId, stock, quantity, type, price, description, status } = req.body;
        const stockOrder = await prisma.stockOrder.create({
            data: { userId, stock, quantity, type, price, description, status }
        });
        res.status(201).json(stockOrder);
    }
    catch (error) {
        next(error);
    }
});
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
    }
    catch (error) {
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
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        next(error);
    }
});
app.post('/api/portfolios', async (req, res, next) => {
    try {
        let { userId, name, description, holdings } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId is required' });
        if (!name)
            return res.status(400).json({ error: 'name is required' });
        if (!holdings)
            holdings = [];
        const portfolio = await prisma.portfolio.create({
            data: {
                userId,
                name,
                description,
                holdings: {
                    create: holdings.map((holding) => ({
                        stock: holding.stock,
                        quantity: holding.quantity,
                        averagePrice: holding.averagePrice
                    }))
                }
            }
        });
        res.status(201).json(portfolio);
    }
    catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        next(error);
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
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        next(error);
    }
});
app.post('/api/portfolios/:portfolioId/holdings', async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const { stock, quantity, averagePrice } = req.body;
        const holding = await prisma.holding.create({
            data: { portfolioId, stock, quantity, averagePrice }
        });
        res.status(201).json(holding);
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/portfolios/:portfolioId/total', async (req, res, next) => {
    try {
        const { portfolioId } = req.params;
        const holdings = await prisma.holding.findMany({
            where: { portfolioId }
        });
        const total = holdings.reduce((acc, holding) => {
            const avgPrice = typeof holding.averagePrice === 'object' && 'toNumber' in holding.averagePrice
                ? holding.averagePrice.toNumber()
                : Number(holding.averagePrice);
            return acc + (holding.quantity * avgPrice);
        }, 0);
        res.status(200).json({
            total,
            holdings
        });
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/users/:userId/movements', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        const stockOrders = await prisma.stockOrder.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            transactions,
            stockOrders
        });
    }
    catch (error) {
        next(error);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo salió mal!',
        message: err.message
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map