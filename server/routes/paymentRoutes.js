const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  verifyPayment,
} = require('../controllers/paymentController');

router.post('/create-payment-intent', createPaymentIntent);
router.post('/verify', verifyPayment);

module.exports = router;
