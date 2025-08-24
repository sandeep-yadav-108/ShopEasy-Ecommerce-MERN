import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import { getAssetUrl } from '../utils/config';

const ProductCard = ({ product, index }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const isOwner = user && product.owner && user.id === product.owner._id;

  return (
    <div 
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
            src={getAssetUrl(product.images[0])}
            alt={product.name}
            onError={(e) => {
              console.log('ProductCard - Image failed to load:', getAssetUrl(product.images[0]));
              console.log('ProductCard - Original path:', product.images[0]);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
            onLoad={() => {
              console.log('ProductCard - Image loaded successfully:', getAssetUrl(product.images[0]));
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
        {isOwner ? (
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
  );
};

export default ProductCard;
