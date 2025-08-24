import express from 'express';
import { 
    createOrder, 
    getCustomerOrders, 
    getMerchantOrders,
    getMerchantSales, 
    getMerchantAnalytics,
    updateOrderStatus,
    cancelOrder,
    updatePaymentStatus
} from '../controllers/orderControllers.js';
import { protect, requireMerchant } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Customer routes
router.route('/create').post(protect, createOrder);
router.route('/checkout').post(protect, createOrder);
router.route('/my-orders').get(protect, getCustomerOrders);
router.route('/:orderId/cancel').put(protect, cancelOrder);
router.route('/:orderId/payment-status').put(protect, updatePaymentStatus);

// Merchant routes
router.route('/merchant').get(protect, requireMerchant, getMerchantOrders);
router.route('/merchant/sales').get(protect, requireMerchant, getMerchantSales);
router.route('/merchant/analytics').get(protect, requireMerchant, getMerchantAnalytics);
router.route('/merchant/:orderId/status').put(protect, requireMerchant, updateOrderStatus);

export default router;
