import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import StripePayment from './StripePayment';

const Checkout = ({ cartItems = [], totalAmount = 0, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [useCurrentAddress, setUseCurrentAddress] = useState(true);
  const [orderData, setOrderData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  // Initialize based on whether user has an address
  useEffect(() => {
    if (!user?.address) {
      setUseCurrentAddress(false);
    }
  }, [user]);

  // Handle address selection change
  const handleAddressToggle = (useCurrent) => {
    setUseCurrentAddress(useCurrent);
    // Clear the form fields when switching to avoid confusion
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
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    // Only allow numbers for CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }

    setOrderData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleStripePaymentSuccess = async (paymentIntent) => {
    try {
      setLoading(true);
      
      // Prepare delivery address based on selection
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
        paymentStatus: 'paid',
        stripePaymentIntentId: paymentIntent.id
      };

      const response = await api.post('/orders/create', orderPayload);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate('/my-orders');
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePaymentError = (error) => {
    console.error('Stripe payment error:', error);
    setLoading(false);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate based on address selection
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

    // Note: Card validation is now handled by Stripe Elements

    try {
      setLoading(true);
      
      // Prepare delivery address based on selection
      const deliveryAddress = useCurrentAddress 
        ? {
            // Use the full address from user signup directly
            fullAddress: user.address,
            address: user.address, // Keep for compatibility
            city: '', // Not needed when using full address
            postalCode: '' // Not needed when using full address
          }
        : {
            fullAddress: `${orderData.address}, ${orderData.city}, ${orderData.postalCode}`,
            address: orderData.address,
            city: orderData.city,
            postalCode: orderData.postalCode
          };

      // Process payment based on method
      let paymentStatus = 'pending';
      let stripePaymentIntentId = null;
      
      if (orderData.paymentMethod === 'card') {
        // For card payments, the Stripe form will handle payment processing inline
        toast.error('Please complete the card payment form below.');
        setLoading(false);
        return;
      } else if (orderData.paymentMethod === 'cash') {
        paymentStatus = 'pending'; // COD payments remain pending until delivery
      } else if (orderData.paymentMethod === 'paypal') {
        paymentStatus = 'paid'; // PayPal would typically be paid immediately
      }

      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.productId._id,
          quantity: item.quantity,
          price: item.priceAtTime,
          merchant: item.productId.seller // assuming seller is the merchant ID
        })),
        totalAmount,
        deliveryAddress,
        phoneNumber: orderData.phoneNumber,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: paymentStatus,
        stripePaymentIntentId: stripePaymentIntentId // Store Stripe payment intent ID
      };

      const response = await api.post('/orders/create', orderPayload);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        // Clear cart after successful order
        await clearCart();
        navigate('/my-orders');
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h2>
        <p className="text-gray-600">Complete your order details</p>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Delivery Address</h3>
        <div className="space-y-3">
          {/* Use Current Address Option */}
          {user?.address ? (
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="currentAddress"
                name="addressOption"
                checked={useCurrentAddress}
                onChange={() => handleAddressToggle(true)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-900 cursor-pointer mb-2">
                  Use my registered address
                </label>
                <div className="p-3 bg-white rounded-md border border-gray-200">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-700 leading-relaxed">{user.address}</p>
                  </div>
                  <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                    ✓ Address from your account signup
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  No saved address found. Please add your delivery address below.
                </p>
              </div>
            </div>
          )}
          
          {/* Add New Address Option */}
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="newAddress"
              name="addressOption"
              checked={!useCurrentAddress}
              onChange={() => handleAddressToggle(false)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="newAddress" className="block text-sm font-medium text-gray-900 cursor-pointer">
              {user?.address ? 'Deliver to a different address' : 'Add delivery address'}
            </label>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        {/* Address Fields - only show when not using current address */}
        {!useCurrentAddress && (
          <>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={orderData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={orderData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Postal Code"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={orderData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={orderData.paymentMethod}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="cash">Cash on Delivery</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {/* Card Information Notice */}
        {orderData.paymentMethod === 'card' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900">Card Payment Details</h4>
            
            <StripePayment
              amount={totalAmount}
              onPaymentSuccess={handleStripePaymentSuccess}
              onPaymentError={handleStripePaymentError}
              billingDetails={{
                name: user?.fullname || '',
                address: {
                  postal_code: useCurrentAddress ? '' : orderData.postalCode
                }
              }}
            />
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          
          {/* Only show Place Order button for non-card payments */}
          {orderData.paymentMethod !== 'card' && (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Checkout;
