import { useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const PaymentForm = ({ 
  amount, 
  cartItems,
  deliveryAddress,
  phoneNumber,
  onSuccess, 
  onError, 
  isProcessing = false,
  setIsProcessing
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Expose the submit function globally so Checkout can call it
    window.handlePaymentSubmit = handleSubmit;
    
    return () => {
      // Cleanup
      delete window.handlePaymentSubmit;
    };
  }, [amount, cartItems, deliveryAddress, phoneNumber, isProcessing]);

  const handleElementChange = (element, field) => (event) => {
    if (event.error) {
      setErrors(prev => ({ ...prev, [field]: event.error.message }));
    } else {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    console.log('=== PAYMENT SUBMIT STARTED ===');
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('User in localStorage:', localStorage.getItem('user'));

    if (!stripe || !elements) {
      console.error('Stripe not ready');
      toast.error('Stripe is not ready. Please try again.');
      return;
    }

    setLoading(true);
    if (setIsProcessing) setIsProcessing(true);

    try {
      console.log('Creating payment method...');
      // Create payment method
      const cardElement = elements.getElement(CardNumberElement);
      
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          phone: phoneNumber || '',
          address: {
            line1: deliveryAddress?.fullAddress || deliveryAddress?.address || '',
            city: deliveryAddress?.city || '',
            postal_code: deliveryAddress?.postalCode || '',
            country: 'IN', // India
          },
        },
      });

      if (methodError) {
        console.error('Payment method creation failed:', methodError);
        toast.error(methodError.message);
        if (onError) onError(methodError);
        return;
      }

      console.log('Payment method created:', paymentMethod);
      console.log('Calling backend API...');

      // Prepare the request payload
      const paymentPayload = {
        paymentMethodId: paymentMethod.id,
        totalAmount: amount, // Don't multiply by 100 here, backend handles currency conversion
        items: cartItems,
        deliveryAddress,
        phoneNumber
      };
      
      console.log('Payment payload:', paymentPayload);

      // Process payment through our backend
      const paymentResponse = await api.post('/payments/confirm', paymentPayload);

      console.log('Backend response:', paymentResponse);

      if (paymentResponse.data.success) {
        console.log('Payment successful!');
        toast.success('Payment successful!');
        if (onSuccess) {
          await onSuccess(paymentResponse.data.order);
        }
      } else {
        throw new Error(paymentResponse.data.message || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      toast.error(errorMessage);
      if (onError) onError(error);
    } finally {
      setLoading(false);
      if (setIsProcessing) setIsProcessing(false);
    }
  };

  const isLoading = loading || isProcessing;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Payment Details</h3>
        
        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleElementChange(CardNumberElement, 'cardNumber')}
            />
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        {/* Card Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <CardExpiryElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleElementChange(CardExpiryElement, 'cardExpiry')}
              />
            </div>
            {errors.cardExpiry && (
              <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleElementChange(CardCvcElement, 'cardCvc')}
              />
            </div>
            {errors.cardCvc && (
              <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-600">
              Your payment information is secure and encrypted.
            </p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">₹{amount?.toFixed(2)}</span>
        </div>
      </div>

      {/* Test Card Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Test Mode: Use card number 4242 4242 4242 4242 with any future expiry and CVC
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
