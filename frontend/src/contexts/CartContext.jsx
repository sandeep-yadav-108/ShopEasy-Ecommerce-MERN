import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [error, setError] = useState(null);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) {
        setCart({
          items: [],
          totalAmount: 0,
          totalItems: 0
        });
        setLoading(false);
        return;
      }

      const response = await api.post('/cart/get-items', { userId });
      
      if (response.data) {
        setCart({
          items: response.data.items || [],
          totalAmount: response.data.totalAmount || 0,
          totalItems: response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0
        });
      } else {
        setCart({
          items: [],
          totalAmount: 0,
          totalItems: 0
        });
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      if (err.response?.status !== 404) {
        setError('Failed to fetch cart');
        toast.error('Failed to load cart');
      }
      // If cart doesn't exist (404), that's fine - user has empty cart
      setCart({
        items: [],
        totalAmount: 0,
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) {
        toast.error('Please login to add items to cart');
        return false;
      }

      const response = await api.post('/cart/add-item', {
        userId,
        productId,
        quantity
      });
      
      // Update with server response
      if (response.data) {
        setCart({
          items: response.data.items || [],
          totalAmount: response.data.totalAmount || 0,
          totalItems: response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0
        });
      }
      
      toast.success('Added to cart!', {
        icon: '🛒',
      });
      
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('own products')) {
        toast.error('You cannot add your own products to cart');
      } else {
        toast.error('Failed to add to cart');
      }
      return false;
    }
  };

  // Update item quantity in cart
  const updateCartItem = async (productId, quantity) => {
    try {
      // Add item to updating set
      setUpdatingItems(prev => new Set([...prev, productId]));
      
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) {
        toast.error('Please login to update cart');
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        return;
      }

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const response = await api.post('/cart/update-quantity', {
        userId,
        productId,
        quantity
      });
      
      // Update with server response (authoritative)
      if (response.data) {
        setCart({
          items: response.data.items || [],
          totalAmount: response.data.totalAmount || 0,
          totalItems: response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0
        });
      }
      
      toast.success('Cart updated!');
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error('Failed to update cart');
      // Refresh cart on error to get correct state
      await fetchCart();
    } finally {
      // Remove from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) {
        toast.error('Please login to remove items');
        return;
      }

      const response = await api.post('/cart/remove-item', {
        userId,
        productId
      });
      
      // Update with server response
      if (response.data) {
        setCart({
          items: response.data.items || [],
          totalAmount: response.data.totalAmount || 0,
          totalItems: response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0
        });
      }
      
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Failed to remove item');
      // Refresh cart on error to get correct state
      await fetchCart();
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (!userId) {
        toast.error('Please login to clear cart');
        return;
      }

      await api.post('/cart/clear', { userId });
      setCart({
        items: [],
        totalAmount: 0,
        totalItems: 0
      });
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    }
  };

  // Get cart item count for a specific product
  const getCartItemQuantity = (productId) => {
    const item = cart.items.find(item => item.productId._id === productId);
    return item ? item.quantity : 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.items.some(item => item.productId._id === productId);
  };

  // Calculate cart totals (in case backend doesn't provide them)
  const calculateTotals = () => {
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtTime * item.quantity);
    }, 0);
    
    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return { totalAmount, totalItems };
  };

  // Initialize cart on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const value = {
    // State
    cart,
    loading,
    error,
    updatingItems,
    
    // Computed values
    cartItems: cart.items,
    totalAmount: cart.totalAmount,
    totalItems: cart.totalItems, // Use server-calculated totalItems
    isEmpty: cart.items.length === 0,
    
    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemQuantity,
    isInCart,
    calculateTotals,
    
    // Setters (for manual state updates if needed)
    setCart,
    setLoading,
    setError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
