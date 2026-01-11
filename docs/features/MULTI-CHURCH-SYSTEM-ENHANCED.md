# Multi-Church System - Enhanced Plan

> This document extends [MULTI-CHURCH-SYSTEM.md](./MULTI-CHURCH-SYSTEM.md) with clarified requirements and content from the legacy website.

---

## Clarified Requirements

| Question | Answer | Impact |
|----------|--------|--------|
| Users belong to multiple churches? | **YES** | User can have memberships in multiple churches with different roles |
| Multiple pastors/admins per church? | **YES** | Array of admins/pastors per church |
| Events shareable between churches? | **YES** | Events can be linked to multiple churches |
| Email notifications? | **YES** | Implement notification service |
| Different questionnaire per church? | **YES** | Questions can be global or church-specific |
| Offline support? | **YES** | PWA with service workers |
| Languages? | **ES, PT, EN** | Full i18n implementation |

---

## Church Navigation System

### Cascading Dropdown Structure

```
┌─────────────────────────────────────────────────────┐
│  🌍 Country          │ 📍 Department    │ ⛪ Church │
├─────────────────────────────────────────────────────┤
│  [Bolivia       ▼]   │ [Santa Cruz  ▼]  │ [Sede Central ▼] │
│  ├─ Argentina        │ ├─ Cochabamba    │ ├─ Iglesia Plan 3000 │
│  ├─ Brasil           │ ├─ La Paz        │ ├─ Iglesia Montero   │
│  ├─ Chile            │ ├─ Tarija        │ └─ ...               │
│  ├─ Paraguay         │ └─ ...           │                      │
│  └─ Perú             │                  │                      │
└─────────────────────────────────────────────────────┘
```

### URL Structure

```
/churches                           # All countries
/churches/bolivia                   # Bolivia departments
/churches/bolivia/santa-cruz        # Santa Cruz churches
/churches/bolivia/santa-cruz/sede-central  # Specific church
```

---

## Content from Legacy Website

### Church History (For "About Us" Page)

**Key Dates:**
- **September 18, 1969** - Founders arrived in Santa Cruz de la Sierra, Bolivia
- **Started in** - Neighborhood "El Lazareto"
- **September 24, 1969** - Santa Cruz headquarters established
- **October 14, 1972** - Cochabamba church founded
- **1976-1979** - Period of persecution, founder temporarily exiled
- **September 8, 1978** - Legal recognition (Supreme Resolution No. 188425)
- **October 21, 2002** - Buenos Aires, Argentina church established

**Expansion:**
- Bolivia (headquarters)
- Peru
- Brazil
- Chile
- Argentina
- Paraguay

### Doctrine / Core Beliefs

```javascript
const DOCTRINE = {
  beliefs: [
    {
      title: "La Trinidad",
      titleEn: "The Trinity",
      titlePt: "A Trindade",
      description: "Dios es uno en tres manifestaciones",
      descriptionEn: "God is one in three manifestations",
      descriptionPt: "Deus é um em três manifestações"
    },
    {
      title: "Salvación",
      titleEn: "Salvation",
      titlePt: "Salvação",
      description: "Por fe personal en Jesucristo únicamente"
    },
    {
      title: "Sanidad Divina",
      titleEn: "Divine Healing",
      titlePt: "Cura Divina",
      description: "A través de la promesa de Dios"
    },
    {
      title: "Bautismo",
      titleEn: "Baptism",
      titlePt: "Batismo",
      description: "Confesión de fe en el nombre de Cristo"
    },
    {
      title: "Predestinación",
      titleEn: "Predestination",
      titlePt: "Predestinação",
      description: "Elección por la soberanía de Dios"
    },
    {
      title: "Segunda Venida",
      titleEn: "Second Coming",
      titlePt: "Segunda Vinda",
      description: "Retorno físico de Cristo y el rapto"
    },
    {
      title: "Reino Milenial",
      titleEn: "Millennial Kingdom",
      titlePt: "Reino Milenar",
      description: "Gobierno teocrático futuro"
    }
  ],
  principles: [
    "Libre albedrío",
    "Libertad religiosa",
    "Avance científico como don de Dios",
    "Derecho a educación y empleo sin discriminación",
    "Respeto a la autoridad gubernamental"
  ],
  legalRecognition: {
    resolution: "No. 188425",
    date: "1978-09-08",
    ministry: "Ministerio de Relaciones Exteriores de Bolivia"
  }
};
```

