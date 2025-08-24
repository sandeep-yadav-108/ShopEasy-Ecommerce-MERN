import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';

const CheckoutForm = ({ cartItems = [], totalAmount = 0, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  console.log('CheckoutForm - Stripe loaded:', !!stripe);
  console.log('CheckoutForm - Elements loaded:', !!elements);
  
  const [loading, setLoading] = useState(false);
  const [useCurrentAddress, setUseCurrentAddress] = useState(true);
  const [orderData, setOrderData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  });

  // Initialize based on whether user has an address
  useEffect(() => {
    if (!user?.address) {
      setUseCurrentAddress(false);
    }
  }, [user]);

  const handleAddressToggle = (useCurrent) => {
    setUseCurrentAddress(useCurrent);
    if (!useCurrent) {
      setOrderData(prev => ({
        ...prev,
        address: '',
        city: '',
        postalCode: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate address
    if (useCurrentAddress) {
      if (!user?.address) {
        toast.error('No current address found. Please add a new address.');
        return;
      }
      if (!orderData.phoneNumber) {
        toast.error('Please fill in your phone number');
        return;
      }
    } else {
      if (!orderData.address || !orderData.city || !orderData.postalCode || !orderData.phoneNumber) {
        toast.error('Please fill in all delivery details');
        return;
      }
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment failed:', error);
        toast.error(error.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful, create the order
        const deliveryAddress = useCurrentAddress 
          ? {
              fullAddress: user.address,
              address: user.address,
              city: '',
              postalCode: ''
            }
          : {
              fullAddress: `${orderData.address}, ${orderData.city}, ${orderData.postalCode}`,
              address: orderData.address,
              city: orderData.city,
              postalCode: orderData.postalCode
            };

        const orderPayload = {
          items: cartItems.map(item => ({
            product: item.productId._id,
            quantity: item.quantity,
            price: item.priceAtTime,
            merchant: item.productId.seller
          })),
          totalAmount,
          deliveryAddress,
          phoneNumber: orderData.phoneNumber,
          paymentMethod: 'card',
          paymentIntentId: paymentIntent.id,
          paymentStatus: 'completed'
        };

        const response = await api.post('/orders/create', orderPayload);
        
        if (response.data.success) {
          toast.success('Order placed successfully!');
          await clearCart();
          navigate('/my-orders');
          if (onClose) onClose();
        }
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Checkout</h2>
        <p className="text-gray-600">Complete your order with secure payment</p>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 mb-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>{item.productId?.name} × {item.quantity}</span>
              <span>₹{(item.priceAtTime * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Address Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        
        {user?.address && (
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={useCurrentAddress}
                onChange={() => handleAddressToggle(true)}
                className="text-blue-600"
              />
              <span className="text-sm font-medium">Use current address</span>
            </label>
            {useCurrentAddress && (
              <div className="ml-6 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">{user.address}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!useCurrentAddress}
              onChange={() => handleAddressToggle(false)}
              className="text-blue-600"
            />
            <span className="text-sm font-medium">Add new address</span>
          </label>
          
          {!useCurrentAddress && (
            <div className="ml-6 space-y-3">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={orderData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!useCurrentAddress}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={orderData.city}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!useCurrentAddress}
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={orderData.postalCode}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!useCurrentAddress}
                />
              </div>
            </div>
          )}
        </div>

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={orderData.phoneNumber}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <div className="p-4 border border-gray-300 rounded-md">
          {stripe && elements ? (
            <PaymentElement 
              options={{
                layout: 'tabs'
              }}
            />
          ) : (
            <div className="text-center py-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Loading payment form...</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ₹${totalAmount.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
