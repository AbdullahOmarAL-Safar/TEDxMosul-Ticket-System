<div align="center">

# 🛠️ TEDxMosul Ticket System – Backend API

NestJS REST API for event management, ticket booking, and admin operations.

![NestJS](https://img.shields.io/badge/NestJS-11.x-e0234e?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange?logo=typeorm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

</div>

---

## 🎯 Project Title and Purpose

The **TEDxMosul Ticket System Backend** is a production-ready RESTful API built with NestJS and PostgreSQL. It handles user authentication, event management, ticket bookings with approval workflows, speaker profiles, and role-based access control (RBAC) for admin operations.

---

## 🧩 Key Modules

| Module       | Responsibility |
|--------------|----------------|
| **Auth**     | User registration, login, JWT token generation, Passport strategies |
| **Users**    | User CRUD, role management, profile retrieval |
| **Events**   | Event creation, updates, listings, capacity management |
| **Bookings** | Ticket booking, approval/rejection, QR verification, check-in |
| **Speakers** | Speaker profiles, bio management, event linking |
| **Database** | Database configuration, migrations, and seeding |

---

## 📁 Project Structure

```
backend/
├─ src/
│  ├─ auth/
│  │  ├─ auth.controller.ts       # POST /auth/register, /auth/login
│  │  ├─ auth.service.ts          # Password hashing, JWT signing
│  │  ├─ jwt.strategy.ts          # Passport JWT validation
│  │  ├─ jwt-auth.guard.ts        # Route protection guard
│  │  ├─ roles.guard.ts           # Role-based access guard
│  │  └─ dto/                     # Login, Register DTOs
│  │
│  ├─ users/
│  │  ├─ user.entity.ts           # User schema (id, email, role, password)
│  │  ├─ users.controller.ts      # User endpoints
│  │  ├─ users.service.ts         # User business logic
│  │  └─ dto/                     # CreateUser, UpdateUserRole DTOs
│  │
│  ├─ events/
│  │  ├─ event.entity.ts          # Event schema (title, date, capacity)
│  │  ├─ events.controller.ts     # Event CRUD endpoints
│  │  ├─ events.service.ts        # Event business logic
│  │  └─ dto/                     # CreateEvent, UpdateEvent DTOs
│  │
│  ├─ bookings/
│  │  ├─ booking.entity.ts        # Booking schema (user, event, status)
│  │  ├─ bookings.controller.ts   # Booking CRUD + approve/reject
│  │  ├─ bookings.service.ts      # Booking logic + capacity checks
│  │  └─ dto/                     # CreateBooking DTO
│  │
│  ├─ speakers/
│  │  ├─ speaker.entity.ts        # Speaker schema (name, bio, socials)
│  │  ├─ speakers.controller.ts   # Speaker CRUD endpoints
│  │  ├─ speakers.service.ts      # Speaker business logic
│  │  └─ dto/                     # CreateSpeaker, UpdateSpeaker DTOs
│  │
│  ├─ database/
│  │  ├─ database.module.ts       # Database configuration
│  │  └─ seed.service.ts          # Database seeding (admin, events, speakers)
│  │
│  ├─ app.module.ts               # Root module (imports all modules)
│  └─ main.ts                     # Bootstrap (CORS, port, ValidationPipe)
│
├─ .env                           # Environment variables
├─ package.json
├─ tsconfig.json
└─ nest-cli.json
```

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tedxmosul_db
JWT_SECRET=your_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
```

**Variables:**
- `PORT` – Backend server port (default: 4000)
- `DATABASE_*` – PostgreSQL connection details
- `JWT_SECRET` – Secret key for signing JWT tokens
- `FRONTEND_URL` – CORS allowed origin

---

## 🛠️ Installation Steps

**Prerequisites:**
- Node.js 18+ and npm
- PostgreSQL 13+ running locally

**Steps:**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with hot-reload
npm run start:dev

# Server will run on http://localhost:4000
```

---

## 🗄️ Database Setup

### Automatic Seeding

The application uses TypeORM's `synchronize: true` for development and automatically seeds initial data on startup via `SeedService`.

**What gets seeded:**
- **Admin User**: `admin@tedxmosul.com` / `admin123` (Role: Admin)
- **Sample Events**: 2-3 TEDx events with capacity and dates
- **Sample Speakers**: Speaker profiles with bios and social links

### Manual Database Creation

If the database doesn't exist:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tedxmosul_db;

# Exit psql
\q
```

### Production Migrations

For production, disable `synchronize` and use migrations:

```bash
# Generate migration
npm run migration:generate -- -n InitialSchema

# Run migrations
npm run migration:run
```

---

## 🔌 API Endpoints Overview

### Authentication (`/auth`)

| Method | Endpoint           | Description          | Auth Required |
|--------|--------------------|----------------------|---------------|
| POST   | `/auth/register`   | Register new user    | ❌            |
| POST   | `/auth/login`      | Login (get JWT)      | ❌            |

### Users (`/users`)

| Method | Endpoint                  | Description              | Role Required |
|--------|---------------------------|--------------------------|---------------|
| GET    | `/users/me`               | Get current user profile | User          |
| GET    | `/users`                  | List all users           | Admin         |
| GET    | `/users/:id/bookings-info`| User booking stats       | Admin         |
| PATCH  | `/users/:id/role`         | Update user role         | Admin         |
| DELETE | `/users/:id`              | Delete user              | Admin         |

### Events (`/events`)

| Method | Endpoint        | Description              | Role Required |
|--------|-----------------|--------------------------|---------------|
| GET    | `/events`       | List all events          | Public        |
| GET    | `/events/:id`   | Get event details        | Public        |
| GET    | `/events/:id/seats` | Get available seats  | Public        |
| POST   | `/events`       | Create new event         | Admin/Staff   |
| PUT    | `/events/:id`   | Update event             | Admin/Staff   |
| DELETE | `/events/:id`   | Delete event             | Admin         |

### Bookings (`/bookings`)

| Method | Endpoint                  | Description              | Role Required |
|--------|---------------------------|--------------------------|---------------|
| POST   | `/bookings`               | Create booking (pending) | User          |
| GET    | `/bookings/me`            | My bookings              | User          |
| GET    | `/bookings`               | All bookings (admin)     | Admin/Staff   |
| POST   | `/bookings/:id/approve`   | Approve booking          | Admin/Staff   |
| POST   | `/bookings/:id/reject`    | Reject booking           | Admin/Staff   |
| POST   | `/bookings/:id/checkin`   | Check-in booking         | Staff         |
| GET    | `/bookings/verify/:code`  | Verify QR code           | Staff         |
| DELETE | `/bookings/:id`           | Cancel booking           | User/Admin    |

### Speakers (`/speakers`)

| Method | Endpoint           | Description          | Role Required |
|--------|--------------------|----------------------|---------------|
| GET    | `/speakers`        | List all speakers    | Public        |
| GET    | `/speakers/:id`    | Get speaker details  | Public        |
| POST   | `/speakers`        | Create speaker       | Admin/Staff   |
| PUT    | `/speakers/:id`    | Update speaker       | Admin/Staff   |
| DELETE | `/speakers/:id`    | Delete speaker       | Admin         |

---

## 🔐 Authentication & Authorization Flow

### 1. Registration
```typescript
POST /auth/register
Body: { name, email, password }
→ Password hashed with bcrypt (10 rounds)
→ User created with default 'user' role
→ Returns: { message: "User registered" }
```

### 2. Login
```typescript
POST /auth/login
Body: { email, password }
→ Password validated with bcrypt.compare()
→ JWT signed with payload: { sub: userId, email, role }
→ Returns: { access_token: "jwt_token", user: {...} }
```

### 3. Protected Routes
```typescript
// In controller
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Get('admin-only')
adminRoute() { ... }

// JWT extracted from Authorization: Bearer <token>
// User payload injected via @Request() req
```

### 4. Role-Based Access

**Roles:**
- `user` – Default role, can book tickets
- `staff` – Can approve bookings, check-in attendees
- `admin` – Full access to all operations

---

## 🛡️ Security Features

✅ **Password Hashing**
- Bcrypt with 10 salt rounds
- Plain passwords never stored

✅ **JWT Authentication**
- Stateless token-based auth
- Payload includes user ID, email, role
- Token validation via Passport strategy

✅ **CORS Configuration**
- Allowed origins: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`
- Credentials enabled for cookie support

✅ **Input Validation**
- `ValidationPipe` enabled globally
- DTOs use `class-validator` decorators
- Automatic whitelist and transformation

✅ **SQL Injection Protection**
- TypeORM parameterized queries
- No raw SQL without sanitization

✅ **Role Guards**
- Decorator-based role enforcement
- Centralized access control logic

---

## 🧪 Testing / Postman Collection (Optional)

### Quick API Test with cURL

**Register:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tedxmosul.com","password":"admin123"}'
```

**Get Events:**
```bash
curl http://localhost:4000/events
```

**Create Booking (with JWT):**
```bash
curl -X POST http://localhost:4000/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId":"event-uuid","numberOfTickets":2}'
```

---

## 🌱 Seeding Information

### Default Admin Account

After first run, the following admin account is available:

```
Email: admin@tedxmosul.com
Password: admin123
Role: admin
```

⚠️ **Change this password in production!**

### Sample Data

The seed service creates:
- 2-3 sample TEDx events
- 3-4 speaker profiles
- Event-speaker relationships

To re-seed (drops existing data):
```bash
# Stop server, delete database, restart
npm run start:dev
```

---

## 🚀 Deployment Notes

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Production Checklist

- [ ] Set `synchronize: false` in TypeORM config
- [ ] Use migrations instead of auto-sync
- [ ] Set strong `JWT_SECRET` (64+ random chars)
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging (Winston/Pino)
- [ ] Set up monitoring (Sentry, Datadog)
- [ ] Use environment-specific configs
- [ ] Change default admin password

### Environment Variables (Production)

```env
PORT=4000
NODE_ENV=production
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=strong-password
DATABASE_NAME=tedxmosul_prod
JWT_SECRET=super-secret-64-char-random-string
FRONTEND_URL=https://yourdomain.com
```

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](../LICENSE) file for details.

---

## 🙌 Credits

Built with ❤️ for **TEDx Mosul** by [Abdullah Omar AL-Safar](https://github.com/AbdullahOmarAL-Safar)

**Tech Stack:**
- [NestJS](https://nestjs.com/) – Progressive Node.js framework
- [TypeORM](https://typeorm.io/) – ORM for TypeScript
- [PostgreSQL](https://www.postgresql.org/) – Relational database
- [Passport](http://www.passportjs.org/) – Authentication middleware
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Password hashing

---

<div align="center">

**🛠️ Built with NestJS • 🔐 Secure by Design • 📦 Production Ready**

</div>
