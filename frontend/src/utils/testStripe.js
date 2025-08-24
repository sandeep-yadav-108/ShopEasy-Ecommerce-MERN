import { loadStripe } from '@stripe/stripe-js';

// Test Stripe loading
const testStripe = async () => {
  console.log('Testing Stripe...');
  console.log('VITE_STRIPE_PUBLISHABLE_KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  
  try {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (stripe) {
      console.log('✅ Stripe loaded successfully');
      return true;
    } else {
      console.error('❌ Stripe failed to load');
      return false;
    }
  } catch (error) {
    console.error('❌ Error loading Stripe:', error);
    return false;
  }
};

// Run test
testStripe();

export default testStripe;
