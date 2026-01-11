import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import theme from './theme';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const auth0CallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: auth0CallbackUrl,
        audience: auth0Audience,
      }}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