### Known Church Locations (Seed Data)

```javascript
const SEED_CHURCHES = [
  // BOLIVIA
  {
    name: "Sede Central Internacional",
    country: "Bolivia",
    department: "Santa Cruz",
    city: "Santa Cruz de la Sierra",
    address: "Calle Chesterton esquina Walt Whitman, Barrio Los Tusequis",
    phone: "(591) 3-3424802",
    foundedDate: "1969-09-24",
    level: "headquarters",
    isHeadquarters: true
  },
  {
    name: "Iglesia de Cochabamba",
    country: "Bolivia",
    department: "Cochabamba",
    city: "Cochabamba",
    address: "Av. Barrancas, entre Jose María Valda y Dionisio Bobadilla",
    foundedDate: "1972-10-14",
    level: "department"
  },
  {
    name: "Iglesia de La Paz",
    country: "Bolivia",
    department: "La Paz",
    city: "La Paz",
    address: "Villa Adela, cerca de Av. Circunvalación",
    level: "department"
  },
  // ARGENTINA
  {
    name: "Iglesia de Buenos Aires",
    country: "Argentina",
    department: "Buenos Aires",
    city: "Buenos Aires",
    address: "Calle Chañar, entre Arenales y Rio Negro",
    phone: "+549 11 31415153",
    foundedDate: "2002-10-21",
    level: "department"
  },
  {
    name: "Iglesia de Embarcación",
    country: "Argentina",
    department: "Salta",
    city: "Embarcación",
    address: "Calle Santos Vega, entre Pasaje 1 y Pasaje 2",
    level: "province"
  }
];
```

### Sermon Archive Structure

```javascript
const SERMON_SERIES = [
  {
    title: "Un Pueblo Escogido, Un Sacerdocio Real",
    titleEn: "A Chosen People, A Royal Priesthood",
    speaker: "Rev. Julio Alvarado F.",
    parts: 11, // Parts 8-11 from September 1980
    location: "Santa Cruz, Bolivia"
  },
  {
    title: "La Puerta",
    titleEn: "The Door",
    parts: 2
  }
];

const MEDIA_TYPES = ['written', 'audio', 'video'];
```

---

## Enhanced Data Models

### Updated Church Model

```javascript
// Added fields for multi-admin and enhanced info
Church {
  // ... previous fields ...

  // Multiple admins/pastors
  leadership: [{
    user: ObjectId (ref: User),
    role: Enum ['senior_pastor', 'pastor', 'elder', 'deacon', 'admin'],
    title: String, // Custom title
    isPrimary: Boolean,
    assignedAt: Date,
    assignedBy: ObjectId
  }],

  // Founding info
  foundedDate: Date,
  foundedBy: String,
  history: {
    es: String,
    en: String,
    pt: String
  },

  // Enhanced hierarchy
  isHeadquarters: Boolean,
  region: String, // For grouping (e.g., "South America")
}
```

### Updated Event Model (Shareable)

```javascript
Event {
  // ... previous fields ...

  // Multi-church support
  churches: [ObjectId], // Can belong to multiple churches
  visibility: Enum ['single_church', 'department', 'country', 'global'],

  // Recurrence
  isRecurring: Boolean,
  recurrenceRule: String, // iCal RRULE format

  // RSVP
  rsvpEnabled: Boolean,
  rsvpLimit: Number,
  rsvps: [{
    user: ObjectId,
    status: Enum ['attending', 'maybe', 'declined'],
    guests: Number,
    respondedAt: Date
  }]
}
```

### Updated Question Model (Per-Church)

