const Service = require('../models/Service');
const { getDBStatus } = require('../config/db');
const { initialServices } = require('../utils/seedData');

// Resilient in-memory services store
let inMemoryServices = JSON.parse(JSON.stringify(initialServices));

// @desc    Get all service tickets
// @route   GET /api/services
// @access  Private (Staff/Admin/Guest)
const getServices = async (req, res) => {
  try {
    const { status, roomNumber, priority } = req.query;
    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      let query = {};
      if (status && status !== 'all') query.status = status;
      if (roomNumber) query.roomNumber = roomNumber;
      if (priority) query.priority = priority;

      const services = await Service.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: services.length, data: services });
    } else {
      let result = [...inMemoryServices];
      if (status && status !== 'all') {
        result = result.filter((s) => s.status === status);
      }
      if (roomNumber) {
        result = result.filter((s) => s.roomNumber === roomNumber);
      }
      if (priority) {
        result = result.filter((s) => s.priority === priority);
      }
      return res.json({ success: true, count: result.length, data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service request
// @route   POST /api/services
// @access  Private / Public
const createService = async (req, res) => {
  try {
    const { guestName, roomNumber, serviceType, details, priority = 'Normal' } = req.body;

    if (!roomNumber || !serviceType || !details) {
      return res.status(400).json({
        success: false,
        message: 'Please provide room number, service type, and request details',
      });
    }

    const serviceData = {
      guestName: guestName || (req.user ? req.user.name : 'Valued Resident'),
      roomNumber,
      serviceType,
      details,
      priority,
      status: 'Pending',
      assignedTo: 'Pending Assignment',
    };

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const created = await Service.create(serviceData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const newService = {
        _id: 'srv_' + Date.now(),
        ...serviceData,
        createdAt: new Date().toISOString(),
      };
      inMemoryServices.unshift(newService);
      return res.status(201).json({ success: true, data: newService });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service status or assignment
// @route   PATCH /api/services/:id/status
// @access  Private (Staff/Admin)
const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const dbConnected = getDBStatus().connected;

    if (dbConnected) {
      const updateFields = {};
      if (status) updateFields.status = status;
      if (assignedTo) updateFields.assignedTo = assignedTo;

      const updated = await Service.findByIdAndUpdate(id, updateFields, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Service ticket not found' });
      }
      return res.json({ success: true, data: updated });
    } else {
      const ticket = inMemoryServices.find((s) => s._id === id);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Service ticket not found' });
      }
      if (status) ticket.status = status;
      if (assignedTo) ticket.assignedTo = assignedTo;
      return res.json({ success: true, data: ticket });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateServiceStatus,
  inMemoryServices,
};
