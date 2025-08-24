import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUserProductsMode, setIsUserProductsMode] = useState(false);

  // Fetch all available categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/shop/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Fetch products with optional category filter
  const fetchProducts = async (category = null) => {
    try {
      setLoading(true);
      setError(null);
      setIsUserProductsMode(false); // Reset flag when fetching all products
      
      const categoryToUse = category !== null ? category : selectedCategory;
      const url = categoryToUse === 'all' 
        ? '/shop/products' 
        : `/shop/products?category=${encodeURIComponent(categoryToUse)}`;
      
      const response = await api.get(url);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's own products (for merchants)
  const fetchUserProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsUserProductsMode(true); // Set flag to prevent automatic fetching
      const response = await api.get('/shop/user-products');
      setProducts(response.data);
    } catch (err) {
      console.error('❌ Error fetching user products:', err);
      setError('Failed to fetch your products');
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter products by category
  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  // Effect to fetch products when selectedCategory changes
  useEffect(() => {
    // Only auto-fetch if we're not in user products mode
    if (!isUserProductsMode) {
      fetchProducts();
    }
  }, [selectedCategory, isUserProductsMode]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      setIsInitialized(true);
      // Initial products will be fetched by the selectedCategory effect
    };
    initializeData();
  }, []);

  // Add a new product
  const addProduct = async (productData) => {
    try {
      const response = await api.post('/shop/add-product', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product added successfully!');
      
      // If we're in user products mode, refresh the user's products
      if (isUserProductsMode) {
        await fetchUserProducts();
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add product';
      toast.error(message);
      throw error;
    }
  };

  // Update a product
  const updateProduct = async (productId, productData) => {
    try {
      const response = await api.put(`/shop/product/${productId}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
      throw error;
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await api.delete(`/shop/product/${productId}`);
      toast.success('Product deleted successfully!');
      // Refresh the products list
      fetchUserProducts();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      toast.error(message);
      throw error;
    }
  };

  // Update product quantity in local state (for real-time updates)
  const updateProductQuantity = (productId, newQuantity) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product._id === productId 
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  // Refresh products (useful after operations that might change quantities)
  const refreshProducts = async () => {
    if (isUserProductsMode) {
      await fetchUserProducts();
    } else if (selectedCategory === 'all') {
      await fetchProducts();
    } else {
      await fetchProducts(selectedCategory);
    }
  };

  // Switch back to general products mode
  const switchToGeneralProducts = useCallback(() => {
    setIsUserProductsMode(false);
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // Get single product by ID
  const getProductById = async (productId) => {
    try {
      const response = await api.get(`/shop/product/${productId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    // State
    products,
    categories,
    selectedCategory,
    loading,
    error,
    isInitialized,
    isUserProductsMode,
    
    // Actions
    fetchProducts,
    fetchUserProducts,
    fetchCategories,
    filterByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    updateProductQuantity,
    refreshProducts,
    switchToGeneralProducts,
    setSelectedCategory,
    setProducts,
    setLoading,
    setError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