```javascript
Question {
  // ... previous fields ...

  // Church-specific or global
  scope: Enum ['global', 'church_specific'],
  churches: [ObjectId], // If church_specific, which churches

  // Translations
  questionText: {
    es: String,
    en: String,
    pt: String
  },
  options: [{
    value: String,
    labels: {
      es: String,
      en: String,
      pt: String
    }
  }],
  placeholder: {
    es: String,
    en: String,
    pt: String
  },
  helpText: {
    es: String,
    en: String,
    pt: String
  }
}
```

---

## Internationalization (i18n)

### Supported Languages

| Code | Language | Primary Region |
|------|----------|----------------|
| `es` | Español (Spanish) | Bolivia, Argentina, Chile, Paraguay, Peru |
| `pt` | Português (Portuguese) | Brazil |
| `en` | English | International |

### Implementation Strategy

**Frontend (React):**
- Use `react-i18next` library
- Language detection: Browser preference → User setting → Default (es)
- Store preference in localStorage and user profile

**Backend:**
- Accept `Accept-Language` header
- Store translatable content as objects with language keys
- API responses respect requested language

### Translation File Structure

```
frontend/
  src/
    locales/
      es/
        common.json      # Shared translations
        home.json        # Homepage
        churches.json    # Church pages
        auth.json        # Authentication
        admin.json       # Admin panel
        doctrine.json    # Doctrine content
      en/
        ...
      pt/
        ...
```

### Example Translation Keys

```json
// es/common.json
{
  "nav": {
    "home": "Inicio",
    "about": "Quiénes Somos",
    "churches": "Iglesias",
    "sermons": "Mensajes",
    "events": "Eventos",
    "contact": "Contacto",
    "login": "Iniciar Sesión",
    "logout": "Cerrar Sesión"
  },
  "churchFinder": {
    "title": "Encuentra tu Iglesia",
    "selectCountry": "Seleccionar País",
    "selectDepartment": "Seleccionar Departamento",
    "selectChurch": "Seleccionar Iglesia",
    "viewAll": "Ver Todas",
    "nearMe": "Cerca de Mí"
  },
  "schedule": {
    "sunday": "Domingo",
    "monday": "Lunes",
    "tuesday": "Martes",
    "wednesday": "Miércoles",
    "thursday": "Jueves",
    "friday": "Viernes",
    "saturday": "Sábado",
    "morning": "Mañana",
    "evening": "Noche"
  }
}
```

```json
// en/common.json
{
  "nav": {
    "home": "Home",
    "about": "About Us",
    "churches": "Churches",
    "sermons": "Messages",
    "events": "Events",
    "contact": "Contact",
    "login": "Sign In",
    "logout": "Sign Out"
  },
  "churchFinder": {
    "title": "Find Your Church",
    "selectCountry": "Select Country",
    "selectDepartment": "Select Department/State",
    "selectChurch": "Select Church",
    "viewAll": "View All",
    "nearMe": "Near Me"
  }
}
```

---

## Offline Support (PWA)

### Service Worker Strategy

```javascript
// Cache strategies by content type
const CACHE_STRATEGIES = {
  // Static assets - Cache First
  static: ['*.js', '*.css', '*.woff2', '/images/*'],

  // API data - Network First with Cache Fallback
  api: ['/api/churches', '/api/doctrine', '/api/events'],

  // User content - Network Only (except saved)
  userContent: ['/api/user/*'],

  // Media - Cache with expiration
  media: ['/api/sermons/*', '/api/gallery/*']
};
```

### Offline Features

| Feature | Offline Behavior |
|---------|-----------------|
| Church list | Cached, available offline |
| Church details | Cached after first visit |
| Doctrine | Fully cached |
| Events | Cached, sync when online |
| Sermons (audio) | Download option for offline |
| User profile | Cached, sync when online |
| Forms | Queue submissions, sync later |

### PWA Manifest

