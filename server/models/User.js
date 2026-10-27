const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['guest', 'staff', 'admin'],
      default: 'guest',
    },
    phone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    loyaltyTier: {
      type: String,
      enum: ['Silver', 'Gold', 'Platinum'],
      default: 'Gold',
    },
    vipPreferences: {
      dietary: { type: String, default: 'Gluten-Free / Plant-based available' },
      floorPreference: { type: String, default: 'High Floor (Panoramic view)' },
      pillowType: { type: String, default: 'Hypoallergenic Goose Down' },
      specialNotes: { type: String, default: 'Prefers quiet corner suites' },
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password prior to save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
