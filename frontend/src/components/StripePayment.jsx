import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

// Add debugging
stripePromise.then((stripe) => {
  if (stripe) {
    console.log('Stripe loaded successfully');
  } else {
    console.error('Stripe failed to load');
  }
});

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError, billingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardholderName, setCardholderName] = useState(billingDetails?.name || '');
  const [postalCode, setPostalCode] = useState(billingDetails?.address?.postal_code || '');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate required fields
    if (!cardholderName.trim()) {
      setCardError('Cardholder name is required');
      toast.error('Please enter cardholder name');
      return;
    }

    if (!postalCode.trim()) {
      setCardError('Postal code is required');
      toast.error('Please enter postal code');
      return;
    }

    setLoading(true);
    setCardError('');

    try {
      // Check if card elements are complete
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        setCardError('Please complete all card fields');
        toast.error('Please complete all card fields');
        setLoading(false);
        return;
      }

      // Create payment intent
      const { data } = await api.post('/payments/create-payment-intent', {
        amount: amount,
        currency: 'inr'
      });

      const { clientSecret } = data;

      // Confirm payment with card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: cardholderName,
            address: {
              postal_code: postalCode
            }
          },
        }
      });

      if (error) {
        console.error('Payment failed:', error);
        setCardError(error.message);
        toast.error(`Payment failed: ${error.message}`);
        onPaymentError(error);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        toast.success('Payment completed successfully!');
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setCardError('Payment processing failed');
      toast.error('Payment processing failed');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        lineHeight: '1.5',
        padding: '0',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      {!stripe && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">Loading Stripe...</p>
        </div>
      )}
      
      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name *
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter full name as on card"
          required
          autoComplete="cc-name"
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number *
        </label>
        <div className="w-full px-3 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white min-h-[48px] flex items-center">
          <div className="w-full">
            <CardNumberElement
              options={elementOptions}
              onChange={(e) => {
                if (e.error) {
                  setCardError(e.error.message);
                } else if (e.complete) {
                  setCardError('');
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Card Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date *
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
            <CardExpiryElement
              options={elementOptions}
              onChange={(e) => {
                if (e.error) {
                  setCardError(e.error.message);
                } else if (e.complete) {
                  setCardError('');
                }
              }}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVC *
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
            <CardCvcElement
              options={elementOptions}
              onChange={(e) => {
                if (e.error) {
                  setCardError(e.error.message);
                } else if (e.complete) {
                  setCardError('');
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Postal Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code *
        </label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter postal code"
          required
          autoComplete="postal-code"
        />
      </div>

      {/* Error Display */}
      {cardError && (
        <div className="text-red-600 text-sm">{cardError}</div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          loading || !stripe
            ? 'bg-gray-400 cursor-not-allowed text-gray-700'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } transition-colors duration-200`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay ₹${amount.toFixed(2)}`
        )}
      </button>
    </div>
  );
};

const StripePayment = ({ amount, onPaymentSuccess, onPaymentError, billingDetails }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm 
        amount={amount} 
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        billingDetails={billingDetails}
      />
    </Elements>
  );
};

export default StripePayment;
