import { useAuth0 } from '@auth0/auth0-react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/api';

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = {
  visitor: 0,
  member: 1,
  leader: 2,
  staff: 3,
  pastor: 4,
  admin: 5,
  system_admin: 6,
};

// Auth0 namespace for roles claim - try multiple formats
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || '';

/**
 * Custom hook for role-based permissions
 * Combines Auth0 roles from token with backend user data
 */
export const usePermissions = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [auth0Roles, setAuth0Roles] = useState([]);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract roles from Auth0 token
  useEffect(() => {
    const fetchRoles = async () => {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();

          // Try multiple namespace formats to find roles
          const possibleNamespaces = [
            `https://${AUTH0_DOMAIN}/roles`,
            `https://${AUTH0_DOMAIN.replace('.auth0.com', '')}.auth0.com/roles`,
            'roles', // Simple claim
            'https://auth0.com/roles',
          ];

          let roles = [];

          // Debug: log all claims to help troubleshoot
          if (process.env.NODE_ENV === 'development') {
            console.log('Auth0 ID Token Claims:', claims);
          }

          // Try each namespace
          for (const ns of possibleNamespaces) {
            if (claims?.[ns] && Array.isArray(claims[ns]) && claims[ns].length > 0) {
              roles = claims[ns];
              if (process.env.NODE_ENV === 'development') {
                console.log(`Found roles at namespace "${ns}":`, roles);
              }
              break;
            }
          }

          // Also check user object for roles (Auth0 sometimes puts them there)
          if (roles.length === 0 && user) {
            const userNamespaces = Object.keys(user).filter(k => k.includes('roles'));
            for (const ns of userNamespaces) {
              if (Array.isArray(user[ns]) && user[ns].length > 0) {
                roles = user[ns];
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Found roles in user object at "${ns}":`, roles);
                }
                break;
              }
            }
          }

          setAuth0Roles(roles);
        } catch (error) {
          console.error('Error fetching Auth0 roles:', error);
          setAuth0Roles([]);
        }
      } else {
        setAuth0Roles([]);
      }
    };
    fetchRoles();
  }, [isAuthenticated, getIdTokenClaims, user]);

  // Fetch backend user data for church memberships
  useEffect(() => {
    const fetchBackendUser = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await usersApi.getMe();
          setBackendUser(response.data);
        } catch (error) {
          console.error('Error fetching backend user:', error);
          setBackendUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setBackendUser(null);
        setLoading(false);
      }
    };
    fetchBackendUser();
  }, [isAuthenticated]);

  // Check if user has a specific role (from Auth0)
  const hasRole = useCallback((role) => {
    if (!isAuthenticated) return false;
    return auth0Roles.includes(role);
  }, [isAuthenticated, auth0Roles]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    if (!isAuthenticated) return false;
    return roles.some(role => auth0Roles.includes(role));
  }, [isAuthenticated, auth0Roles]);

  // Check if user is system admin
  const isSystemAdmin = useMemo(() => {
    return hasRole('system_admin');
  }, [hasRole]);

  // Check if user has admin access (system_admin or admin)
  const isAdmin = useMemo(() => {
    return hasAnyRole(['system_admin', 'admin']);
  }, [hasAnyRole]);

  // Check if user can manage content (admin, staff, pastor)
  const canManageContent = useMemo(() => {
    return hasAnyRole(['system_admin', 'admin', 'staff', 'pastor']);
  }, [hasAnyRole]);

  // Get user's role in a specific church
  const getRoleInChurch = useCallback((churchId) => {
    if (!backendUser?.churchMemberships) return null;
    const membership = backendUser.churchMemberships.find(
      m => m.church?._id === churchId || m.church === churchId
    );
    return membership?.role || null;
  }, [backendUser]);

  // Check if user has specific role in a church
  const hasChurchRole = useCallback((churchId, requiredRole) => {
    const userRole = getRoleInChurch(churchId);
    if (!userRole) return false;

    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
  }, [getRoleInChurch]);

  // Check if user can manage a specific church
  const canManageChurch = useCallback((churchId) => {
    if (isSystemAdmin) return true;
    return hasChurchRole(churchId, 'admin');
  }, [isSystemAdmin, hasChurchRole]);

  // Get all church IDs where user has admin/pastor role
  const managedChurchIds = useMemo(() => {
    if (isSystemAdmin) return 'all';
    if (!backendUser?.churchMemberships) return [];

    return backendUser.churchMemberships
      .filter(m => ['admin', 'pastor'].includes(m.role))
      .map(m => m.church?._id || m.church);
  }, [isSystemAdmin, backendUser]);

  // Permission checks for specific resources
  const permissions = useMemo(() => ({
    // Church management
    canViewChurches: isAdmin,
    canCreateChurch: isSystemAdmin,
    canEditChurch: (churchId) => canManageChurch(churchId),
    canDeleteChurch: isSystemAdmin,

    // Event management
    canViewEvents: canManageContent,
    canCreateEvent: canManageContent,
    canEditEvent: canManageContent,
    canDeleteEvent: isAdmin,

    // Sermon management
    canViewSermons: canManageContent,
    canCreateSermon: canManageContent,
    canEditSermon: canManageContent,
    canDeleteSermon: isAdmin,

    // Ministry management
    canViewMinistries: canManageContent,
    canCreateMinistry: isAdmin,
    canEditMinistry: isAdmin,
    canDeleteMinistry: isAdmin,

    // Question management
    canViewQuestions: isSystemAdmin,
    canCreateQuestion: isSystemAdmin,
    canEditQuestion: isSystemAdmin,
    canDeleteQuestion: isSystemAdmin,

    // User management
    canViewUsers: isAdmin,
    canEditUser: isAdmin,
    canDeleteUser: isSystemAdmin,

    // Dashboard
    canAccessAdmin: canManageContent,
  }), [isSystemAdmin, isAdmin, canManageContent, canManageChurch]);

  return {
    // Auth0 roles
    roles: auth0Roles,
    hasRole,
    hasAnyRole,

    // Role shortcuts
    isSystemAdmin,
    isAdmin,
    canManageContent,

    // Church-specific permissions
    getRoleInChurch,
    hasChurchRole,
    canManageChurch,
    managedChurchIds,

    // Resource permissions
    permissions,

    // Backend user data
    backendUser,

    // Loading state
    loading,
  };
};

export default usePermissions;
