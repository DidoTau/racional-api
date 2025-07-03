# Racional API

A TypeScript Express API with Prisma ORM and PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd racional-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

## 🐳 Database Setup with Docker

### 1. Start PostgreSQL Database

The project includes a `docker-compose.yml` file that sets up PostgreSQL and pgAdmin.

```bash
# Start the database containers
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **pgAdmin** on port `8080` (optional database management tool)

### 2. Database Connection Details

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `racional_db`
- **Username:** `racional_user`
- **Password:** `racional_password`

### 3. Connect with Database Tools

#### Option A: DBeaver
1. Open DBeaver
2. Go to **Database → New Database Connection**
3. Select **PostgreSQL**
4. Use the connection details above
5. Test connection and click **Finish**

#### Option B: pgAdmin (Web Interface)
1. Open your browser and go to `http://localhost:8080`
2. Login with:
   - **Email:** `admin@racional.com`
   - **Password:** `admin123`
3. Add a new server with the connection details above

## 🗄️ Database Schema Setup

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Create and Run Migrations
```bash
# Create initial migration
npx prisma migrate dev --name init
```

This command will:
- Detect schema changes
- Create migration files
- Apply migrations to the database
- Regenerate the Prisma client

### 3. Verify Tables
After running migrations, you should see the following tables in your database:
- `User`: Stores user account information (name, email, phone, etc.)
- `Portfolio`: Represents a user's investment portfolio, including its name and description
- `StockOrder`: Records buy or sell orders for stocks placed by users
- `Transaction`: Logs deposit or withdrawal transactions for user accounts
- `Holding`: Tracks individual stock holdings within a portfolio (stock symbol, quantity, average price)

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the server
npm start
```

## 📁 Project Structure

```
racional-api/
├── src/
│   └── app.ts              # Main Express application
├── prisma/
│   └── schema.prisma       # Database schema
├── docker-compose.yml      # Docker configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run all tests

## 🌐 API Endpoints

### Transaction Endpoints
- `POST /api/transactions` - Register a deposit or withdrawal transaction
#### Example Payload
```json
{
  "userId": "user-123",
  "amount": 100000,
  "type": "deposit",
  "description": "Depósito inicial",
  "status": "completed"
}

```
- `GET /api/users/:userId/transactions` - Get all transactions for a specific user

### Stock Order Endpoints
- `POST /api/stock-orders` - Register a buy or sell stock order
#### Example Payload
```json
{
  "userId": "user-123",
  "stock": "AAPL",
  "quantity": 10,
  "type": "buy",
  "price": 150,
  "description": "Compra de acciones Apple",
  "status": "executed"
}

```
- `GET /api/users/:userId/stock-orders` - Get all stock orders for a specific user

### User Endpoints
- `POST /api/users`- Create user
#### Example Payload
```json
{
  "name": "Richard Hendricks",
  "email": "rhendricks@pipepiper.com",
  "phone": "+56912345678"
}
```
- `GET /api/users/:userId` - Get user information
- `PUT /api/users/:userId` - Update user personal information
#### Example Payload
```json
{
  "name": "Richard",
  "email": "rhendricks@pipepiper.com",
  "phone": "+56912345678"
}
```


### Portfolio Endpoints
- `POST /api/portfolios``
#### Example Payload
```json
{
  "userId": "user-123",
  "name": "Mi Portafolio",
  "description": "Portafolio de prueba",
  "holdings": [
    {
      "stock": "AAPL",
      "quantity": 5,
      "averagePrice": 145
    },
    {
      "stock": "TSLA",
      "quantity": 2,
      "averagePrice": 700
    }
  ]
}

```
- `GET /api/users/:userId/portfolio` - Get user's portfolio
- `PUT /api/portfolios/:portfolioId` - Update portfolio information
#### Example Payload
```json
{
  "name": "Portafolio actualizado",
  "description": "Ahora con nuevo nombre"
}
```
- `GET /api/portfolios/:portfolioId/total` - Get portfolio total value and holdings
- `POST /api/portfolios/:portfolioId/holdings` - Add a new holding to a portfolio
#### Example Payload
```json
{
  "stock": "MSFT",
  "quantity": 3,
  "averagePrice": 310
}
```
- `PUT /api/portfolios/:portfolioId/holdings/:holdingId` - Update a specifig holding
#### Example Payload
```json
{
  "stock": "MSFT",
  "quantity": 5,
  "averagePrice": 310
}
```

### Integration Endpoints
- `GET /api/users/:userId/movements` - Get user's recent movements (transactions and orders)


## 🛠️ Development

### Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD environments
npm run test:ci

# Run specific test file
npm test -- transactions.test.ts

```

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database (⚠️ This will delete all data)
npx prisma migrate reset

```

### Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs postgres

# Remove containers and volumes
docker-compose down -v
```

## 🔍 Troubleshooting

### Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check if port 5432 is available
- Verify connection details in `.env` file

### Migration Issues
- Make sure database is running before migrations
- Check Prisma schema syntax
- Use `npx prisma migrate reset` to start fresh

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration
- Ensure Prisma client is generated: `npx prisma generate`

## 📝 Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://racional_user:racional_password@localhost:5432/racional_db?schema=public"

# App
PORT=3000
NODE_ENV=development
```


## Notes

> **Disclaimer**: I've never used Prisma before, so there might be some mistakes or non-standard usage of the ORM — but hey, it works! 😄
> **POSTMAN**: You can also test the API using the Postman collection provided in the file `Racional_API.postman_collection.json` 