```json
{
  "name": "Cristo Es La Respuesta",
  "short_name": "CELR",
  "description": "Iglesia Cristo Es La Respuesta - Red Mundial",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a365d",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Email Notification System

### Notification Types

| Event | Recipients | Template |
|-------|------------|----------|
| New member request | Church admins | `member-request` |
| Membership approved | User | `membership-approved` |
| Membership rejected | User | `membership-rejected` |
| New church registration | System admins | `church-registration` |
| Church approved | Church creator | `church-approved` |
| Event reminder | RSVP'd users | `event-reminder` |
| New sermon published | Church members | `new-sermon` |
| Role assignment | User | `role-assigned` |

### Email Service Configuration

```javascript
// backend/src/config/email.js
module.exports = {
  provider: 'nodemailer', // or 'sendgrid', 'ses'
  from: {
    name: 'Cristo Es La Respuesta',
    email: 'noreply@cristoeslarespuesta.org'
  },
  templates: {
    path: './src/templates/emails',
    engine: 'handlebars'
  },
  // Localized templates
  locales: ['es', 'en', 'pt'],
  defaultLocale: 'es'
};
```

### Template Structure

```
backend/
  src/
    templates/
      emails/
        es/
          member-request.hbs
          membership-approved.hbs
          ...
        en/
          ...
        pt/
          ...
        layouts/
          main.hbs
```

---

## Updated Frontend Pages

### Public Pages (With Navigation)

```
/                                    # Home - Hero, featured churches, recent sermons
  ├── Header with language switcher
  ├── Church Finder dropdown (Country → Dept → Church)
  └── Footer with social links

/about                               # History, mission, vision
/doctrine                            # Core beliefs (from legacy content)
/churches                            # Map + cascading list
/churches/:country                   # Country view
/churches/:country/:department       # Department view
/churches/:country/:dept/:slug       # Church detail
/sermons                             # Sermon archive
/sermons/:id                         # Sermon player
/events                              # Global events
/contact                             # Contact form
```

### Language Switcher Component

```jsx
// Appears in header
<LanguageSwitcher>
  <option value="es">🇪🇸 Español</option>
  <option value="en">🇺🇸 English</option>
  <option value="pt">🇧🇷 Português</option>
</LanguageSwitcher>
```

---

## Updated Implementation Order

### Sprint 1: Foundation + i18n
1. Set up `react-i18next` and translation files
2. Create language switcher component
3. Cloudinary integration
4. Church model with hierarchy
5. Basic seeder with known churches

### Sprint 2: Church Navigation
1. Cascading dropdown component
2. Country → Department → Church API
3. Church listing page with filters
4. Church detail page
5. Map integration (Leaflet)

### Sprint 3: Content Migration
1. Doctrine page with legacy content
2. Church history/about page
3. Sermon archive structure
4. Contact page with form

### Sprint 4: Permissions + Multi-Admin
1. Enhanced role system
2. Multiple leaders per church
3. Membership flow
4. Email notification service

### Sprint 5: Questionnaire System
1. Global + church-specific questions
2. Multilingual question builder
3. Registration flow with questionnaire
4. Answer management

### Sprint 6: PWA + Offline
1. Service worker setup
2. Offline caching strategies
3. PWA manifest
4. Install prompts

### Sprint 7: Events + Sharing
1. Multi-church events
2. RSVP system
3. Event visibility levels
4. Calendar views

### Sprint 8: Polish
1. Analytics dashboard
2. Search functionality
3. Mobile optimization
4. Performance tuning

---

## Social Media Integration

From legacy site:
- **YouTube:** CRISTOESLARESPUESTAOFICIAL
- **Facebook:** Multiple group pages
- **Zoom:** Virtual services
- **Blog:** difundiendolaverdad.blogspot.com
- **Email:** julianoscristoeslarespuesta@gmail.com

### Social Links Model

```javascript
socialMedia: {
  facebook: String,
  instagram: String,
  youtube: String,
  whatsapp: String,
  tiktok: String,
  twitter: String,
  blog: String,
  zoom: {
    meetingId: String,
    password: String,
    link: String
  }
}
```

---

---

## Migration & Compatibility (Existing Code Updates)

### Existing Models to Update

All existing models need a `church` reference to support multi-church functionality.

#### 1. User Model (`backend/src/models/User.js`)

**Current:** Single role, no church association
**Update Required:**

```javascript
// ADD these fields to User schema
{
  // Replace single role with church memberships
  // Keep 'role' for backwards compatibility but deprecate
  systemRole: {
    type: String,
    enum: ['system_admin', 'user'],
    default: 'user'
  },

  primaryChurch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  },

  churchMemberships: [{
    church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
    role: {
      type: String,
      enum: ['visitor', 'member', 'leader', 'pastor', 'admin'],
      default: 'visitor'
    },
    joinedAt: { type: Date, default: Date.now },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],

  // Registration questionnaire answers
  registrationAnswers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answer: mongoose.Schema.Types.Mixed,
    answeredAt: { type: Date, default: Date.now }
  }],
  registrationCompleted: { type: Boolean, default: false },

  // Language preference
  preferredLanguage: {
    type: String,
    enum: ['es', 'en', 'pt'],
    default: 'es'
  }
}
```

#### 2. Event Model (`backend/src/models/Event.js`)

**Current:** No church reference
**Update Required:**

```javascript
// ADD these fields
{
  // Single church or multiple (for shared events)
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    required: true,
    index: true
  },

  // For shared events across churches
  sharedWithChurches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  }],

  visibility: {
    type: String,
    enum: ['church_only', 'department', 'country', 'global'],
    default: 'church_only'
  }
}

