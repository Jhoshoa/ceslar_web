const { auth } = require('express-oauth2-jwt-bearer');
const config = require('./index');

// Auth0 JWT validation middleware
const checkJwt = auth({
  audience: config.auth0.audience,
  issuerBaseURL: `https://${config.auth0.domain}/`,
  tokenSigningAlg: 'RS256'
});

// Middleware to check for specific permissions/scopes
const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissions = req.auth?.payload?.permissions || [];

    const hasPermissions = requiredPermissions.every(permission =>
      permissions.includes(permission)
    );

    if (!hasPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'FORBIDDEN'
      });
    }

    next();
  };
};

// Middleware to check for specific roles
const checkRoles = (requiredRoles) => {
  return (req, res, next) => {
    const namespace = `https://${config.auth0.domain}/roles`;
    const roles = req.auth?.payload?.[namespace] || [];

    const hasRole = requiredRoles.some(role => roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role privileges',
        error: 'FORBIDDEN'
      });
    }

    next();
  };
};

module.exports = {
  checkJwt,
  checkPermissions,
  checkRoles
};
