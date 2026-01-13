# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cristo Es La Respuesta** - A multi-church platform for a church network with locations across Bolivia and other South American countries. The system supports multiple churches with hierarchical relationships (headquarters → country → department → province → local).

## Development Commands

### Backend (from `/backend`)
```bash
npm run dev          # Start with nodemon (hot reload)
npm run seed         # Seed all data (churches, users, events, sermons)
npm run seed:users   # Seed only users
npm test             # Run Jest tests
npm run lint         # ESLint
```

### Frontend (from `/frontend`)
```bash
npm run dev          # Vite dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint
```

### Docker (from root)
```bash
docker-compose up -d                    # Start all services
docker-compose up -d backend mongodb    # Start specific services
docker exec -it church_backend npm run seed  # Seed via Docker
docker-compose down -v                  # Stop and remove volumes
```

## Architecture

### Backend (Node.js/Express)
- **Pattern**: Controller → Service → Model (3-layer)
- **Auth**: Auth0 JWT via `express-oauth2-jwt-bearer`
- **Validation**: `express-validator` in route files
- **Response format**: All responses via `helpers/responseHandler.js`
- **Error handling**: Custom errors in `commons/errors.js`, caught by `middlewares/errorHandler.js`
- **File uploads**: Multer (local) + Cloudinary (cloud storage)

### Frontend (React/Vite)
- **UI**: Material-UI v5 with custom theme (`src/theme/index.js`)
- **i18n**: `react-i18next` with 3 languages (ES/EN/PT) in `src/locales/`
- **Auth**: `@auth0/auth0-react` with custom `useAuth` hook
- **API**: Axios instance in `services/api.js`

### Multi-Church System
Churches have hierarchical levels: `headquarters` → `country` → `department` → `province` → `local`

Key models with `church` reference:
- `Church` - Core model with hierarchy, location, leadership
- `User` - Has `churchMemberships[]` with per-church roles
- `Event`, `Sermon`, `Ministry` - All scoped to a church with visibility levels

Church-specific roles: `admin`, `pastor`, `leader`, `member`, `visitor`
System-wide roles: `system_admin`, `user`

## Key Patterns

### Adding a New API Endpoint
1. Add validator in `routes/{resource}Routes.js`
2. Create controller method in `controllers/{resource}Controller.js`
3. Add business logic in `services/{resource}Service.js`
4. Register route in `routes/index.js` if new resource

### Adding Translations
Add keys to all 3 locale files: `frontend/src/locales/{es,en,pt}/common.json`

### Cloudinary Uploads
Use helper: `const { uploadImage } = require('../helpers/cloudinary')`
```javascript
const result = await uploadImage(buffer, { folder: 'churches/logos', width: 400 });
```

## Important Files

- `docs/features/MULTI-CHURCH-SYSTEM-ENHANCED.md` - Full implementation plan
- `backend/src/commons/constants.js` - All enums and constants
- `frontend/src/locales/` - Translation files (ES/EN/PT)
- `backend/.env.example` - Required environment variables

## Current Status
- Sprint 0: ✅ Complete (Migration Preparation)
- Sprint 1: ✅ Complete (Foundation + i18n)
- Sprint 2: ✅ Complete (Church Navigation)
- Sprint 3: ✅ Complete (Existing Code Migration)
- Sprint 4: ✅ Complete (Content & Doctrine)
- Sprint 5: ✅ Complete (Permissions + Multi-Admin)
- Sprint 6: 🔄 Next (Profile & Dashboard)
- Sprint 7-8: See `docs/features/MULTI-CHURCH-SYSTEM-ENHANCED.md`