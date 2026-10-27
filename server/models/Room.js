const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      default: 'Executive Suite',
    },
    price: {
      type: Number,
      min: 0,
    },
    pricePerNight: {
      type: Number,
      min: 0,
    },
    basePrice: {
      type: Number,
      default: 750,
    },
    seasonalMultiplier: {
      type: Number,
      default: 1.0,
    },
    capacity: {
      type: Number,
      default: 2,
    },
    bedType: {
      type: String,
      default: 'King Size Plush Featherbed',
    },
    sizeSqFt: {
      type: Number,
      default: 850,
    },
    floor: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: 'Refined sanctuary with bespoke furnishings, acoustic sound isolation, and curated amenities.',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      ],
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 12,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: 'Clean',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for unified display title
roomSchema.virtual('displayTitle').get(function () {
  return this.title || this.name || `Suite ${this.roomNumber}`;
});

// Virtual for unified price
roomSchema.virtual('displayPrice').get(function () {
  return this.price || this.pricePerNight || 750;
});

module.exports = mongoose.model('Room', roomSchema);
