// Environment validation for backend
const requiredEnvVars = ['MONGO_DB_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }
  
  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long for security');
  }
  
  // Validate Stripe key format
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    console.warn('⚠️  STRIPE_SECRET_KEY should start with "sk_"');
  }
  
  console.log('✅ Environment variables validated successfully');
};
