# Multi-Church System - Feature Plan

## Overview

"Cristo Es La Respuesta" is a church network with locations across Bolivia and other countries. The main church is in Santa Cruz, Bolivia, with branches in other departments, and each department has multiple churches in provinces.

This document outlines the plan to transform the application into a multi-church platform where:
- Each church location can manage its own content
- Believers can register and associate with their local church
- Admins can grant permissions to church leaders
- Visitors can explore and connect with the church

---

## Phase 1: Core Data Models & Infrastructure

### 1.1 Church/Location Model

```
Church {
  _id: ObjectId
  name: String (required)
  slug: String (unique, URL-friendly)

  // Hierarchy
  parentChurch: ObjectId (ref: Church) // null for main church
  level: Enum ['headquarters', 'department', 'province', 'local']

  // Location
  country: String (required)
  department: String // state/region
  province: String
  city: String
  address: String
  coordinates: {
    lat: Number
    lng: Number
  }

  // Contact
  phone: String
  email: String
  website: String
  socialMedia: {
    facebook: String
    instagram: String
    youtube: String
    whatsapp: String
  }

  // Media (Cloudinary)
  logo: String (Cloudinary URL)
  coverImage: String (Cloudinary URL)
  gallery: [String] (Cloudinary URLs)

  // Schedule
  serviceSchedule: [{
    dayOfWeek: Number (0-6)
    type: Enum ['sunday_service', 'bible_study', 'prayer', 'youth', 'other']
    typeName: String // for 'other' type
    startTime: String (HH:mm)
    endTime: String (HH:mm)
    description: String
  }]

  // Status
  status: Enum ['pending', 'active', 'inactive']
  verifiedAt: Date
  verifiedBy: ObjectId (ref: User)

  // Metadata
  createdBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### 1.2 Enhanced User Model

```
User {
  // ... existing fields ...

  // Church Association
  primaryChurch: ObjectId (ref: Church)
  churchMemberships: [{
    church: ObjectId (ref: Church)
    role: Enum ['visitor', 'member', 'leader', 'pastor', 'admin']
    joinedAt: Date
    approvedBy: ObjectId (ref: User)
    status: Enum ['pending', 'approved', 'rejected']
  }]

  // Profile
  fullName: String
  phone: String
  location: {
    country: String
    department: String
    province: String
    city: String
    coordinates: { lat: Number, lng: Number }
  }
  profileImage: String (Cloudinary URL)

  // Registration Info (from questionnaire)
  registrationAnswers: [{
    questionId: ObjectId (ref: Question)
    answer: Mixed
    answeredAt: Date
  }]
  registrationCompleted: Boolean
  registrationCompletedAt: Date
}
```

### 1.3 Dynamic Questionnaire System

```
QuestionCategory {
  _id: ObjectId
  name: String
  description: String
  order: Number
  isActive: Boolean
}

