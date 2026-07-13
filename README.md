# Event Ticket Booking Backend

A scalable Event Ticket Booking backend built with Node.js, Express, PostgreSQL, and Sequelize ORM following clean layered architecture.

## Architecture

The project follows a strict layered architecture pattern:
```
Routes ──> Controllers ──> Services ──> Repositories ──> Sequelize Models ──> PostgreSQL
```

- **Routes**: Define URL paths and HTTP verbs, map them to Controllers, and handle HTTP validations (Joi) & authentication/RBAC middleware.
- **Controllers**: Express-specific request/response handlers. Responsible for reading query/params/body and delegating tasks to services.
- **Services**: Contain all core business logic (e.g., pricing rules, booking flow, ticket generation). Clean of HTTP or raw database semantics.
- **Repositories**: Encapsulate database interactions (queries, transactions, updates). Sits as an abstraction layer over Sequelize models.
- **Models**: Sequelize models defining schemas, data types, validation hooks, and relational associations.

---

## Directory Structure

```
event-ticket-booking-server
│
├── src
│   ├── config          # Database, Constants, and RBAC matrix permissions configurations
│   ├── controllers     # Layer 1: HTTP Controllers
│   ├── services        # Layer 2: Core Business Logic Services
│   ├── repositories    # Layer 3: Database Data Access Repositories
│   ├── models          # Layer 4: Sequelize Model Declarations
│   ├── routes          # API Routes wiring
│   ├── middlewares     # Auth, RBAC, Async handlers, and Error handlers
│   ├── validations     # Joi validation schemas
│   ├── database        # Database migrations, seeders, and associations
│   ├── utils           # Common Utilities (JWT, Bcrypt, Logger, QR, Ticket number, ApiError)
│   ├── app.js          # Express app configuration
│   └── server.js       # Database check & server entrypoint
│
├── .env                # Local Environment variables
├── .gitignore          # Git exclusion rules
├── .sequelizerc        # Sequelize CLI configuration mapping
├── package.json        # Main configuration and dependency list
└── README.md           # Documentation
```

---

## Modules Included

- **Authentication**: JWT token management, user registration, and login.
- **Role & Permission Management**: Comprehensive Role-Based Access Control (RBAC).
- **Venue & Event Management**: Setting up venues, scheduling events, managing dates.
- **Seat Management**: Organizing seats into categories (VIP, general, etc.) and keeping track of reservation status.
- **Booking & Ticket Management**: Handling booking lifecycle and generating scannable QR ticket numbers.
- **Dashboard & Reports**: Aggregate sales, inventory statistics, and custom sales exports.

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   Create a `.env` file from the placeholder configurations.

3. **Database migrations & seeders**:
   ```bash
   # Run migrations
   npm run db:migrate

   # Seed initial roles and administrative setup
   npm run db:seed
   ```

4. **Run Server**:
   ```bash
   # Production
   npm start

   # Development (Hot reload)
   npm run dev
   ```
