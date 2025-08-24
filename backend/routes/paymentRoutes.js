import express from 'express';
import { createPaymentIntent, confirmPayment, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create payment intent (protected route)
router.post('/create-payment-intent', protect, createPaymentIntent);

// Confirm payment (protected route)
router.post('/confirm-payment', protect, confirmPayment);

// Webhook endpoint (no authentication required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
