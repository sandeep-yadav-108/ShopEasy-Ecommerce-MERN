import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// Create order from cart (checkout)
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deliveryAddress, phoneNumber, paymentMethod, items, totalAmount, paymentStatus } = req.body;

        // Handle both cart-based orders and direct item orders
        let orderItems = [];
        let calculatedTotal = 0;

        if (items && items.length > 0) {
            // Direct order with items (from checkout)
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(400).json({ message: `Product not found` });
                }

                // Check stock availability
                if (product.quantity < item.quantity) {
                    return res.status(400).json({ 
                        message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
                    });
                }

                const itemTotal = item.quantity * item.price;
                
                orderItems.push({
                    productId: product._id,
                    merchantId: product.owner,
                    productName: product.name,
                    quantity: item.quantity,
                    priceAtTime: item.price,
                    totalPrice: itemTotal
                });

                calculatedTotal += itemTotal;

                // Update product quantity
                product.quantity -= item.quantity;
                await product.save();
            }
        } else {
            // Cart-based order (fallback)
            const cart = await Cart.findOne({ userId }).populate('items.productId');
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: "Cart is empty and no items provided" });
            }

            for (const cartItem of cart.items) {
                const product = cartItem.productId;
                
                // Check stock availability
                if (product.quantity < cartItem.quantity) {
                    return res.status(400).json({ 
                        message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${cartItem.quantity}` 
                    });
                }

                const itemTotal = cartItem.quantity * cartItem.priceAtTime;
                
                orderItems.push({
                    productId: product._id,
                    merchantId: product.owner,
                    productName: product.name,
                    quantity: cartItem.quantity,
                    priceAtTime: cartItem.priceAtTime,
                    totalPrice: itemTotal
                });

                calculatedTotal += itemTotal;

                // Update product quantity
                product.quantity -= cartItem.quantity;
                await product.save();
            }

            // Clear cart
            await Cart.findOneAndDelete({ userId });
        }

        // Create order
        const order = new Order({
            customer: userId,
            items: orderItems,
            totalAmount: totalAmount || calculatedTotal,
            shippingAddress: deliveryAddress || { address: 'Not provided' },
            phoneNumber: phoneNumber || '',
            paymentMethod: paymentMethod || 'card',
            status: 'pending',
            paymentStatus: paymentStatus || 'pending',
            stripePaymentIntentId: req.body.stripePaymentIntentId || null
        });

        await order.save();

        // Populate the order for response
        const populatedOrder = await Order.findById(order._id)
            .populate('customer', 'fullname email')
            .populate('items.productId', 'name images')
            .populate('items.merchantId', 'fullname email');

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

// Get customer's orders
export const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('items.productId', 'name images')
            .populate('items.merchantId', 'fullname')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get merchant's orders (orders containing their products)
export const getMerchantOrders = async (req, res) => {
    try {
        const merchantId = req.user.id;
        
        // Find all orders that contain products from this merchant
        const orders = await Order.find({ 'items.merchantId': merchantId })
            .populate('customer', 'fullname email')
            .populate('items.productId', 'name images')
            .sort({ createdAt: -1 });

        // Filter items to only include this merchant's products and format response
        const merchantOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.filter(item => item.merchantId.toString() === merchantId)
        }));

        res.status(200).json({ 
            success: true,
            orders: merchantOrders 
        });
    } catch (error) {
        console.error('Error fetching merchant orders:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching merchant orders", 
            error: error.message 
        });
    }
};

// Get merchant's sales (orders containing their products)
export const getMerchantSales = async (req, res) => {
    try {
        const merchantId = req.user.id;
        
        // Find all orders that contain products from this merchant
        const orders = await Order.find({ 'items.merchantId': merchantId })
            .populate('customer', 'fullname email address')
            .populate('items.productId', 'name images')
            .sort({ createdAt: -1 });

        // Filter items to only include this merchant's products
        const merchantOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.filter(item => item.merchantId.toString() === merchantId),
            totalMerchantAmount: order.items
                .filter(item => item.merchantId.toString() === merchantId)
                .reduce((sum, item) => sum + item.totalPrice, 0)
        }));

        res.status(200).json(merchantOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching merchant sales", error: error.message });
    }
};

// Get merchant dashboard analytics
export const getMerchantAnalytics = async (req, res) => {
    try {
        const merchantId = req.user.id;
        
        // Get all orders containing merchant's products
        const orders = await Order.find({ 'items.merchantId': merchantId });
        
        // Calculate analytics
        let totalRevenue = 0;
        let totalOrders = 0;
        let totalProductsSold = 0;
        let cancelledOrders = 0;
        const revenueByMonth = {};
        const topProducts = {};
        const ordersByStatus = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            const merchantItems = order.items.filter(item => item.merchantId.toString() === merchantId);
            
            if (merchantItems.length > 0) {
                // Count all orders (including cancelled)
                totalOrders++;
                
                // Track order status
                ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
                
                // Only count revenue and products sold for non-cancelled orders
                if (order.status !== 'cancelled') {
                    merchantItems.forEach(item => {
                        totalRevenue += item.totalPrice;
                        totalProductsSold += item.quantity;
                        
                        // Track revenue by month (excluding cancelled)
                        const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
                        revenueByMonth[month] = (revenueByMonth[month] || 0) + item.totalPrice;
                        
                        // Track top products (excluding cancelled)
                        const productKey = item.productId.toString();
                        if (!topProducts[productKey]) {
                            topProducts[productKey] = {
                                name: item.productName,
                                totalSold: 0,
                                revenue: 0
                            };
                        }
                        topProducts[productKey].totalSold += item.quantity;
                        topProducts[productKey].revenue += item.totalPrice;
                    });
                } else {
                    cancelledOrders++;
                }
            }
        });

        // Get total products count
        const totalProducts = await Product.countDocuments({ owner: merchantId });
        
        // Convert top products to array and sort
        const topProductsArray = Object.entries(topProducts)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalProducts,
            totalProductsSold,
            cancelledOrders,
            activeOrders: totalOrders - cancelledOrders,
            averageOrderValue: (totalOrders - cancelledOrders) > 0 ? totalRevenue / (totalOrders - cancelledOrders) : 0,
            ordersByStatus,
            revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
                month,
                revenue
            })),
            topProducts: topProductsArray
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching analytics", error: error.message });
    }
};

// Update order status (for merchants)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const merchantId = req.user.id;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find order and verify merchant has products in it
        const order = await Order.findOne({ 
            _id: orderId,
            'items.merchantId': merchantId 
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied" });
        }

        // Prevent updating cancelled or delivered orders
        if (order.status === 'cancelled') {
            return res.status(400).json({ 
                success: false,
                message: "Cannot update status of cancelled orders" 
            });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ 
                success: false,
                message: "Cannot update status of delivered orders" 
            });
        }

        // Define valid status transitions
        const validTransitions = {
            'pending': ['pending', 'processing', 'cancelled'],
            'processing': ['processing', 'shipped', 'cancelled'],
            'shipped': ['shipped', 'delivered', 'cancelled']
        };

        const currentStatus = order.status;
        const allowedStatuses = validTransitions[currentStatus] || [];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: `Cannot change status from ${currentStatus} to ${status}` 
            });
        }

        // Update the order status
        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

// Cancel order (customer can cancel pending orders)
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const customerId = req.user.id;

        // Find order and verify it belongs to the customer
        const order = await Order.findOne({ 
            _id: orderId,
            customer: customerId 
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Only allow cancellation of pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: `Cannot cancel order with status: ${order.status}` 
            });
        }

        // Update order status to cancelled
        order.status = 'cancelled';
        order.paymentStatus='failed'
        await order.save();

        // Restore product quantities for cancelled order
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error: error.message });
    }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;
        const userId = req.user.id;

        // Validate payment status
        const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ 
                message: "Invalid payment status. Must be one of: " + validStatuses.join(', ') 
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if user is the customer or a merchant for this order
        const isCustomer = order.customer.toString() === userId;
        const isMerchant = order.items.some(item => item.merchantId.toString() === userId);
        
        if (!isCustomer && !isMerchant) {
            return res.status(403).json({ message: "Not authorized to update this order" });
        }

        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating payment status", error: error.message });
    }
};
