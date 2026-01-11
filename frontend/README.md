# Church Website - Frontend

Modern React frontend for the church website built with Vite, Material-UI, and Auth0.

## Tech Stack

- **Framework:** React 18 with Vite
- **UI Library:** Material-UI (MUI) v5
- **Routing:** React Router v6
- **Authentication:** Auth0 React SDK
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **Date Handling:** Day.js

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Loading.jsx
│   │   │   └── SectionTitle.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── features/        # Feature-specific components
│   │   │   └── home/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── WelcomeSection.jsx
│   │   │       ├── UpcomingEvents.jsx
│   │   │       ├── LatestSermon.jsx
│   │   │       ├── MinistriesSection.jsx
│   │   │       ├── CTASection.jsx
│   │   │       └── ContactSection.jsx
│   │   └── pages/           # Page components
│   │       └── HomePage.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useApi.js
│   │   └── useAuth.js
│   ├── services/            # API services
│   │   └── api.js
│   ├── helpers/             # Utility functions
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── commons/             # Constants
│   │   └── constants.js
│   ├── context/             # React contexts
│   ├── theme/               # MUI theme configuration
│   │   └── index.js
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   └── icons/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── Dockerfile
├── nginx.conf
└── package.json
```

## Prerequisites

- Node.js 20 or higher
- npm or yarn

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
   Edit `.env` with your Auth0 credentials.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Using Docker

```bash
# From the project root directory
docker-compose up -d frontend
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain | Yes |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID | Yes |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience | Yes |
| `VITE_AUTH0_CALLBACK_URL` | OAuth callback URL | No |
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_TAGLINE` | Application tagline | No |

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Theme Configuration

The theme uses the church's brand colors (Red, Blue, White):

```javascript
// Primary: Deep Blue
primary: {
  main: '#1a365d',
  light: '#2c5282',
  dark: '#0f2942',
}

// Secondary: Church Red
secondary: {
  main: '#c53030',
  light: '#e53e3e',
  dark: '#9b2c2c',
}
```

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Main landing page |
| `/about` | AboutPage | About the church |
| `/ministries` | MinistriesPage | List of ministries |
| `/sermons` | SermonsPage | Sermon archive |
| `/events` | EventsPage | Events calendar |
| `/contact` | ContactPage | Contact information |
| `/give` | GivePage | Online giving |
| `/login` | - | Auth0 login redirect |
| `/dashboard` | DashboardPage | Member dashboard |

## Component Guidelines

### Creating New Components

```jsx
// components/features/example/ExampleComponent.jsx
import { Box, Typography } from '@mui/material';

const ExampleComponent = ({ title, children }) => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4">{title}</Typography>
      {children}
    </Box>
  );
};

export default ExampleComponent;
```

### Using the API Service

```jsx
import { useApi } from '@hooks/useApi';
import { eventsApi } from '@services/api';

const EventsList = () => {
  const { data, loading, error } = useApi(eventsApi.getUpcoming);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {data.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
```

## Production Build

```bash
# Build the application
npm run build

# The output will be in the 'dist' directory
```

## Docker Production

The production Docker image uses Nginx to serve static files:

```bash
# Build production image
docker build -t church-frontend:prod --target production .

# Run the container
docker run -p 80:80 church-frontend:prod
```

### Create a tunnel with cloadfare
```
> cloudflared tunnel --url http://localhost:3000
```

## License

Private - All rights reserved
