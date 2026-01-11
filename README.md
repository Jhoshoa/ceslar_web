# Church Website

A full-stack church website application with member portal, built with React, Node.js, Express, MongoDB, and Auth0.

## Features

- **Public Website**
  - Homepage with hero, events, sermons, and ministries
  - Service times and location information
  - Event calendar and registration
  - Sermon archive with video/audio
  - Ministry information pages
  - Contact form
  - Online giving

- **Member Portal** (Login Required)
  - Personal dashboard
  - Sermon library access
  - Event registration
  - Small group finder
  - Church directory
  - Prayer requests
  - Giving history

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Material-UI |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | Auth0 |
| Containerization | Docker, Docker Compose |

## Project Structure

```
ceslar-web/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── helpers/        # Utilities
│   │   ├── commons/        # Constants
│   │   ├── validators/     # Request validation
│   │   └── seeders/        # Database seeders
│   ├── Dockerfile
│   └── README.md
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── helpers/       # Utilities
│   │   ├── commons/       # Constants
│   │   └── theme/         # MUI theme
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
│
├── docker/                 # Docker configurations
│   └── mongo-init.js      # MongoDB initialization
│
├── docker-compose.yml      # Development setup
├── docker-compose.prod.yml # Production setup
├── .env.example           # Environment template
└── README.md              # This file
```

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js 20+](https://nodejs.org/) (for local development)
- [Auth0 Account](https://auth0.com/) (free tier available)

### Option 1: Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ceslar-web
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Auth0 credentials and other settings.

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

6. **Stop services:**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

1. **Clone and configure:**
   ```bash
   git clone <repository-url>
   cd ceslar-web
   ```

2. **Start MongoDB:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or install MongoDB locally
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your settings
   npm install
   npm run dev
   ```

4. **Setup Frontend** (in a new terminal):
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your Auth0 settings
   npm install
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Docker Commands

### Development

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d backend mongodb

# View logs
docker-compose logs -f [service_name]

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Access MongoDB shell
docker exec -it church_mongodb mongosh

# Start with admin tools (Mongo Express)
docker-compose --profile admin up -d
# Access at http://localhost:8081
```

### Production

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## Auth0 Configuration

> **Full Guide:** See [docs/AUTH0_SETUP.md](./docs/AUTH0_SETUP.md) for detailed step-by-step instructions with screenshots.

### Quick Setup

#### Step 1: Create an Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/) > **Applications** > **Applications**
2. Click **+ Create Application**
3. Select **Single Page Application**, name it `Church Website`
4. Go to **Settings** tab and configure:

| Setting | Value |
|---------|-------|
| **Allowed Callback URLs** | `http://localhost:3000, http://localhost:3000/callback` |
| **Allowed Logout URLs** | `http://localhost:3000` |
| **Allowed Web Origins** | `http://localhost:3000` |
| **Allowed Origins (CORS)** | `http://localhost:3000` |

5. Click **Save Changes**

#### Step 2: Create an API (Required for AUTH0_AUDIENCE)

1. Go to **Applications** > **APIs**
2. Click **+ Create API**
3. Configure:
   - **Name:** `Church API`
   - **Identifier:** `https://church-api` ← This is your `AUTH0_AUDIENCE`
4. Click **Create**

#### Step 3: Copy Values to .env

```env
# From Application > Settings
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
AUTH0_CLIENT_SECRET=your-client-secret-here

# From APIs > Your API > Settings > Identifier
AUTH0_AUDIENCE=https://church-api
```

### Where to Find Each Value

| Variable | Location in Auth0 Dashboard |
|----------|----------------------------|
| `AUTH0_DOMAIN` | Applications > Your App > Settings > **Domain** |
| `AUTH0_CLIENT_ID` | Applications > Your App > Settings > **Client ID** |
| `AUTH0_CLIENT_SECRET` | Applications > Your App > Settings > **Client Secret** |
| `AUTH0_AUDIENCE` | Applications > APIs > Your API > **Identifier** |

### Auth0 URLs Explained

| Setting | Purpose | Value for Local/Docker |
|---------|---------|----------------------|
| **Allowed Callback URLs** | Where Auth0 redirects after login | `http://localhost:3000, http://localhost:3000/callback` |
| **Allowed Logout URLs** | Where Auth0 redirects after logout | `http://localhost:3000` |
| **Allowed Web Origins** | Origins allowed to make auth requests | `http://localhost:3000` |
| **Allowed Origins (CORS)** | Origins allowed for CORS | `http://localhost:3000` |

> **Note:** Both Docker and local development use `localhost:3000` because the frontend container maps to port 3000 on your host machine.

## Environment Variables

Create a `.env` file in the root directory:

```env
# Application
APP_NAME=Our Church

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://church-api
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# JWT
JWT_SECRET=your-jwt-secret

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api/v1

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourchurch.com
```

## Database Seeding

Populate the database with sample data:

```bash
# Using Docker
docker exec -it church_backend npm run seed

# Local development
cd backend
npm run seed
```

## API Documentation

The backend API is available at `http://localhost:5000/api/v1`

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /public/homepage` | Homepage data |
| `GET /events` | List events |
| `GET /sermons` | List sermons |
| `GET /ministries` | List ministries |
| `GET /users/me` | Current user (auth) |

See [backend/README.md](./backend/README.md) for full API documentation.

## Useful Commands

```bash
# Check running containers
docker ps

# Check container resource usage
docker stats

# Clean up unused Docker resources
docker system prune -a

# Reset database (delete volumes)
docker-compose down -v

# Access container shell
docker exec -it church_backend sh
docker exec -it church_frontend sh

# Copy files from container
docker cp church_backend:/app/logs ./logs
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# View MongoDB logs
docker logs church_mongodb

# Test connection
docker exec -it church_mongodb mongosh --eval "db.adminCommand('ping')"
```

### Backend Issues
```bash
# View backend logs
docker logs church_backend -f

# Restart backend
docker-compose restart backend
```

### Frontend Issues
```bash
# View frontend logs
docker logs church_frontend -f

# Rebuild frontend
docker-compose up -d --build frontend
```

### Auth0 Issues

**Error: "Invalid audience"**
- You need to create an API in Auth0 (Applications > APIs)
- The `AUTH0_AUDIENCE` must match the API Identifier exactly

**Error: "Callback URL mismatch"**
- Add `http://localhost:3000` and `http://localhost:3000/callback` to Allowed Callback URLs
- Check for typos or trailing slashes

**Error: "Not authorized" or CORS errors**
- Add `http://localhost:3000` to Allowed Web Origins
- Add `http://localhost:3000` to Allowed Origins (CORS)
- Restart Docker containers after changing `.env`:
  ```bash
  docker-compose down && docker-compose up -d
  ```

**Error: "Missing AUTH0_AUDIENCE"**
- Create an API in Auth0 Dashboard (Applications > APIs)
- Copy the Identifier value to `AUTH0_AUDIENCE` in `.env`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Private - All rights reserved
