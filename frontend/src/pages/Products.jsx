import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const { user } = useAuth();
  const { fetchProducts } = useProducts();
  const { 
    products, 
    categories, 
    selectedCategory, 
    loading, 
    error, 
    filterByCategory 
  } = useProducts();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-slate-200 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-24 w-24 border-4 border-transparent border-t-indigo-400 mx-auto animate-spin" style={{animationDelay: '150ms'}}></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium text-lg">Discovering amazing products...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md mx-auto border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Explore our curated collection of premium products from trusted merchants worldwide
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                <p className="text-white/90 font-medium">
                  🚀 Free shipping on orders over $50 • 🔒 Secure payments • ⭐ Trusted by thousands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Shop by Category</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => filterByCategory('all')}
              className={`group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                All Products
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterByCategory(category)}
                className={`group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">No products found</h3>
            <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
              {selectedCategory === 'all' 
                ? "No products are available at the moment. Our merchants are working hard to stock amazing items for you!" 
                : `No products found in ${selectedCategory} category. Try exploring other categories or check back soon.`}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="text-slate-600 text-lg">
                {selectedCategory === 'all' 
                  ? `Showing ${products.length} amazing products`
                  : `Found ${products.length} products in ${selectedCategory}`
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div 
                  key={product._id} 
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-slate-100"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Product Image */}
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {product.images && product.images.length > 0 ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
                      style={{ display: product.images?.[0] ? 'none' : 'flex' }}
                    >
                      <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/95 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Stock Badge */}
                    <div className="absolute top-6 right-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg ${
                        product.quantity > 10 
                          ? 'bg-emerald-100/95 text-emerald-700' 
                          : product.quantity > 0 
                          ? 'bg-amber-100/95 text-amber-700' 
                          : 'bg-red-100/95 text-red-700'
                      }`}>
                        {product.quantity > 0 ? `${product.quantity} left` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-8">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{product.brand}</p>
                      {product.owner && (
                        <div className="flex items-center text-xs text-slate-400 mt-2">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Sold by {product.owner.fullname}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                    
                    {/* Check if user owns this product */}
                    {user && product.owner && user.id === product.owner._id ? (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm mb-3">This is your product</p>
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Product
                        </Link>
                      </div>
                    ) : user?.role === 'consumer' ? (
                      <button
                        onClick={() => addToCart(product._id)}
                        disabled={product.quantity === 0}
                        className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                          product.quantity > 0
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl shadow-blue-500/25'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {product.quantity > 0 ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8H18" />
                            </svg>
                            Add to Cart
                          </span>
                        ) : (
                          'Out of Stock'
                        )}
                      </button>
                    ) : user?.role === 'merchant' ? (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">Sold by another merchant</p>
                        <div className="mt-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                          View Only
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">Please log in to purchase</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Products;
