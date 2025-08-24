// API Configuration
// Use relative URLs in development to take advantage of Vite proxy
// Use full URLs in production
const isDevelopment = import.meta.env.DEV;
export const API_BASE_URL = isDevelopment 
  ? '' // Use relative URLs in dev (proxy handles it)
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

// Asset URL helper function
export const getAssetUrl = (path) => {
  if (!path) return '';
  
  // If path already includes http, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // In development, use relative paths (Vite proxy)
  // In production, use full URLs
  if (isDevelopment) {
    // If path starts with /, return as is (proxy will handle)
    if (path.startsWith('/')) {
      return path;
    }
    // Otherwise add / prefix
    return `/${path}`;
  } else {
    // Production: use full URLs
    if (path.startsWith('/')) {
      return `${API_BASE_URL}${path}`;
    }
    return `${API_BASE_URL}/${path}`;
  }
};
