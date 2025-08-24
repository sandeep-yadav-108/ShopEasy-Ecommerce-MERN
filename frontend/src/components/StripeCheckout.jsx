import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import CheckoutForm from './CheckoutForm';
import api from '../utils/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = ({ cartItems, totalAmount, onClose }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('StripeCheckout - Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  console.log('StripeCheckout - Total Amount:', totalAmount);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        console.log('Creating payment intent for amount:', totalAmount);
        const response = await api.post('/payments/create-payment-intent', {
          amount: totalAmount,
          currency: 'inr'
        });
        
        console.log('Payment intent response:', response.data);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
        setLoading(false);
      }
    };

    if (totalAmount > 0) {
      createPaymentIntent();
    }
  }, [totalAmount]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing payment...</p>
          <p className="mt-2 text-sm text-gray-500">
            Stripe Key: {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Found' : 'Missing'}
          </p>
          <p className="text-sm text-gray-500">
            Amount: ₹{totalAmount}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm 
            cartItems={cartItems}
            totalAmount={totalAmount}
            onClose={onClose}
          />
        </Elements>
      ) : (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">Payment initialization failed</p>
          <p className="text-sm text-gray-500 mb-4">
            Debug Info:<br/>
            Client Secret: {clientSecret || 'None'}<br/>
            Stripe Key: {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Found' : 'Missing'}<br/>
            Amount: ₹{totalAmount}
          </p>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeCheckout;
