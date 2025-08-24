import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useEffect } from 'react';

/**
 * Custom hook to synchronize product and cart contexts
 * This ensures product quantities are updated when cart operations occur
 */
export const useContextSync = () => {
  const { refreshProducts } = useProducts();
  const { cart } = useCart();

  // Refresh products when cart changes significantly
  useEffect(() => {
    let timeoutId;
    
    // Debounce the refresh to avoid too many API calls
    if (cart.items.length > 0) {
      timeoutId = setTimeout(() => {
        refreshProducts();
      }, 1000); // Refresh after 1 second of inactivity
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [cart.totalItems, refreshProducts]);

  return {
    syncContexts: refreshProducts
  };
};

export default useContextSync;