Question {
  _id: ObjectId
  category: ObjectId (ref: QuestionCategory)

  // Question Config
  questionText: String (required)
  questionType: Enum ['text', 'textarea', 'select', 'multiselect', 'radio', 'checkbox', 'date', 'number', 'email', 'phone']
  options: [String] // for select, multiselect, radio

  // Validation
  isRequired: Boolean
  minLength: Number
  maxLength: Number
  regex: String

  // Display
  placeholder: String
  helpText: String
  order: Number

  // Targeting
  targetAudience: Enum ['all', 'new_visitors', 'returning', 'members']
  showForChurches: [ObjectId] // empty = all churches

  // Status
  isActive: Boolean
  createdBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

---

## Phase 2: Permission & Role System

### 2.1 Role Hierarchy

```
SYSTEM_ADMIN (superadmin)
  └── Can manage everything globally
  └── Can approve church registrations
  └── Can assign CHURCH_ADMIN roles

CHURCH_ADMIN (per church)
  └── Can manage their church's content
  └── Can approve members
  └── Can assign CHURCH_LEADER roles
  └── Can manage events, sermons, activities

CHURCH_LEADER (per church)
  └── Can create/edit events
  └── Can upload media
  └── Can view member list

MEMBER (per church)
  └── Can view church content
  └── Can RSVP to events
  └── Can submit prayer requests

VISITOR (default)
  └── Can view public content (doctrine, videos, activities)
  └── Can fill registration questionnaire
  └── Can browse church locations
```

### 2.2 Permission Matrix

| Action                    | Visitor | Member | Leader | Church Admin | Sys Admin |
|---------------------------|---------|--------|--------|--------------|-----------|
| View public content       | ✓       | ✓      | ✓      | ✓            | ✓         |
| View church details       | ✓       | ✓      | ✓      | ✓            | ✓         |
| Fill questionnaire        | ✓       | ✓      | ✓      | ✓            | ✓         |
| View member-only content  | ✗       | ✓      | ✓      | ✓            | ✓         |
| RSVP to events            | ✗       | ✓      | ✓      | ✓            | ✓         |
| Create events             | ✗       | ✗      | ✓      | ✓            | ✓         |
| Upload media              | ✗       | ✗      | ✓      | ✓            | ✓         |
| Manage church info        | ✗       | ✗      | ✗      | ✓            | ✓         |
| Approve members           | ✗       | ✗      | ✗      | ✓            | ✓         |
| Register new church       | ✗       | ✗      | ✗      | ✓            | ✓         |
| Approve churches          | ✗       | ✗      | ✗      | ✗            | ✓         |
| Manage questions          | ✗       | ✗      | ✗      | ✗            | ✓         |
| Assign admin roles        | ✗       | ✗      | ✗      | ✗            | ✓         |

---

## Phase 3: Cloudinary Integration

### 3.1 Configuration

```env
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3.2 Upload Folders Structure

```
ceslar-web/
  ├── churches/
  │   ├── {church_id}/
  │   │   ├── logo/
  │   │   ├── cover/
  │   │   ├── gallery/
  │   │   └── events/
  ├── users/
  │   └── {user_id}/
  │       └── profile/
  ├── sermons/
  │   └── {sermon_id}/
  │       ├── thumbnail/
  │       └── audio/
  └── global/
      ├── doctrine/
      └── activities/
```

### 3.3 Upload Limits

| Content Type    | Max Size | Formats              | Max Count |
|-----------------|----------|----------------------|-----------|
| Profile Image   | 2MB      | jpg, png, webp       | 1         |
| Church Logo     | 1MB      | jpg, png, svg, webp  | 1         |
| Church Cover    | 5MB      | jpg, png, webp       | 1         |
| Church Gallery  | 5MB each | jpg, png, webp       | 20        |
| Event Image     | 5MB      | jpg, png, webp       | 5         |
| Sermon Audio    | 100MB    | mp3, m4a, wav        | 1         |

---

## Phase 4: Features Breakdown

### 4.1 Public Features (No Login Required)

- [ ] Landing page with church network overview
- [ ] Doctrine/beliefs page
- [ ] Video gallery (YouTube embeds)
- [ ] Activity photos gallery
- [ ] Church finder (map + list view)
- [ ] Church detail page (schedule, location, contact)
- [ ] Event calendar (public events only)

### 4.2 Visitor Features (Logged In, Not Registered)

- [ ] Complete registration questionnaire
- [ ] Browse all church locations
- [ ] View public content
- [ ] Request to join a church

### 4.3 Member Features

- [ ] View church-specific content
- [ ] RSVP to events
- [ ] Submit prayer requests
- [ ] View other members (basic info)
- [ ] Update profile

### 4.4 Leader Features

- [ ] Create/edit events for their church
- [ ] Upload photos to church gallery
- [ ] Create announcements
- [ ] View member contact info

### 4.5 Church Admin Features

- [ ] Full church profile management
- [ ] Manage service schedule
- [ ] Approve/reject member requests
- [ ] Assign leader roles
- [ ] View church analytics
- [ ] Register sub-churches (provinces)

### 4.6 System Admin Features

- [ ] Approve new church registrations
- [ ] Configure registration questionnaire
- [ ] Manage global content (doctrine, videos)
- [ ] Assign church admin roles
- [ ] View global analytics
- [ ] Manage user accounts

---

## Phase 5: API Endpoints

### Churches

```
GET    /api/churches                    # List all churches (public)
GET    /api/churches/:id                # Get church details
GET    /api/churches/:id/events         # Get church events
GET    /api/churches/:id/members        # Get church members (auth)
POST   /api/churches                    # Register new church (auth)
PUT    /api/churches/:id                # Update church (admin)
DELETE /api/churches/:id                # Delete church (sysadmin)
POST   /api/churches/:id/verify         # Verify church (sysadmin)
POST   /api/churches/:id/gallery        # Upload to gallery (leader+)
```

### Memberships

```
POST   /api/memberships/request         # Request to join church
GET    /api/memberships/pending         # Get pending requests (admin)
PUT    /api/memberships/:id/approve     # Approve membership (admin)
PUT    /api/memberships/:id/reject      # Reject membership (admin)
PUT    /api/memberships/:id/role        # Change member role (admin)
```

### Questions

```
GET    /api/questions                   # Get active questions
GET    /api/questions/categories        # Get question categories
POST   /api/questions                   # Create question (sysadmin)
PUT    /api/questions/:id               # Update question (sysadmin)
DELETE /api/questions/:id               # Delete question (sysadmin)
POST   /api/questions/answers           # Submit answers (auth)
```

### Media

```
POST   /api/media/upload                # Upload to Cloudinary
DELETE /api/media/:public_id            # Delete from Cloudinary
```

---

## Phase 6: Frontend Pages

### Public Pages
- `/` - Home (network overview)
- `/doctrine` - Beliefs & doctrine
- `/churches` - Church finder (map + list)
- `/churches/:slug` - Church detail page
- `/events` - Global events calendar
- `/videos` - Video gallery
- `/gallery` - Photo gallery

### Auth Pages
- `/login` - Auth0 login
- `/register` - Complete profile + questionnaire
- `/profile` - User profile

### Member Pages
- `/my-church` - My church dashboard
- `/my-church/events` - Church events
- `/my-church/members` - Church members

### Admin Pages
- `/admin/church` - Church management
- `/admin/church/members` - Member management
- `/admin/church/events` - Event management

### System Admin Pages
- `/sysadmin/churches` - All churches
- `/sysadmin/churches/pending` - Pending approvals
- `/sysadmin/questions` - Questionnaire builder
- `/sysadmin/users` - User management
- `/sysadmin/content` - Global content

---

## Phase 7: Implementation Order

### Sprint 1: Foundation
1. Cloudinary integration (backend helper)
2. Church model & basic CRUD
3. Update User model with church associations
4. Basic church listing page

### Sprint 2: Church Management
1. Church registration flow
2. Church detail page
3. Map integration (Leaflet/Google Maps)
4. Service schedule management

### Sprint 3: Permissions
1. Role-based middleware
2. Membership request flow
3. Admin approval workflow
4. Role assignment UI

### Sprint 4: Questionnaire
1. Question/Category models
2. Questionnaire builder (admin)
3. Registration form (frontend)
4. Answer storage & display

### Sprint 5: Content & Media
1. Gallery management
2. Church-specific events
3. Church-specific sermons
4. Activity photos

### Sprint 6: Polish
1. Analytics dashboard
2. Email notifications
3. Search & filters
4. Mobile optimization

---

## Technical Considerations

### Geolocation
- Use browser Geolocation API for user location
- Use Leaflet.js (free) or Google Maps for maps
- Store coordinates for distance-based search

### Cloudinary
- Use signed uploads for security
- Implement image transformations (thumbnails)
- Set up upload presets per content type

### Caching
- Cache church list (Redis optional)
- Cache public content
- Invalidate on updates

### Security
- Validate church hierarchy (can't create HQ-level)
- Rate limit church registrations
- Verify church before activation
- Audit log for admin actions

---

## Questions - ANSWERED

| Question | Answer |
|----------|--------|
| 1. Should users be able to belong to multiple churches? | ✅ YES |
| 2. Can a church have multiple pastors/admins? | ✅ YES |
| 3. Should events be shareable between churches? | ✅ YES |
| 4. Do you want email notifications for approvals? | ✅ YES |
| 5. Should the questionnaire be different per church? | ✅ YES |
| 6. Do you need offline support for the app? | ✅ YES (PWA) |
| 7. What languages should be supported? | ✅ Spanish, Portuguese, English |

> **See enhanced plan:** [MULTI-CHURCH-SYSTEM-ENHANCED.md](./MULTI-CHURCH-SYSTEM-ENHANCED.md)

---

## Next Steps

1. Review and approve this plan
2. Clarify the questions above
3. Set up Cloudinary account
4. Begin Sprint 1 implementation
