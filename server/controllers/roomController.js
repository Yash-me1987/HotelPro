const Room = require('../models/Room');
const { getDBStatus } = require('../config/db');
const { initialRooms } = require('../utils/seedData');

// Resilient in-memory room store
let inMemoryRooms = JSON.parse(JSON.stringify(initialRooms));

// @desc    Get all rooms with filtering, search & sorting
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, capacity, availableOnly, sort, search } = req.query;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let query = {};

      if (category && category !== 'All Suites') {
        query.type = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (capacity && capacity !== 'all') {
        query.capacity = { $gte: Number(capacity) };
      }

      if (availableOnly === 'true') {
        query.isAvailable = true;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { roomNumber: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOptions = {};
      if (sort === 'price-asc') sortOptions.price = 1;
      else if (sort === 'price-desc') sortOptions.price = -1;
      else if (sort === 'rating') sortOptions.rating = -1;
      else sortOptions.createdAt = -1;

      const rooms = await Room.find(query).sort(sortOptions);
      const normalizedRooms = rooms.map((r) => {
        const obj = r.toObject ? r.toObject() : { ...r };
        return {
          ...obj,
          title: obj.title || obj.name || `Suite ${obj.roomNumber}`,
          price: obj.price || obj.pricePerNight || 750,
          basePrice: obj.basePrice || obj.price || obj.pricePerNight || 750,
        };
      });
      return res.json({ success: true, count: normalizedRooms.length, data: normalizedRooms });
    } else {
      // Resilient In-Memory filtering
      let result = [...inMemoryRooms];

      if (category && category !== 'All Suites') {
        result = result.filter((r) => r.type === category);
      }

      if (minPrice) {
        result = result.filter((r) => r.price >= Number(minPrice));
      }

      if (maxPrice) {
        result = result.filter((r) => r.price <= Number(maxPrice));
      }

      if (capacity && capacity !== 'all') {
        result = result.filter((r) => r.capacity >= Number(capacity));
      }

      if (availableOnly === 'true') {
        result = result.filter((r) => r.isAvailable);
      }

      if (search) {
        const queryTerm = search.toLowerCase();
        result = result.filter(
          (r) =>
            r.title.toLowerCase().includes(queryTerm) ||
            r.description.toLowerCase().includes(queryTerm) ||
            r.roomNumber.toLowerCase().includes(queryTerm)
        );
      }

      if (sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      }

      return res.json({ success: true, count: result.length, data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room by ID or RoomNumber
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let room;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        room = await Room.findById(id);
      } else {
        room = await Room.findOne({ roomNumber: id });
      }

      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      const obj = room.toObject ? room.toObject() : { ...room };
      const normalized = {
        ...obj,
        title: obj.title || obj.name || `Suite ${obj.roomNumber}`,
        price: obj.price || obj.pricePerNight || 750,
        basePrice: obj.basePrice || obj.price || obj.pricePerNight || 750,
      };
      return res.json({ success: true, data: normalized });
    } else {
      const room = inMemoryRooms.find((r) => r._id === id || r.roomNumber === id);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      return res.json({ success: true, data: room });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new room/suite (with file upload support)
// @route   POST /api/rooms
// @access  Private (Staff/Admin)
const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      title,
      type,
      price,
      capacity,
      bedType,
      sizeSqFt,
      floor,
      description,
      amenities,
    } = req.body;

    const parsedAmenities = Array.isArray(amenities)
      ? amenities
      : typeof amenities === 'string'
      ? amenities.split(',').map((a) => a.trim())
      : [];

    let imageList = [];
    if (req.files && req.files.length > 0) {
      imageList = req.files.map((f) => `/uploads/${f.filename}`);
    } else if (req.body.images) {
      imageList = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      imageList = [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      ];
    }

    const roomData = {
      roomNumber,
      title,
      type,
      price: Number(price),
      basePrice: Number(price),
      seasonalMultiplier: 1.0,
      capacity: Number(capacity) || 2,
      bedType: bedType || 'King Plush Bed',
      sizeSqFt: Number(sizeSqFt) || 850,
      floor: Number(floor) || 1,
      description,
      amenities: parsedAmenities,
      images: imageList,
      rating: 5.0,
      reviewCount: 0,
      isAvailable: true,
      status: 'Clean',
    };

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const created = await Room.create(roomData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const newRoom = {
        _id: 'rm_' + Date.now(),
        ...roomData,
        createdAt: new Date().toISOString(),
      };
      inMemoryRooms.push(newRoom);
      return res.status(201).json({ success: true, data: newRoom });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room details or status
// @route   PUT /api/rooms/:id
// @access  Private (Staff/Admin)
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const updated = await Room.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { roomNumber: id }] },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      return res.json({ success: true, data: updated });
    } else {
      const index = inMemoryRooms.findIndex((r) => r._id === id || r.roomNumber === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      inMemoryRooms[index] = { ...inMemoryRooms[index], ...req.body };
      return res.json({ success: true, data: inMemoryRooms[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room housekeeping status (Clean, Dirty, Inspected, Out of Order)
// @route   PATCH /api/rooms/:id/status
// @access  Private (Staff/Admin)
const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Clean', 'Dirty', 'Inspected', 'Out of Order'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status supplied' });
    }

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const room = await Room.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { roomNumber: id }] },
        { status, isAvailable: status === 'Clean' },
        { new: true }
      );
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      return res.json({ success: true, data: room });
    } else {
      const index = inMemoryRooms.findIndex((r) => r._id === id || r.roomNumber === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      inMemoryRooms[index].status = status;
      inMemoryRooms[index].isAvailable = status === 'Clean';
      return res.json({ success: true, data: inMemoryRooms[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update dynamic seasonal pricing multipliers
// @route   PATCH /api/rooms/pricing/multiplier
// @access  Private (Admin)
const updateSeasonalPricing = async (req, res) => {
  try {
    const { multiplier = 1.0, roomType } = req.body;
    const mult = Number(multiplier);

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const filter = roomType ? { type: roomType } : {};
      const rooms = await Room.find(filter);

      for (let r of rooms) {
        r.seasonalMultiplier = mult;
        r.price = Math.round(r.basePrice * mult);
        await r.save();
      }

      return res.json({
        success: true,
        message: `Updated pricing with multiplier ${mult}`,
      });
    } else {
      inMemoryRooms.forEach((r) => {
        if (!roomType || r.type === roomType) {
          r.seasonalMultiplier = mult;
          r.price = Math.round(r.basePrice * mult);
        }
      });
      return res.json({
        success: true,
        message: `Updated pricing with multiplier ${mult}`,
        data: inMemoryRooms,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get 7-Day Visual Room Availability Matrix
// @route   GET /api/rooms/availability/matrix
// @access  Private (Staff/Admin)
const getAvailabilityMatrix = async (req, res) => {
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const rooms = inMemoryRooms.map((r) => ({
      roomNumber: r.roomNumber,
      title: r.title,
      type: r.type,
      schedule: days.map((day) => ({
        day,
        status:
          r.status === 'Clean'
            ? 'Available'
            : r.status === 'Dirty'
            ? 'Occupied'
            : r.status === 'Inspected'
            ? 'Reserved'
            : 'Maintenance',
      })),
    }));

    return res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  updateSeasonalPricing,
  getAvailabilityMatrix,
  inMemoryRooms,
};
