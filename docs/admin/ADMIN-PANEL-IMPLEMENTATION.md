# Admin Panel Implementation Plan

This document outlines the plan for implementing a comprehensive Admin Panel for the church platform, including Auth0 role/permission configuration.

---

## Table of Contents

1. [Current State](#current-state)
2. [Auth0 RBAC Configuration](#auth0-rbac-configuration)
3. [Admin Panel Architecture](#admin-panel-architecture)
4. [Implementation Phases](#implementation-phases)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [External APIs](#external-apis)

---

## Current State

### Backend (Already Implemented)
The backend already has protected admin routes:

| Resource | Create | Update | Delete | Required Role |
|----------|--------|--------|--------|---------------|
| Churches | ✅ | ✅ | ✅ | `system_admin` |
| Events | ✅ | ✅ | ✅ | `admin`, `staff` |
| Sermons | ✅ | ✅ | ✅ | `admin`, `staff`, `pastor` |
| Ministries | ✅ | ✅ | ✅ | `admin` |
| Questions | ✅ | ✅ | ✅ | `system_admin` |
| Users | ✅ | ✅ | ✅ | `admin` |

### Frontend (Missing)
- No admin panel UI exists
- No role-based navigation
- No admin dashboard

### Role Hierarchy
```
system_admin     → Full system access (create churches, manage all)
  └── admin      → Church-level admin (manage church content)
        └── pastor   → Can manage sermons, events
        └── staff    → Can manage events
        └── leader   → Limited management
        └── member   → Read-only access
        └── visitor  → Public access only
```

---

## Auth0 RBAC Configuration

### Step 1: Enable RBAC in Auth0

1. Go to **Auth0 Dashboard → Applications → APIs → Church API**
2. In the **Settings** tab:
   - Enable **RBAC** (Role-Based Access Control)
   - Enable **Add Permissions in the Access Token**

### Step 2: Create Roles in Auth0

Go to **User Management → Roles** and create these roles:

| Role | Description |
|------|-------------|
| `system_admin` | Full system administrator - can manage all churches |
| `admin` | Church administrator - can manage their church content |
| `pastor` | Pastor - can manage sermons and some events |
| `staff` | Staff member - can manage events |
| `leader` | Ministry leader - limited access |
| `member` | Church member - read access |

### Step 3: Create an Auth0 Action to Add Roles to Token

Go to **Actions → Library → Build Custom** and create:

**Name:** `Add Roles to Token`
**Trigger:** `Login / Post Login`

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = `https://${event.secrets.AUTH0_DOMAIN}/roles`;

  if (event.authorization) {
    // Get user roles from Auth0
    const roles = event.authorization.roles || [];

    // Add roles to the access token
    api.accessToken.setCustomClaim(namespace, roles);

    // Also add to ID token for frontend use
    api.idToken.setCustomClaim(namespace, roles);
  }
};
```

**Add Secret:**
- Key: `AUTH0_DOMAIN`
- Value: Your Auth0 domain (e.g., `dev-xxxxx.us.auth0.com`)

### Step 4: Deploy the Action

1. Click **Deploy**
2. Go to **Actions → Flows → Login**
3. Drag your action into the flow between Start and Complete
4. Click **Apply**

### Step 5: Assign Roles to Users

1. Go to **User Management → Users**
2. Click on a user
3. Go to the **Roles** tab
4. Click **Assign Roles**
5. Select the appropriate role(s)

### Verification

After login, decode the JWT token at [jwt.io](https://jwt.io) to verify roles appear:

```json
{
  "https://dev-xxxxx.us.auth0.com/roles": ["system_admin"],
  "iss": "https://dev-xxxxx.us.auth0.com/",
  "sub": "auth0|...",
  "aud": ["https://church-api"],
  ...
}
```

---

## Admin Panel Architecture

### Folder Structure

```
frontend/src/
├── components/
│   ├── admin/                    # Admin components
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx   # Admin shell with sidebar
│   │   │   ├── AdminSidebar.jsx  # Navigation sidebar
│   │   │   └── AdminHeader.jsx   # Top header with user info
│   │   ├── dashboard/
│   │   │   └── AdminDashboard.jsx
│   │   ├── churches/
│   │   │   ├── ChurchList.jsx
│   │   │   ├── ChurchForm.jsx
│   │   │   └── ChurchDetail.jsx
│   │   ├── events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventForm.jsx
│   │   │   └── EventCalendar.jsx
│   │   ├── sermons/
│   │   │   ├── SermonList.jsx
│   │   │   └── SermonForm.jsx
│   │   ├── ministries/
│   │   │   ├── MinistryList.jsx
│   │   │   └── MinistryForm.jsx
│   │   ├── questions/
│   │   │   ├── QuestionList.jsx
│   │   │   ├── QuestionForm.jsx
│   │   │   └── CategoryManager.jsx
│   │   ├── users/
│   │   │   ├── UserList.jsx
│   │   │   └── UserDetail.jsx
│   │   └── common/
│   │       ├── DataTable.jsx     # Reusable data table
│   │       ├── FormDialog.jsx    # Reusable form dialog
│   │       └── ConfirmDialog.jsx # Delete confirmation
│   ├── pages/
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       ├── AdminChurchesPage.jsx
│   │       ├── AdminEventsPage.jsx
│   │       ├── AdminSermonsPage.jsx
│   │       ├── AdminMinistriesPage.jsx
│   │       ├── AdminQuestionsPage.jsx
│   │       └── AdminUsersPage.jsx
├── hooks/
│   ├── useAuth.js               # Existing - add role helpers
│   └── usePermissions.js        # New - role/permission checks
├── guards/
│   └── AdminRoute.jsx           # Route guard for admin pages
└── services/
    └── adminApi.js              # Admin-specific API calls
```

### Route Structure

```jsx
// Admin Routes (protected)
/admin                    → Dashboard
/admin/churches           → Church management (system_admin only)
/admin/churches/new       → Create church
/admin/churches/:id       → Edit church
/admin/events             → Event management
/admin/events/new         → Create event
/admin/events/:id         → Edit event
/admin/sermons            → Sermon management
/admin/sermons/new        → Create sermon
/admin/sermons/:id        → Edit sermon
/admin/ministries         → Ministry management
/admin/questions          → Questionnaire builder (system_admin)
/admin/users              → User management
```

---

## Implementation Phases

### Phase 1: Auth0 & Permissions Setup (Day 1)

**Tasks:**
1. Configure Auth0 RBAC (see section above)
2. Create Auth0 Action to include roles in token
3. Create test users with different roles
4. Update frontend `useAuth` hook to expose roles

**Files to create/modify:**
- `frontend/src/hooks/usePermissions.js`
- `frontend/src/guards/AdminRoute.jsx`
- Modify `frontend/src/hooks/useAuth.js`

### Phase 2: Admin Layout & Dashboard (Day 2)

**Tasks:**
1. Create AdminLayout with sidebar navigation
2. Create AdminDashboard with statistics
3. Add admin routes to App.jsx
4. Create role-based menu items

**Files to create:**
- `frontend/src/components/admin/layout/AdminLayout.jsx`
- `frontend/src/components/admin/layout/AdminSidebar.jsx`
- `frontend/src/components/admin/dashboard/AdminDashboard.jsx`
- `frontend/src/components/pages/admin/AdminDashboardPage.jsx`

### Phase 3: Church Management (Day 3-4)

**Tasks:**
1. Create church list with data table
2. Create church form with country/department selectors
3. Integrate RestCountries API for country data
4. Add image upload for logo/cover

**External API:**
```
GET https://restcountries.com/v3.1/all?fields=name,cca2,region,subregion
```

**Files to create:**
- `frontend/src/components/admin/churches/ChurchList.jsx`
- `frontend/src/components/admin/churches/ChurchForm.jsx`
- `frontend/src/services/countriesApi.js`

### Phase 4: Event Management (Day 5)

**Tasks:**
1. Event list with filters (date, status, type)
2. Event form with date picker, recurring options
3. Event calendar view (optional)

**Files to create:**
- `frontend/src/components/admin/events/EventList.jsx`
- `frontend/src/components/admin/events/EventForm.jsx`

### Phase 5: Sermon Management (Day 6)

**Tasks:**
1. Sermon list with search and filters
2. Sermon form with speaker selector, media upload
3. Series management

**Files to create:**
- `frontend/src/components/admin/sermons/SermonList.jsx`
- `frontend/src/components/admin/sermons/SermonForm.jsx`

### Phase 6: Ministry & Questions (Day 7)

**Tasks:**
1. Ministry CRUD
2. Question builder with drag-and-drop ordering
3. Category management

**Files to create:**
- `frontend/src/components/admin/ministries/MinistryList.jsx`
- `frontend/src/components/admin/questions/QuestionBuilder.jsx`

### Phase 7: User Management (Day 8)

**Tasks:**
1. User list with role filters
2. User detail with membership info
3. Role assignment (frontend only - backend exists)

---

## API Endpoints Reference

### Churches (system_admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/churches` | List all churches |
| POST | `/api/v1/churches` | Create church |
| PUT | `/api/v1/churches/:id` | Update church |
| DELETE | `/api/v1/churches/:id` | Delete church |
| POST | `/api/v1/churches/:id/logo` | Upload logo |
| POST | `/api/v1/churches/:id/cover` | Upload cover image |

### Events (admin, staff)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | List events |
| POST | `/api/v1/events` | Create event |
| PUT | `/api/v1/events/:id` | Update event |
| DELETE | `/api/v1/events/:id` | Delete event |

### Sermons (admin, staff, pastor)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/sermons` | List sermons |
| POST | `/api/v1/sermons` | Create sermon |
| PUT | `/api/v1/sermons/:id` | Update sermon |
| DELETE | `/api/v1/sermons/:id` | Delete sermon |

### Ministries (admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ministries` | List ministries |
| POST | `/api/v1/ministries` | Create ministry |
| PUT | `/api/v1/ministries/:id` | Update ministry |
| DELETE | `/api/v1/ministries/:id` | Delete ministry |

### Questions (system_admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/questions` | List questions |
| POST | `/api/v1/questions` | Create question |
| PUT | `/api/v1/questions/:id` | Update question |
| DELETE | `/api/v1/questions/:id` | Delete question |
| GET | `/api/v1/questions/categories` | List categories |
| POST | `/api/v1/questions/categories` | Create category |
| PUT | `/api/v1/questions/categories/:id` | Update category |
| DELETE | `/api/v1/questions/categories/:id` | Delete category |

### Users (admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List users |
| GET | `/api/v1/users/:id` | Get user detail |
| PUT | `/api/v1/users/:id` | Update user |
| DELETE | `/api/v1/users/:id` | Delete user |

---

## External APIs

### Countries API (RestCountries)

**Purpose:** Get list of countries for church creation form

**Endpoint:**
```
GET https://restcountries.com/v3.1/all?fields=name,cca2,region,subregion
```

**Response Example:**
```json
[
  {
    "name": {
      "common": "Bolivia",
      "official": "Plurinational State of Bolivia"
    },
    "cca2": "BO",
    "region": "Americas",
    "subregion": "South America"
  }
]
```

**Usage in App:**
```javascript
// frontend/src/services/countriesApi.js
export const getCountries = async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,cca2,region,subregion'
  );
  const data = await response.json();

  // Sort by name and format
  return data
    .map(country => ({
      code: country.cca2,
      name: country.name.common,
      region: country.region,
      subregion: country.subregion
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Filter for South America (where most churches are)
export const getSouthAmericanCountries = async () => {
  const countries = await getCountries();
  return countries.filter(c => c.subregion === 'South America');
};
```

### GeoNames API (Optional - for Departments/States)

**Purpose:** Get administrative divisions (states/departments) for a country

**Endpoint:**
```
GET http://api.geonames.org/childrenJSON?geonameId={countryId}&username={username}
```

**Note:** Requires free account at geonames.org

---

## Quick Start Checklist

### Auth0 Setup (Do First!)

- [ ] Enable RBAC in API settings
- [ ] Create roles: `system_admin`, `admin`, `pastor`, `staff`, `leader`, `member`
- [ ] Create Auth0 Action to add roles to token
- [ ] Deploy action to Login flow
- [ ] Create test user with `system_admin` role
- [ ] Verify roles appear in JWT token

### Frontend Implementation

- [ ] Create `usePermissions` hook
- [ ] Create `AdminRoute` guard
- [ ] Create `AdminLayout` component
- [ ] Create `AdminDashboard`
- [ ] Add `/admin` routes
- [ ] Implement each admin module

### Testing

- [ ] Test login with different roles
- [ ] Verify role-based menu visibility
- [ ] Test CRUD operations
- [ ] Test unauthorized access handling

---

## Security Notes

1. **Never trust frontend roles alone** - Always verify on backend
2. **Backend already validates roles** - Frontend is for UX only
3. **Sensitive operations** - Use confirmation dialogs
4. **Audit logging** - Consider adding for admin actions
5. **Rate limiting** - Already configured in backend

---

## Next Steps

1. **Configure Auth0** following the instructions above
2. **Assign yourself `system_admin` role** in Auth0
3. **Start Phase 1** implementation
4. **Test with multiple users** having different roles

For questions about specific implementations, refer to existing code:
- Backend routes: `backend/src/routes/`
- Auth middleware: `backend/src/config/auth0.js`
- Permission middleware: `backend/src/middlewares/churchPermissions.js`
