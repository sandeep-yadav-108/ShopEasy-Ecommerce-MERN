import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customer orders
  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/orders/customer');
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch merchant orders
  const fetchMerchantOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/orders/merchant');
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching merchant orders:', err);
      setError('Failed to fetch merchant orders');
      toast.error('Failed to load merchant orders');
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await api.post('/orders/create', orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        // Refresh orders
        await fetchCustomerOrders();
        return response.data.order;
      }
    } catch (error) {
      console.error('Order error:', error);
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.put(`/orders/${orderId}/cancel`);
      
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update order status (for merchants)
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const response = await api.put(`/orders/merchant/${orderId}/status`, { status });
      
      if (response.data.success) {
        toast.success(`Order status updated to ${status}`);
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      console.error('Error fetching order:', error);
      const message = error.response?.data?.message || 'Failed to fetch order';
      toast.error(message);
      throw error;
    }
  };

  // Get merchant analytics
  const getMerchantAnalytics = async () => {
    try {
      const response = await api.get('/orders/merchant/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      toast.error(message);
      throw error;
    }
  };

  // Filter orders by status
  const filterOrdersByStatus = (status) => {
    if (status === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === status);
  };

  // Get order statistics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const processingOrders = orders.filter(order => order.status === 'processing').length;
    const shippedOrders = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    
    const totalRevenue = orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    };
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'processing';
  };

  const value = {
    // State
    orders,
    loading,
    error,
    
    // Computed values
    orderStats: getOrderStats(),
    
    // Actions
    fetchCustomerOrders,
    fetchMerchantOrders,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    getOrderById,
    getMerchantAnalytics,
    filterOrdersByStatus,
    canCancelOrder,
    
    // Setters
    setOrders,
    setLoading,
    setError
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
