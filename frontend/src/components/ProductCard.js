import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const getMainImage = () => {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop';
  };

  const getPopularEmiPlan = () => {
    return product.emiPlans?.find(plan => plan.isPopular) || product.emiPlans?.[0];
  };

  const popularPlan = getPopularEmiPlan();
  const discountPercentage = Math.round(((product.mrp - product.basePrice) / product.mrp) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 card-hover overflow-hidden">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={getMainImage()}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop';
          }}
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
            {discountPercentage}% Off
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-dark-800 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-dark-500">{product.brand} • {product.category}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-dark-800">₹{product.basePrice.toLocaleString()}</span>
            {product.mrp > product.basePrice && (
              <span className="text-sm text-dark-400 line-through">₹{product.mrp.toLocaleString()}</span>
            )}
          </div>
        </div>

        {popularPlan && (
          <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 font-medium">Popular EMI Plan</p>
                <p className="text-lg font-bold text-primary-800">₹{popularPlan.monthlyAmount.toLocaleString()}/month</p>
                <p className="text-xs text-primary-600">{popularPlan.tenure} months • {popularPlan.interestRate}% interest</p>
              </div>
              {popularPlan.isPopular && (
                <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Popular
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Link
            to={`/products/${product.slug}`}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center block"
          >
            View Details & EMI Plans
          </Link>
          <button className="w-full bg-dark-800 text-white py-3 px-4 rounded-lg hover:bg-dark-900 transition-colors font-medium">
            Buy Now
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-dark-500">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure EMI powered by mutual funds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;