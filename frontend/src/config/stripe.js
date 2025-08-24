// Stripe configuration
export const STRIPE_CONFIG = {
  // Use test keys for development
  PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here',
  
  // Stripe options
  options: {
    // You can customize Stripe Elements here
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter'
      }
    ]
  }
};

// Payment method types to accept
export const PAYMENT_METHOD_TYPES = ['card'];

// Currency
export const CURRENCY = 'inr'; // Use INR for Indian Rupees

// Minimum amount (in paisa for INR)
export const MINIMUM_AMOUNT = 5000; // ₹50 minimum