// UPDATE indexes
eventSchema.index({ church: 1, startDate: 1, status: 1 });
```

#### 3. Sermon Model (`backend/src/models/Sermon.js`)

**Current:** No church reference
**Update Required:**

```javascript
// ADD these fields
{
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    required: true,
    index: true
  },

  // Visibility across church network
  visibility: {
    type: String,
    enum: ['church_only', 'network_wide'],
    default: 'network_wide' // Sermons typically shared
  }
}

// UPDATE indexes
sermonSchema.index({ church: 1, date: -1 });
```

#### 4. Ministry Model (`backend/src/models/Ministry.js`)

**Current:** Global ministries
**Update Required:**

```javascript
// ADD these fields
{
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    required: true,
    index: true
  },

  // Some ministries might be church-network-wide
  scope: {
    type: String,
    enum: ['local', 'department', 'country', 'global'],
    default: 'local'
  }
}
```

#### 5. SmallGroup Model (`backend/src/models/SmallGroup.js`)

**Current:** No church reference
**Update Required:**

```javascript
// ADD this field
{
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    required: true,
    index: true
  }
}
```

#### 6. PrayerRequest Model (`backend/src/models/PrayerRequest.js`)

**Current:** No church reference
**Update Required:**

```javascript
// ADD these fields
{
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    index: true
    // Not required - can be global prayer requests
  },

  // Share with prayer teams across churches
  sharedWithChurches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  }]
}
```

---

### Constants to Update (`backend/src/commons/constants.js`)

```javascript
// ADD new constants

// System-wide roles (not church-specific)
SYSTEM_ROLES: {
  SYSTEM_ADMIN: 'system_admin',
  USER: 'user'
},

// Church-specific roles
CHURCH_ROLES: {
  ADMIN: 'admin',
  PASTOR: 'pastor',
  LEADER: 'leader',
  MEMBER: 'member',
  VISITOR: 'visitor'
},

// Church hierarchy levels
CHURCH_LEVELS: {
  HEADQUARTERS: 'headquarters',
  COUNTRY: 'country',
  DEPARTMENT: 'department',
  PROVINCE: 'province',
  LOCAL: 'local'
},

// Membership status
MEMBERSHIP_STATUS: {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
},

// Church status
CHURCH_STATUS: {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
},

// Supported languages
LANGUAGES: {
  SPANISH: 'es',
  ENGLISH: 'en',
  PORTUGUESE: 'pt'
},

// Content visibility levels
VISIBILITY_LEVELS: {
  CHURCH_ONLY: 'church_only',
  DEPARTMENT: 'department',
  COUNTRY: 'country',
  GLOBAL: 'global'
},

