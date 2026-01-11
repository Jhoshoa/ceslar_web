import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect } from 'react';
import { setAuthToken, usersApi } from '../services/api';

/**
 * Custom hook that wraps Auth0 and syncs with backend
 */
export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Set token when authenticated
  useEffect(() => {
    const setToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);

          // Sync user with backend on first login
          await usersApi.syncUser({
            email: user.email,
            firstName: user.given_name,
            lastName: user.family_name,
            picture: user.picture,
          });
        } catch (error) {
          console.error('Error setting auth token:', error);
        }
      }
    };

    setToken();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  const login = useCallback((options = {}) => {
    loginWithRedirect(options);
  }, [loginWithRedirect]);

  const logout = useCallback((options = {}) => {
    setAuthToken(null);
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
      ...options,
    });
  }, [auth0Logout]);

  const getToken = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, [getAccessTokenSilently]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getToken,
  };
};

export default useAuth;
