const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support development demo tokens
      if (token.startsWith('demo-jwt-token-')) {
        const role = token.replace('demo-jwt-token-', '');
        req.user = {
          _id: '662000000000000000000001',
          name: role === 'admin' ? 'Julian Vance' : role === 'staff' ? 'Elena Rostova' : 'Eleanor Sterling',
          email: `${role}@hotelpro-luxury.com`,
          role: role || 'guest',
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026_luxury_stays'
      );

      // Check Mongoose if DB connected
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        req.user = { _id: decoded.id, role: decoded.role || 'guest' };
      }

      next();
    } catch (error) {
      console.error('[Auth Error]', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
