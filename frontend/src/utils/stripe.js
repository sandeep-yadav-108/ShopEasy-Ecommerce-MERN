import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

const stripePromise = loadStripe(stripePublishableKey);

export default stripePromise;

// Currency and payment configurations
export const STRIPE_CONFIG = {
  currency: 'inr',
  country: 'IN',
  // Minimum amount for payments (₹50 in paisa)
  minimumAmount: 5000,
  // Maximum amount for payments (₹100,000 in paisa)  
  maximumAmount: 10000000
};
