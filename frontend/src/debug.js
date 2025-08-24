// Debug Payment Form - Add this temporarily to check what's happening
console.log('=== PAYMENT FORM DEBUG ===');
console.log('Stripe loaded:', window.Stripe);
console.log('Environment variables:', import.meta.env);
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Stripe key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Test API connection
fetch('http://localhost:5000/api')
  .then(response => {
    console.log('Backend connection test:', response.status);
    return response.text();
  })
  .then(text => console.log('Backend response:', text))
  .catch(error => console.error('Backend connection error:', error));
