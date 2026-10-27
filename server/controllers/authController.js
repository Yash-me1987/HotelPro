const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

// In-memory user store for standalone resilient mode
let inMemoryUsers = [
  {
    _id: '662000000000000000000001',
    name: 'Eleanor Sterling',
    email: 'guest@hotelpro-luxury.com',
    passwordHash: '$2a$10$w09u.fG3KjF7UoXgUaU86OBjZ7N4n2m8uG78d5Y9N0s.eZ9d0X9eK', // password123
    role: 'guest',
    phone: '+1 (555) 392-8172',
    loyaltyTier: 'Platinum',
    vipPreferences: {
      dietary: 'Gluten-Free & Plant-Based',
      floorPreference: 'High Floor Panoramic',
      pillowType: 'Goose Down Silk',
      specialNotes: 'Prefers quiet corner suites'
    },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    _id: '662000000000000000000002',
    name: 'Elena Rostova',
    email: 'staff@hotelpro-luxury.com',
    passwordHash: '$2a$10$w09u.fG3KjF7UoXgUaU86OBjZ7N4n2m8uG78d5Y9N0s.eZ9d0X9eK',
    role: 'staff',
    phone: '+1 (555) 441-9923',
    loyaltyTier: 'Gold',
    vipPreferences: {},
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    _id: '662000000000000000000003',
    name: 'Julian Vance',
    email: 'admin@hotelpro-luxury.com',
    passwordHash: '$2a$10$w09u.fG3KjF7UoXgUaU86OBjZ7N4n2m8uG78d5Y9N0s.eZ9d0X9eK',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    loyaltyTier: 'Platinum',
    vipPreferences: {},
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  }
];

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026_luxury_stays',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'guest', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        phone: phone || '+1 (555) 000-0000',
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          loyaltyTier: user.loyaltyTier,
          vipPreferences: user.vipPreferences,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      // In-memory fallback
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        phone: phone || '+1 (555) 000-0000',
        loyaltyTier: 'Silver',
        vipPreferences: {
          dietary: 'Standard',
          floorPreference: 'High Floor',
          pillowType: 'Standard Down',
          specialNotes: ''
        },
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };

      inMemoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          loyaltyTier: newUser.loyaltyTier,
          vipPreferences: newUser.vipPreferences,
          token: generateToken(newUser._id, newUser.role),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials entered' });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          loyaltyTier: user.loyaltyTier,
          vipPreferences: user.vipPreferences,
          avatar: user.avatar,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      // In-memory fallback
      const user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      // Permit demo persona passwords or matched hash
      const isValid = user && (password === 'password123' || password === 'demo123' || (await bcrypt.compare(password, user.passwordHash)));
      
      if (!user || !isValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials entered' });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          loyaltyTier: user.loyaltyTier,
          vipPreferences: user.vipPreferences,
          avatar: user.avatar,
          token: generateToken(user._id, user.role),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    } else {
      const user = inMemoryUsers.find((u) => String(u._id) === String(req.user._id)) || inMemoryUsers[0];
      return res.json({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile & VIP preferences
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, vipPreferences, avatar } = req.body;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;
      if (vipPreferences) {
        user.vipPreferences = { ...user.vipPreferences, ...vipPreferences };
      }

      const updated = await user.save();
      return res.json({ success: true, data: updated });
    } else {
      const userIndex = inMemoryUsers.findIndex((u) => String(u._id) === String(req.user._id));
      const target = userIndex !== -1 ? inMemoryUsers[userIndex] : inMemoryUsers[0];

      if (name) target.name = name;
      if (phone) target.phone = phone;
      if (avatar) target.avatar = avatar;
      if (vipPreferences) {
        target.vipPreferences = { ...target.vipPreferences, ...vipPreferences };
      }

      return res.json({ success: true, data: target });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  inMemoryUsers,
};
