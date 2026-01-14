# Church Website - Backend API

REST API for the church website built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Auth0 (JWT)
- **Validation:** express-validator
- **Logging:** Winston
- **Email:** Nodemailer
- **File Upload:** Multer + Sharp

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── index.js     # Main config (env variables)
│   │   ├── database.js  # MongoDB connection
│   │   └── auth0.js     # Auth0 middleware
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middleware
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validateRequest.js
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Sermon.js
│   │   ├── Ministry.js
│   │   ├── PrayerRequest.js
│   │   └── SmallGroup.js
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── helpers/         # Utility functions
│   │   ├── logger.js
│   │   ├── responseHandler.js
│   │   ├── emailService.js
│   │   └── fileUpload.js
│   ├── commons/         # Constants and errors
│   ├── validators/      # Request validators
│   ├── seeders/         # Database seeders
│   └── index.js         # Application entry point
├── logs/                # Log files
├── uploads/             # Uploaded files
├── Dockerfile
├── package.json
└── .env.example
```

## Prerequisites

- Node.js 20 or higher
- MongoDB 6.0 or higher
- Auth0 account (for authentication)

## Installation

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

### Using Docker

```bash
# From the project root directory
docker-compose up -d backend mongodb
```

## MongoDB Connection

### Connection String Format

When using Docker MongoDB with authentication, the connection string requires `authSource=admin`:

```
mongodb://username:password@host:port/database?authSource=admin
```

**Why `authSource=admin`?** Docker creates the root user in the `admin` database via `MONGO_INITDB_ROOT_USERNAME`. Without `authSource=admin`, MongoDB tries to authenticate against the target database (`church_db`) and fails.

### Connection Options

**Option 1: Using root user (default)**
```bash
# Uses credentials from root .env (MONGO_ROOT_USERNAME/PASSWORD)
MONGODB_URI=mongodb://admin:abc123@localhost:27017/church_db?authSource=admin
```

**Option 2: Using application user**
```bash
# Uses church_app user created by mongo-init.js (no authSource needed)
MONGODB_URI=mongodb://church_app:church_app_password@localhost:27017/church_db
```

### Connecting from Different Tools

**Command Line (mongosh):**
```bash
# Using root user
mongosh "mongodb://admin:abc123@localhost:27017/church_db?authSource=admin"

# Using app user
mongosh "mongodb://church_app:church_app_password@localhost:27017/church_db"
```

**VS Code MongoDB Extension:**
1. Click "Add Connection" in the MongoDB extension
2. Use connection string: `mongodb://admin:abc123@localhost:27017/church_db?authSource=admin`
3. Or use app user: `mongodb://church_app:church_app_password@localhost:27017/church_db`

**MongoDB Compass:**
1. Paste connection string: `mongodb://admin:abc123@localhost:27017/church_db?authSource=admin`
2. Click "Connect"

### Troubleshooting

**"Authentication failed" error:**
- Ensure `?authSource=admin` is in your connection string when using root user
- Verify credentials match those in root `.env` file
- If using Docker, ensure the MongoDB container was created fresh (credentials are only set on first run)

**To reset MongoDB credentials:**
```bash
# Stop containers and remove volumes
docker-compose down -v

# Update credentials in root .env file
# MONGO_ROOT_USERNAME=admin
# MONGO_ROOT_PASSWORD=your_new_password

# Start fresh
docker-compose up -d mongodb
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/church_db` |
| `AUTH0_DOMAIN` | Auth0 tenant domain | - |
| `AUTH0_AUDIENCE` | Auth0 API identifier | - |
| `AUTH0_CLIENT_ID` | Auth0 client ID | - |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | - |
| `JWT_SECRET` | JWT signing secret | - |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `SMTP_HOST` | SMTP server host | - |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/public/homepage` | Homepage data |
| GET | `/api/v1/public/church-info` | Church information |
| POST | `/api/v1/public/contact` | Submit contact form |
| POST | `/api/v1/public/prayer-request` | Submit prayer request |
| POST | `/api/v1/public/newsletter` | Newsletter subscription |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | List all events |
| GET | `/api/v1/events/upcoming` | Get upcoming events |
| GET | `/api/v1/events/featured` | Get featured events |
| GET | `/api/v1/events/:id` | Get event by ID |
| POST | `/api/v1/events` | Create event (auth) |
| PUT | `/api/v1/events/:id` | Update event (auth) |
| DELETE | `/api/v1/events/:id` | Delete event (admin) |

### Sermons

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sermons` | List all sermons |
| GET | `/api/v1/sermons/latest` | Get latest sermon |
| GET | `/api/v1/sermons/featured` | Get featured sermons |
| GET | `/api/v1/sermons/series` | Get sermon series |
| GET | `/api/v1/sermons/:id` | Get sermon by ID |
| POST | `/api/v1/sermons` | Create sermon (auth) |
| PUT | `/api/v1/sermons/:id` | Update sermon (auth) |
| DELETE | `/api/v1/sermons/:id` | Delete sermon (admin) |

### Ministries

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ministries` | List all ministries |
| GET | `/api/v1/ministries/featured` | Get featured ministries |
| GET | `/api/v1/ministries/:id` | Get ministry by ID |
| POST | `/api/v1/ministries/:id/join` | Join ministry (auth) |
| DELETE | `/api/v1/ministries/:id/leave` | Leave ministry (auth) |

### Users (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current user profile |
| PUT | `/api/v1/users/me` | Update current user |
| POST | `/api/v1/users/sync` | Sync user from Auth0 |
| GET | `/api/v1/users/directory` | Get member directory |

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run all seeders
npm run seed

# Run specific seeders
npm run seed:users
npm run seed:events
npm run seed:sermons

# Run linter
npm run lint

# Run tests
npm test
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { },
  "timestamp": "2024-01-10T12:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE",
  "errors": [],
  "timestamp": "2024-01-10T12:00:00.000Z"
}
```

## Authentication

This API uses Auth0 for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## License

Private - All rights reserved
