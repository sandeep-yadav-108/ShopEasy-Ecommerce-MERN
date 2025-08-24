import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProducts } from '../contexts/ProductContext';

const ManageProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [componentInitialized, setComponentInitialized] = useState(false);
  const { 
    products, 
    categories, 
    loading, 
    isInitialized: contextInitialized,
    isUserProductsMode,
    fetchUserProducts, 
    fetchCategories, 
    deleteProduct,
    setProducts, // Add this to clear products initially
    switchToGeneralProducts // Add this for cleanup
  } = useProducts();

  // Filter products by category locally since we're dealing with user's products
  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Initialize component data only once when context is ready
  useEffect(() => {
    if (contextInitialized && !componentInitialized) {
      const initializeComponent = async () => {
        try {
          console.log('🔧 Initializing ManageProducts component...');
          // Clear any existing products first to prevent showing other merchants' products
          setProducts([]);
          await fetchUserProducts();
          setComponentInitialized(true);
          console.log('✅ ManageProducts component initialized');
        } catch (error) {
          console.error('❌ Error initializing ManageProducts:', error);
        }
      };
      initializeComponent();
    }
  }, [contextInitialized, componentInitialized]);

  // Add an effect to refresh products when coming back to this page
  useEffect(() => {
    // If the component is already initialized and we're in user products mode,
    // refresh the products to catch any newly added products
    if (componentInitialized && isUserProductsMode) {
      fetchUserProducts();
    }
  }, []); // Run only once when component mounts

  // Add effect to refresh products when page becomes visible (user returns from adding product)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && componentInitialized && isUserProductsMode) {
        console.log('🔄 Page became visible, refreshing products...');
        fetchUserProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [componentInitialized, isUserProductsMode, fetchUserProducts]);

  // Cleanup effect to reset mode when component unmounts
  useEffect(() => {
    return () => {
      // Reset to general products mode when leaving this page
      if (isUserProductsMode) {
        switchToGeneralProducts();
      }
    };
  }, []); // Remove dependencies to prevent re-runs

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await deleteProduct(productId);
      // The context will handle refreshing the products list
    } catch (error) {
      // Error handling is done in the context
    }
  };

  if (!componentInitialized || (loading && products.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Products</h1>
            <p className="text-gray-600">View, edit, and delete your products. <Link to="/merchant-dashboard" className="text-blue-600 hover:text-blue-800 underline">View sales analytics</Link></p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchUserProducts}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              to="/add-product"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-4V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory === 'all' 
                ? "You haven't added any products yet." 
                : `No products found in ${selectedCategory} category.`}
            </p>
            <Link
              to="/add-product"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            {product.images?.[0] ? (
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={product.images[0]}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                              style={{ display: product.images?.[0] ? 'none' : 'flex' }}
                            >
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4 max-w-xs">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.quantity > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.quantity > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.quantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/edit-product/${product._id}`}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
