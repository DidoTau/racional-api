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
- `users`
- `portfolios`
- `holdings`
- `base_models` (if included in schema)

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
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI/CD environments

## 🌐 API Endpoints

### Transaction Endpoints
- `POST /api/transactions` - Register a deposit or withdrawal transaction
- `GET /api/users/:userId/transactions` - Get all transactions for a specific user

### Stock Order Endpoints
- `POST /api/stock-orders` - Register a buy or sell stock order
- `GET /api/users/:userId/stock-orders` - Get all stock orders for a specific user

### User Endpoints
- `GET /api/users/:userId` - Get user information
- `PUT /api/users/:userId` - Update user personal information

### Portfolio Endpoints
- `GET /api/users/:userId/portfolio` - Get user's portfolio
- `PUT /api/portfolios/:portfolioId` - Update portfolio information
- `GET /api/portfolios/:portfolioId/total` - Get portfolio total value and holdings

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

# Run tests matching a pattern
npm test -- --testNamePattern="should create a deposit"
```

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database (⚠️ This will delete all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Push schema changes without migrations (development only)
npx prisma db push
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
