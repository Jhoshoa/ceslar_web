import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';

/**
 * Debug page to inspect Auth0 tokens and roles
 * Access at /auth-debug
 */
const AuthDebugPage = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  const [idTokenClaims, setIdTokenClaims] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [decodedAccessToken, setDecodedAccessToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (isAuthenticated) {
        try {
          // Get ID token claims
          const claims = await getIdTokenClaims();
          setIdTokenClaims(claims);

          // Get access token
          const token = await getAccessTokenSilently();
          setAccessToken(token);

          // Decode access token (JWT)
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              setDecodedAccessToken(payload);
            }
          } catch (e) {
            console.error('Error decoding access token:', e);
          }
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchTokens();
  }, [isAuthenticated, getIdTokenClaims, getAccessTokenSilently]);

  // Find roles in claims
  const findRoles = (claims) => {
    if (!claims) return { found: false, namespace: null, roles: [] };

    const roleKeys = Object.keys(claims).filter(
      (key) => key.includes('roles') || key.includes('role')
    );

    for (const key of roleKeys) {
      if (Array.isArray(claims[key]) && claims[key].length > 0) {
        return { found: true, namespace: key, roles: claims[key] };
      }
    }

    return { found: false, namespace: null, roles: [], checkedKeys: roleKeys };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const idTokenRoles = findRoles(idTokenClaims);
  const accessTokenRoles = findRoles(decodedAccessToken);

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Auth0 Debug Page
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isAuthenticated ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Not Authenticated
            </Typography>
            <Button variant="contained" onClick={() => loginWithRedirect()}>
              Login to Debug
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Status Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Alert
                  severity={idTokenRoles.found ? 'success' : 'error'}
                  sx={{ flex: 1 }}
                >
                  <strong>ID Token Roles:</strong>{' '}
                  {idTokenRoles.found
                    ? `Found at "${idTokenRoles.namespace}": [${idTokenRoles.roles.join(', ')}]`
                    : 'NOT FOUND'}
                </Alert>

                <Alert
                  severity={accessTokenRoles.found ? 'success' : 'error'}
                  sx={{ flex: 1 }}
                >
                  <strong>Access Token Roles:</strong>{' '}
                  {accessTokenRoles.found
                    ? `Found at "${accessTokenRoles.namespace}": [${accessTokenRoles.roles.join(', ')}]`
                    : 'NOT FOUND'}
                </Alert>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Logout & Try Again
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* User Object */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Auth0 User Object
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  overflow: 'auto',
                  maxHeight: 300,
                }}
              >
                <pre style={{ margin: 0, fontSize: '12px' }}>
                  {JSON.stringify(user, null, 2)}
                </pre>
              </Paper>
            </CardContent>
          </Card>

          {/* ID Token Claims */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ID Token Claims (getIdTokenClaims)
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {!idTokenRoles.found && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <strong>No roles found!</strong> Checked keys:{' '}
                  {idTokenRoles.checkedKeys?.length
                    ? idTokenRoles.checkedKeys.join(', ')
                    : 'none containing "role"'}
                  <br />
                  <br />
                  <strong>Expected namespace:</strong>{' '}
                  https://dev-cv5hg0qbswv5it1n.us.auth0.com/roles
                </Alert>
              )}

              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  overflow: 'auto',
                  maxHeight: 400,
                }}
              >
                <pre style={{ margin: 0, fontSize: '12px' }}>
                  {JSON.stringify(idTokenClaims, null, 2)}
                </pre>
              </Paper>
            </CardContent>
          </Card>

          {/* Access Token (Decoded) */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Access Token (Decoded)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  overflow: 'auto',
                  maxHeight: 400,
                }}
              >
                <pre style={{ margin: 0, fontSize: '12px' }}>
                  {JSON.stringify(decodedAccessToken, null, 2)}
                </pre>
              </Paper>
            </CardContent>
          </Card>

          {/* Raw Access Token */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Raw Access Token (for jwt.io)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  overflow: 'auto',
                  wordBreak: 'break-all',
                }}
              >
                <code style={{ fontSize: '11px' }}>{accessToken}</code>
              </Paper>
              <Button
                sx={{ mt: 1 }}
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(accessToken);
                  alert('Copied to clipboard!');
                }}
              >
                Copy Token
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default AuthDebugPage;
