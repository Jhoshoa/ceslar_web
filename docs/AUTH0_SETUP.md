# Auth0 Configuration Guide

This guide explains how to configure Auth0 for the Church Website application.

## Overview

Auth0 requires two components:
1. **Application** - For frontend authentication (login/logout)
2. **API** - For backend authorization (protecting API endpoints)

---

## Step 1: Create an Auth0 Account

1. Go to [https://auth0.com](https://auth0.com)
2. Sign up for a free account
3. Create a new tenant (or use the default one)

---

## Step 2: Create an Application

The Application handles user login/logout from the frontend.

1. In the Auth0 Dashboard, go to **Applications > Applications**
2. Click **+ Create Application**
3. Configure:
   - **Name:** `Church Website`
   - **Application Type:** `Single Page Application`
4. Click **Create**

### Application Settings

After creating the application, go to the **Settings** tab and configure:

#### Basic Information
- **Domain:** Copy this value → `AUTH0_DOMAIN` in your `.env`
- **Client ID:** Copy this value → `AUTH0_CLIENT_ID` in your `.env`
- **Client Secret:** Copy this value → `AUTH0_CLIENT_SECRET` in your `.env`

#### Application URIs

Configure these URLs for **Local Development** and **Docker**:

| Setting | Value |
|---------|-------|
| **Application Login URI** | *(leave empty)* |
| **Allowed Callback URLs** | `http://localhost:3000, http://localhost:3000/callback` |
| **Allowed Logout URLs** | `http://localhost:3000` |
| **Allowed Web Origins** | `http://localhost:3000` |
| **Allowed Origins (CORS)** | `http://localhost:3000` |

> **Note:** For production, add your production URLs (e.g., `https://yourdomain.com`)

#### Example with Multiple Environments

If you have multiple environments, separate URLs with commas:

```
Allowed Callback URLs:
http://localhost:3000, http://localhost:3000/callback, https://yourdomain.com, https://yourdomain.com/callback

Allowed Logout URLs:
http://localhost:3000, https://yourdomain.com

Allowed Web Origins:
http://localhost:3000, https://yourdomain.com
```

5. Scroll down and click **Save Changes**

---

## Step 3: Create an API

The API is what generates the `AUTH0_AUDIENCE` value. It protects your backend endpoints.

1. In the Auth0 Dashboard, go to **Applications > APIs**
2. Click **+ Create API**
3. Configure:
   - **Name:** `Church API`
   - **Identifier:** `https://church-api` (this becomes your `AUTH0_AUDIENCE`)
   - **Signing Algorithm:** `RS256`
4. Click **Create**

### API Settings

After creating the API:

1. Go to the **Settings** tab
2. Note the **Identifier** - this is your `AUTH0_AUDIENCE`
3. Ensure **Enable RBAC** is ON (if you want role-based access)
4. Ensure **Add Permissions in the Access Token** is ON

### Copy the Audience Value

The **Identifier** you set (e.g., `https://church-api`) is your `AUTH0_AUDIENCE`.

---

## Step 4: Configure Environment Variables

### For Docker Development

Edit your `.env` file in the project root:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
AUTH0_CLIENT_SECRET=your-client-secret-from-application-settings
AUTH0_AUDIENCE=https://church-api
```

### For Local Development

#### Backend (.env in /backend folder)
```env
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://church-api
AUTH0_CLIENT_ID=aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
AUTH0_CLIENT_SECRET=your-client-secret-from-application-settings
```

#### Frontend (.env in /frontend folder)
```env
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
VITE_AUTH0_AUDIENCE=https://church-api
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Step 5: Where to Find Each Value

| Variable | Where to Find It |
|----------|------------------|
| `AUTH0_DOMAIN` | Applications > Your App > Settings > Domain |
| `AUTH0_CLIENT_ID` | Applications > Your App > Settings > Client ID |
| `AUTH0_CLIENT_SECRET` | Applications > Your App > Settings > Client Secret |
| `AUTH0_AUDIENCE` | Applications > APIs > Your API > Identifier |

---

## Visual Guide

### Finding Application Settings
```
Auth0 Dashboard
└── Applications
    └── Applications
        └── Church Website (your app)
            └── Settings tab
                ├── Domain ──────────────► AUTH0_DOMAIN
                ├── Client ID ───────────► AUTH0_CLIENT_ID
                └── Client Secret ───────► AUTH0_CLIENT_SECRET
```

### Finding API Audience
```
Auth0 Dashboard
└── Applications
    └── APIs
        └── Church API (your api)
            └── Settings tab
                └── Identifier ──────────► AUTH0_AUDIENCE
```

---

## Complete Auth0 Application Settings Screenshot Reference

```
┌─────────────────────────────────────────────────────────────────┐
│ Application Settings                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Basic Information                                                │
│ ─────────────────                                                │
│ Name:          Church Website                                    │
│ Domain:        your-tenant.us.auth0.com     ← Copy this          │
│ Client ID:     aBcDeFgHiJkLmNoPqRsTuVwXyZ   ← Copy this          │
│ Client Secret: ********************************  ← Copy this     │
│                                                                  │
│ Application URIs                                                 │
│ ────────────────                                                 │
│ Application Login URI:    [empty]                                │
│                                                                  │
│ Allowed Callback URLs:                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ http://localhost:3000, http://localhost:3000/callback       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Allowed Logout URLs:                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ http://localhost:3000                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Allowed Web Origins:                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ http://localhost:3000                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Cross-Origin Authentication                                      │
│ ───────────────────────────                                      │
│ Allowed Origins (CORS):                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ http://localhost:3000                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                                        [ Save Changes ]          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Error: "Invalid audience"
- Make sure you created an API in Auth0 (not just an Application)
- Verify the `AUTH0_AUDIENCE` matches exactly the API Identifier

### Error: "Callback URL mismatch"
- Check that `http://localhost:3000` is in your Allowed Callback URLs
- Make sure there are no trailing slashes or typos

### Error: "Not authorized" / CORS errors
- Add `http://localhost:3000` to Allowed Web Origins
- Add `http://localhost:3000` to Allowed Origins (CORS)

### Error: "Login popup blocked"
- Ensure `http://localhost:3000` is in Allowed Web Origins

### Docker-specific issues
- Both Docker and local development use the same URLs (`localhost:3000`)
- The frontend container maps port 3000 to host port 3000

---

## Production Configuration

When deploying to production, update Auth0 settings:

1. Add your production URLs to all fields:
   ```
   Allowed Callback URLs:
   http://localhost:3000, https://yourdomain.com, https://yourdomain.com/callback

   Allowed Logout URLs:
   http://localhost:3000, https://yourdomain.com

   Allowed Web Origins:
   http://localhost:3000, https://yourdomain.com

   Allowed Origins (CORS):
   http://localhost:3000, https://yourdomain.com
   ```

2. Update your production `.env`:
   ```env
   FRONTEND_URL=https://yourdomain.com
   API_URL=https://api.yourdomain.com/api/v1
   ```

---

## Quick Checklist

- [ ] Created Auth0 account
- [ ] Created Application (Single Page Application)
- [ ] Created API (to get the Audience)
- [ ] Configured Application URIs:
  - [ ] Allowed Callback URLs: `http://localhost:3000, http://localhost:3000/callback`
  - [ ] Allowed Logout URLs: `http://localhost:3000`
  - [ ] Allowed Web Origins: `http://localhost:3000`
  - [ ] Allowed Origins (CORS): `http://localhost:3000`
- [ ] Copied values to `.env`:
  - [ ] AUTH0_DOMAIN
  - [ ] AUTH0_CLIENT_ID
  - [ ] AUTH0_CLIENT_SECRET
  - [ ] AUTH0_AUDIENCE
- [ ] Restarted Docker containers after updating `.env`