// Question types for dynamic forms
QUESTION_TYPES: {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  NUMBER: 'number',
  EMAIL: 'email',
  PHONE: 'phone'
}
```

---

### Seeders to Update

#### New Seeder Order

```javascript
// backend/src/seeders/index.js - Updated order
await churchSeeder.seed();      // 1. Churches first (new)
await ministrySeeder.seed();    // 2. Ministries (updated)
await userSeeder.seed();        // 3. Users (updated)
await sermonSeeder.seed();      // 4. Sermons (updated)
await eventSeeder.seed();       // 5. Events (updated)
await questionSeeder.seed();    // 6. Questions (new)
```

#### New Seeder: `churchSeeder.js`

```javascript
// Seed known churches from legacy website
const churches = [
  {
    name: 'Sede Central Internacional',
    slug: 'sede-central',
    level: 'headquarters',
    country: 'Bolivia',
    department: 'Santa Cruz',
    city: 'Santa Cruz de la Sierra',
    address: 'Calle Chesterton esquina Walt Whitman, Barrio Los Tusequis',
    phone: '(591) 3-3424802',
    foundedDate: new Date('1969-09-24'),
    isHeadquarters: true,
    status: 'active'
  },
  {
    name: 'Iglesia de Cochabamba',
    slug: 'cochabamba',
    level: 'department',
    country: 'Bolivia',
    department: 'Cochabamba',
    city: 'Cochabamba',
    address: 'Av. Barrancas, entre Jose María Valda y Dionisio Bobadilla',
    foundedDate: new Date('1972-10-14'),
    status: 'active'
  },
  // ... more churches
];
```

#### Updated Seeders

Each existing seeder needs to:
1. Accept church ID as parameter
2. Associate content with the headquarters church by default
3. Create church-specific sample data

```javascript
// Example: eventSeeder.js update
const seedEvents = async (churchId) => {
  const events = [
    {
      title: 'Servicio Dominical',
      church: churchId,  // ADD church reference
      visibility: 'global',
      // ... rest of fields
    }
  ];
};
```

---

### API Routes to Update

#### Add Church Context Middleware

```javascript
// backend/src/middlewares/churchContext.js (new)
const getChurchContext = async (req, res, next) => {
  // Extract church from:
  // 1. URL param: /api/churches/:churchId/events
  // 2. Query param: /api/events?church=xxx
  // 3. User's primary church (for authenticated requests)

  const churchId = req.params.churchId || req.query.church;
  if (churchId) {
    req.churchContext = await Church.findById(churchId);
  }
  next();
};
```

#### Routes Updates Required

| Route File | Changes |
|------------|---------|
| `eventRoutes.js` | Add church filter, church-based permissions |
| `sermonRoutes.js` | Add church filter, visibility checks |
| `ministryRoutes.js` | Add church filter |
| `userRoutes.js` | Add membership management endpoints |
| `publicRoutes.js` | Add church navigation endpoints |

#### New Route Files Needed

```
backend/src/routes/
  ├── churchRoutes.js      # Church CRUD, hierarchy
  ├── membershipRoutes.js  # Join/approve/reject
  ├── questionRoutes.js    # Dynamic questionnaire
  └── mediaRoutes.js       # Cloudinary uploads
```

---

### Frontend Updates Required

#### Components to Update

| Component | Changes |
|-----------|---------|
| `Header.jsx` | Add language switcher, church selector dropdown |
| `Footer.jsx` | Add i18n, church-specific social links |
| `Layout.jsx` | Add i18n provider wrapper |
| `HomePage.jsx` | Add church finder section, i18n |
| `HeroSection.jsx` | i18n text |
| `UpcomingEvents.jsx` | Filter by church, i18n |
| `LatestSermon.jsx` | Filter by church, i18n |
| `MinistriesSection.jsx` | Filter by church, i18n |

#### New Components Needed

```
frontend/src/components/
  ├── common/
  │   ├── LanguageSwitcher.jsx
  │   └── ChurchSelector.jsx (cascading dropdown)
  ├── features/
  │   ├── churches/
  │   │   ├── ChurchFinder.jsx
  │   │   ├── ChurchCard.jsx
  │   │   ├── ChurchDetail.jsx
  │   │   └── ChurchMap.jsx
  │   ├── questionnaire/
  │   │   ├── QuestionnaireForm.jsx
  │   │   └── DynamicQuestion.jsx
  │   └── members/
  │       ├── MembershipRequest.jsx
  │       └── MemberList.jsx
  └── pages/
      ├── ChurchesPage.jsx
      ├── ChurchDetailPage.jsx
      ├── DoctrinePage.jsx
      ├── AboutPage.jsx
      └── RegisterPage.jsx (questionnaire)
