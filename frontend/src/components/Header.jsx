import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth.js';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const dropdownRef = useRef(null);

  // Debug authentication state changes
  useEffect(() => {
    console.log('Header - Auth state changed:', { isAuthenticated, user: user?.username });
    setRenderKey(prev => prev + 1);
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    console.log('Header - Logout clicked');
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    // Force a re-render after logout
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 100);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header key={`header-${renderKey}-${isAuthenticated ? 'auth' : 'unauth'}`} className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300">
              <span className="flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8H18" />
                </svg>
                ShopEasy
              </span>
            </Link>
            
            {/* Practice Project Disclaimer */}
            <div className="hidden lg:flex items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative px-4 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white text-sm font-bold rounded-2xl flex items-center space-x-2 shadow-lg">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                    DEMO PROJECT
                  </span>
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl">
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                  🎯 Practice Project - All products are dummies  for purpose of demonstration
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className="group flex items-center text-slate-700 hover:text-blue-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-blue-50">
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold">Home</span>
            </Link>
            <Link to="/products" className="group flex items-center text-slate-700 hover:text-blue-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-blue-50">
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-semibold">Products</span>
            </Link>
            
            {/* Mobile Demo Badge - visible on medium and smaller screens */}
            <div className="md:flex lg:hidden items-center ml-4">
              <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>DEMO</span>
              </div>
            </div>
            
            {/* Debug: Show current auth status */}
            {console.log('Header render - isAuthenticated:', isAuthenticated, 'user role:', user?.role)}
            
            {/* Role-based navigation */}
            {isAuthenticated === true && (
              <>
                {/* Cart - available only for consumers */}
                {user?.role === 'consumer' && (
                  <Link to="/cart" className="group flex items-center text-slate-700 hover:text-emerald-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-emerald-50">
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <span className="font-semibold">Cart</span>
                  </Link>
                )}

                {/* Consumer-only links */}
                {user?.role === 'consumer' && (
                  <Link to="/my-orders" className="group flex items-center text-slate-700 hover:text-indigo-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-indigo-50">
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="font-semibold">My Orders</span>
                  </Link>
                )}
                
                {/* Merchant-only links */}
                {user?.role === 'merchant' && (
                  <>
                    <Link to="/merchant-dashboard" className="group flex items-center text-slate-700 hover:text-purple-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-purple-50">
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-semibold">Dashboard</span>
                    </Link>
                    <Link to="/add-product" className="group flex items-center text-slate-700 hover:text-green-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-green-50">
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-semibold">Add Product</span>
                    </Link>
                    <Link to="/manage-products" className="group flex items-center text-slate-700 hover:text-orange-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-orange-50">
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold">Manage Products</span>
                    </Link>
                    <Link to="/manage-orders" className="group flex items-center text-slate-700 hover:text-purple-600 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-purple-50">
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold">Orders</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Enhanced Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated === true ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group relative flex items-center space-x-3 text-slate-700 hover:text-blue-600 focus:outline-none bg-gradient-to-r from-white/80 via-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 px-5 py-3 rounded-2xl border border-slate-200/70 hover:border-blue-300/70 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300"
                >
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced avatar with role-based colors */}
                  <div className={`relative w-12 h-12 ${
                    user?.role === 'merchant' 
                      ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600' 
                      : user?.role === 'admin' 
                        ? 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600'
                        : 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600'
                  } rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                    {/* User initials or icon */}
                    {user?.fullname ? (
                      <span className="text-white font-bold text-lg">
                        {user.fullname.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    ) : (
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Enhanced user info */}
                  <div className="hidden sm:block text-left relative">
                    <div className="font-bold text-slate-900 text-sm leading-tight">
                      {user?.fullname || user?.username}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${
                        user?.role === 'merchant' ? 'bg-purple-500' : 
                        user?.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-xs text-slate-500 capitalize font-medium">
                        {user?.role || 'Consumer'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced dropdown arrow */}
                  <div className="relative">
                    <svg
                      className={`w-5 h-5 transition-all duration-300 ${
                        isDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 py-3 z-50 overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    {/* User info header */}
                    <div className="px-6 py-4 border-b border-slate-100/70">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 ${
                          user?.role === 'merchant' 
                            ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600' 
                            : user?.role === 'admin' 
                              ? 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600'
                              : 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600'
                        } rounded-2xl flex items-center justify-center shadow-lg relative`}>
                          {user?.fullname ? (
                            <span className="text-white font-bold text-xl">
                              {user.fullname.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          ) : (
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-lg leading-tight">
                            {user?.fullname || user?.username}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user?.role === 'merchant' ? 'bg-purple-100 text-purple-700' : 
                              user?.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                user?.role === 'merchant' ? 'bg-purple-500' : 
                                user?.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                              }`}></div>
                              <span className="capitalize">{user?.role || 'Consumer'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced menu items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 rounded-xl flex items-center justify-center mr-3 transition-all duration-200">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold">My Profile</div>
                          <div className="text-xs text-slate-500">View and edit your profile</div>
                        </div>
                      </Link>
                      
                      {user?.role === 'consumer' && (
                        <Link
                          to="/my-orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 rounded-xl flex items-center justify-center mr-3 transition-all duration-200">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold">My Orders</div>
                            <div className="text-xs text-slate-500">Track your purchases</div>
                          </div>
                        </Link>
                      )}
                      
                      {user?.role === 'merchant' && (
                        <Link
                          to="/merchant-dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 rounded-xl flex items-center justify-center mr-3 transition-all duration-200">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold">Dashboard</div>
                            <div className="text-xs text-slate-500">Manage your business</div>
                          </div>
                        </Link>
                      )}
                    </div>
                    
                    {/* Logout section */}
                    <div className="border-t border-slate-100/70 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="group flex items-center w-full text-left px-6 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 group-hover:from-red-200 group-hover:to-pink-200 rounded-xl flex items-center justify-center mr-3 transition-all duration-200">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold">Logout</div>
                          <div className="text-xs text-slate-500">Sign out of your account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
