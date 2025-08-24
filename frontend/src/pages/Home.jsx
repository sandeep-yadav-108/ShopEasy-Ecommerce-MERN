import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { products, categories, loading } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Get featured products (latest 6 products)
    if (products.length > 0) {
      const featured = products.slice(0, 6);
      setFeaturedProducts(featured);
    }
  }, [products]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with unique design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-700/20"></div>
          <div className="absolute inset-0 bg-dots opacity-10"></div>
          {/* Large decorative circles */}
          <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-10">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold text-sm rounded-full mb-6 animate-bounce">
                🛍️ Welcome to the Future of Shopping
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight">
              Discover{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                ShopEasy
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Where Dreams Shop
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the next generation of e-commerce. Connect with amazing merchants, 
              discover unique products, and enjoy a shopping journey like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/products"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-bold text-xl rounded-3xl hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-yellow-500/25"
              >
                <svg className="w-7 h-7 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping Now
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center px-10 py-5 bg-white/10 backdrop-blur-md text-white font-semibold text-xl rounded-3xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <svg className="w-7 h-7 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Join the Community
              </Link>
            </div>
            
            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">1000+</div>
                <div className="text-blue-200 font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">500+</div>
                <div className="text-blue-200 font-medium">Amazing Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">50+</div>
                <div className="text-blue-200 font-medium">Trusted Merchants</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements with different animations */}
        <div className="absolute top-32 left-16 animate-float">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-70 rotate-12"></div>
        </div>
        <div className="absolute top-48 right-20 animate-float-delayed">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-32 left-32 animate-float-slow">
          <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg opacity-50 rotate-45"></div>
        </div>
        <div className="absolute bottom-48 right-16 animate-bounce">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl opacity-60 -rotate-12"></div>
        </div>
      </section>

      {/* Features Section with unique glass morphism design */}
      <section className="py-32 bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/50 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-full mb-6">
              ✨ Premium Features
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                ShopEasy?
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience shopping reimagined with cutting-edge features designed for modern consumers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Lightning Fast",
                description: "Express delivery within 24 hours to your doorstep",
                gradient: "from-yellow-400 to-orange-500",
                bgGradient: "from-yellow-50 to-orange-50",
                borderGradient: "from-yellow-200 to-orange-200"
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Premium Quality",
                description: "Hand-curated products from verified merchants worldwide",
                gradient: "from-emerald-400 to-green-500",
                bgGradient: "from-emerald-50 to-green-50",
                borderGradient: "from-emerald-200 to-green-200"
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Bank-Level Security",
                description: "Advanced encryption protects your data and payments",
                gradient: "from-blue-400 to-indigo-500",
                bgGradient: "from-blue-50 to-indigo-50",
                borderGradient: "from-blue-200 to-indigo-200"
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "24/7 Love & Care",
                description: "Dedicated support team ready to help anytime, anywhere",
                gradient: "from-pink-400 to-rose-500",
                bgGradient: "from-pink-50 to-rose-50",
                borderGradient: "from-pink-200 to-rose-200"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-8 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-lg rounded-3xl border border-gradient-to-br ${feature.borderGradient} hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden`}
                style={{
                  animation: `slideInUp 0.8s ease-out ${index * 0.2}s both`
                }}
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Hover effect overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Unique to Home page */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/10 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-full mb-6">
              💖 Customer Love
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of happy customers who trust ShopEasy for their shopping needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Enthusiast",
                avatar: "SJ",
                rating: 5,
                content: "ShopEasy has completely transformed my shopping experience! The quality is outstanding and delivery is incredibly fast. I've saved so much time and money!",
                gradient: "from-pink-400 to-rose-500"
              },
              {
                name: "Michael Chen",
                role: "Tech Professional",
                avatar: "MC",
                rating: 5,
                content: "The security features give me complete peace of mind. I love how easy it is to find exactly what I need. Customer service is phenomenal - they really care!",
                gradient: "from-blue-400 to-indigo-500"
              },
              {
                name: "Emma Williams",
                role: "Busy Mom",
                avatar: "EW",
                rating: 5,
                content: "As a working mom, ShopEasy is a lifesaver! The app is so intuitive and the kids love helping me shop. Quality products, great prices, what more could you want?",
                gradient: "from-emerald-400 to-green-500"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-500"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.3}s both`
                }}
              >
                {/* Stars */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                
                <p className="text-white/90 text-lg leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-slate-300">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Decorative quote mark */}
                <div className="absolute top-6 right-6 text-6xl text-white/10 font-serif">"</div>
              </div>
            ))}
          </div>
          
          {/* Trust badges */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-8 bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-6 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">50K+</div>
                  <div className="text-slate-300 text-sm">Happy Customers</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">4.9/5</div>
                  <div className="text-slate-300 text-sm">Average Rating</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">99.9%</div>
                  <div className="text-slate-300 text-sm">Security Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover our handpicked selection of amazing products
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className="group bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        // Use relative uploads path; Vite dev proxy forwards to backend
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                        {product.brand}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{product.price}
                      </span>
                      {/* Check if user owns this product */}
                      {user && product.owner && user.id === product.owner._id ? (
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                        >
                          Edit
                        </Link>
                      ) : user?.role === 'consumer' ? (
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                        >
                          Add to Cart
                        </button>
                      ) : user?.role === 'merchant' ? (
                        <span className="text-slate-500 text-sm">View Only</span>
                      ) : (
                        <Link
                          to="/login"
                          className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg rounded-2xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                View All Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                Shop by Category
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Find exactly what you're looking for in our organized categories
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {categories.slice(0, 6).map((category, index) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className="group p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 capitalize group-hover:text-blue-600 transition-colors duration-300">
                    {category}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced CTA Section - Unique design */}
      <section className="py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/20 to-transparent"></div>
          {/* Floating geometric shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-2 border-white/30 rounded-lg rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-16 h-16 border-2 border-white/25 transform rotate-12 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Glowing badge */}
          <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-lg text-white font-bold text-sm rounded-full mb-8 border border-white/30">
            🚀 Ready to Transform Your Shopping?
          </div>
          
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
            Start Your
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Amazing Journey
            </span>
            Today!
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join millions of satisfied customers and discover a shopping experience like no other. 
            <span className="font-semibold text-yellow-300"> Your perfect products are just one click away!</span>
          </p>
          
          {/* CTA Buttons with enhanced design */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link 
              to="/products"
              className="group relative px-12 py-5 bg-white text-indigo-600 font-bold text-lg rounded-2xl hover:bg-yellow-300 hover:text-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center">
                🛍️ Shop Now
                <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/register" 
              className="group px-12 py-5 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-lg bg-white/10"
            >
              <span className="flex items-center">
                ✨ Join ShopEasy
                <svg className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-semibold">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-semibold">Secure Payments</span>
            </div>
          </div>
        </div>
      </section>

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
        
        .bg-dots {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
          background-size: 60px 60px;
        }
      `}</style>
    </div>
  );
};

export default Home;