```

#### Frontend Configuration Updates

```javascript
// frontend/src/commons/constants.js - ADD
export const LANGUAGES = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇺🇸' },
  pt: { name: 'Português', flag: '🇧🇷' }
};

export const DEFAULT_LANGUAGE = 'es';
```

---

### Database Migration Strategy

Since we're adding fields to existing models, we need a migration approach:

#### Option A: Soft Migration (Recommended for Development)

1. Add new fields with defaults
2. Make `church` field optional initially
3. Run migration script to assign existing data to headquarters church
4. Make `church` field required after migration

```javascript
// backend/src/migrations/001-add-church-references.js
const migrateToMultiChurch = async () => {
  // 1. Get headquarters church
  const hqChurch = await Church.findOne({ isHeadquarters: true });

  // 2. Update all existing records
  await Event.updateMany(
    { church: { $exists: false } },
    { $set: { church: hqChurch._id, visibility: 'global' } }
  );

  await Sermon.updateMany(
    { church: { $exists: false } },
    { $set: { church: hqChurch._id, visibility: 'network_wide' } }
  );

  // ... repeat for other models

  // 3. Migrate users
  await User.updateMany(
    { churchMemberships: { $exists: false } },
    {
      $set: {
        primaryChurch: hqChurch._id,
        churchMemberships: [{
          church: hqChurch._id,
          role: 'member', // or map from old 'role' field
          status: 'approved',
          joinedAt: new Date()
        }]
      }
    }
  );
};
```

---

### Updated Implementation Order (Revised Sprints)

### Sprint 0: Migration Preparation (NEW)
1. ✅ Update constants with new enums
2. ✅ Create Church model
3. ✅ Create churchSeeder with known churches
4. ✅ Write migration script for existing data
5. ✅ Update existing models (add church fields as optional)
6. ✅ Run migration on existing data

### Sprint 1: Foundation + i18n
1. Set up `react-i18next` and translation files
2. Create LanguageSwitcher component
3. Update Header with logo + language switcher
4. Update index.html with favicon
5. Set up Cloudinary config (backend)
6. Create church API endpoints (CRUD)

### Sprint 2: Church Navigation
1. Cascading dropdown component (Country → Dept → Church)
2. Church listing API with filters
3. ChurchesPage with list + map
4. ChurchDetailPage
5. Update HomePage with church finder

### Sprint 3: Existing Code Migration
1. Update Event routes/controllers for church context
2. Update Sermon routes/controllers for church context
3. Update Ministry routes/controllers for church context
4. Update frontend components with i18n
5. Test all existing functionality with church context

### Sprint 4: Content & Doctrine
1. Doctrine page with legacy content (multilingual)
2. About/History page
3. Update seeders with church references
4. Contact page with church-specific info

### Sprint 5: Permissions + Multi-Admin
1. Church-based permission middleware
2. Multiple leaders per church
3. Membership request flow
4. Email notification service

### Sprint 6: Questionnaire System
1. Question/QuestionCategory models
2. Question builder (admin)
3. Registration form with dynamic questions
4. Answer storage and display

### Sprint 7: PWA + Offline
1. Service worker setup
2. Offline caching strategies
3. PWA manifest
4. Install prompts

### Sprint 8: Polish & Testing
1. End-to-end testing
2. Mobile optimization
3. Performance tuning
4. Documentation

---

## Next Steps

1. ✅ Review and approve this enhanced plan
2. Set up Cloudinary account
3. Create translation files structure
4. **Begin Sprint 0: Migration Preparation**

---

## File References

- Base plan: [MULTI-CHURCH-SYSTEM.md](./MULTI-CHURCH-SYSTEM.md)
- Legacy website: https://cristoeslarespuesta.ueuo.com/
