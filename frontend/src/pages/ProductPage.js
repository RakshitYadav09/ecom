import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import EMICalculator from '../components/EMICalculator';
import ImageViewer from '../components/ImageViewer';
import VariantSelector from '../components/VariantSelector';
import ConvenienceFeatures from '../components/ConvenienceFeatures';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (product && product.emiPlans) {
      // Auto-select the popular plan or first plan
      const popularPlan = product.emiPlans.find(plan => plan.isPopular);
      setSelectedEmiPlan(popularPlan || product.emiPlans[0]);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
      
      // Initialize selected variants
      const initialVariants = {};
      if (data.variants) {
        const variantTypes = [...new Set(data.variants.map(v => v.type))];
        variantTypes.forEach(type => {
          const firstVariant = data.variants.find(v => v.type === type);
          if (firstVariant) {
            initialVariants[type] = firstVariant;
          }
        });
      }
      setSelectedVariants(initialVariants);
    } catch (err) {
      setError('Product not found');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!product) return 0;
    let price = product.basePrice;
    Object.values(selectedVariants).forEach(variant => {
      price += variant.priceModifier || 0;
    });
    return price;
  };

  const getVariantPriceModifiers = () => {
    return Object.values(selectedVariants).map(variant => variant.priceModifier || 0);
  };

  const getVariantsByType = (type) => {
    return product.variants?.filter(v => v.type === type) || [];
  };

  const handleVariantSelect = (type, variant) => {
    setSelectedVariants(prev => {
      const newVariants = {
        ...prev,
        [type]: variant
      };
      
      // Clear selected EMI plan when variant changes to trigger recalculation
      setSelectedEmiPlan(null);
      
      return newVariants;
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="text-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-900 mb-4">Product Not Found</h2>
          <p className="text-brand-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="bg-brand-800 text-white px-6 py-3 rounded-lg hover:bg-brand-900 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = calculatePrice();
  const discountPercentage = Math.round(((product.mrp - currentPrice) / product.mrp) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-brand-700 hover:text-brand-900">Home</Link>
            <span className="text-brand-400">/</span>
            <Link to="/" className="text-brand-700 hover:text-brand-900">Products</Link>
            <span className="text-brand-400">/</span>
            <span className="text-brand-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Layout: Stack vertically */}
        <div className="block xl:hidden">
          {/* Product Images - First on Mobile */}
          <div className="mb-6">
            <ImageViewer
              defaultImages={product.images}
              selectedVariants={selectedVariants}
              productName={product.name}
              onImageChange={(newImage) => {
                console.log('Image changed to:', newImage);
              }}
            />
          </div>

          {/* Product Details - Second on Mobile */}
          <div className="space-y-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-brand-900 mb-2">{product.name}</h1>
              <p className="text-base text-brand-600">{product.brand} • {product.category}</p>
              
              <div className="flex flex-col space-y-2 mt-4">
                <span className="text-2xl font-bold text-brand-900 transition-all duration-300">
                  ₹{currentPrice.toLocaleString()}
                </span>
                <div className="flex items-center space-x-2">
                  {product.mrp > currentPrice && (
                    <>
                      <span className="text-lg text-brand-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {discountPercentage}% off
                      </span>
                    </>
                  )}
                </div>
                {currentPrice !== product.basePrice && (
                  <span className="text-xs text-orange-600 font-medium">
                    {currentPrice > product.basePrice ? '+' : ''}₹{(currentPrice - product.basePrice).toLocaleString()} variant cost
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Variant Selection */}
            <VariantSelector
              variants={product.variants}
              selectedVariants={selectedVariants}
              onVariantSelect={handleVariantSelect}
              getVariantsByType={getVariantsByType}
            />

            {/* Product Features */}
            <div>
              <h3 className="text-lg font-semibold text-brand-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-brand-700 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-brand-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-200">
              <div className="flex flex-col space-y-2 mb-4">
                <div>
                  <p className="text-sm text-brand-600">Free Shipping</p>
                  <p className="text-xs text-brand-500">Dispatch in less than 48 hours and delivery in 3-7 working days after dispatch</p>
                </div>
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Available</span>
                </div>
              </div>
              
              <div className="text-xs text-brand-500">
                <strong>Sold by:</strong> Balaji Infocom
              </div>
            </div>

            <ConvenienceFeatures />
          </div>

          {/* EMI Options - Third on Mobile */}
          <div>
            <EMICalculator
              basePrice={product.basePrice}
              mrp={product.mrp}
              selectedVariantPrices={getVariantPriceModifiers()}
              emiPlans={product.emiPlans}
              productId={product._id}
              calculateCustomEMI={productService.calculateCustomEMI}
              onPlanSelect={(selectedPlan) => {
                setSelectedEmiPlan(selectedPlan);
              }}
              key={JSON.stringify(selectedVariants)}
            />

            {selectedEmiPlan && (
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-brand-200 mt-4">
                <div className="text-center mb-4">
                  <h3 className="text-base font-bold text-brand-900 mb-2">Ready to Proceed?</h3>
                  <p className="text-xs text-brand-600">Complete your purchase with the selected EMI plan</p>
                </div>

                <div className="space-y-2 mb-4 p-3 bg-brand-50 rounded-xl">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-brand-700">Product:</span>
                    <span className="text-brand-900 font-medium text-right max-w-32 truncate">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-brand-700">Monthly EMI:</span>
                    <span className="text-brand-900 font-semibold">₹{selectedEmiPlan.monthlyAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-brand-700">Tenure:</span>
                    <span className="text-brand-900">{selectedEmiPlan.tenure} months</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-brand-700">Down Payment:</span>
                    <span className="text-brand-900">₹{selectedEmiPlan.downpayment?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-brand-700">Total Price:</span>
                    <span className="text-brand-900 font-semibold">₹{selectedEmiPlan.totalPrice?.toLocaleString()}</span>
                  </div>
                  {selectedEmiPlan.savings > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-brand-700">You Save:</span>
                      <span className="text-green-600 font-semibold">₹{selectedEmiPlan.savings?.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedEmiPlan.cashback > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-brand-700">Cashback:</span>
                      <span className="text-green-600 font-semibold">₹{selectedEmiPlan.cashback?.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-brand-900 text-white py-2.5 px-4 rounded-xl hover:bg-brand-800 transition-colors font-semibold text-sm">
                  Buy on {selectedEmiPlan.tenure} Months EMI
                </button>

                <p className="text-xs text-center text-brand-500 mt-2">
                  *Total payment per month includes taxes. EMIs starting 3rd Dec
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout: 3-column grid */}
        <div className="hidden xl:grid xl:grid-cols-3 gap-8">
          {/* Enhanced Product Images */}
          <div className="xl:col-span-1">
            <ImageViewer
              defaultImages={product.images}
              selectedVariants={selectedVariants}
              productName={product.name}
              onImageChange={(newImage) => {
                console.log('Image changed to:', newImage);
              }}
            />
          </div>

          {/* Product Details */}
          <div className="xl:col-span-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-900 mb-2">{product.name}</h1>
              <p className="text-lg text-brand-600">{product.brand} • {product.category}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                <span className="text-3xl font-bold text-brand-900 transition-all duration-300">
                  ₹{currentPrice.toLocaleString()}
                </span>
                <div className="flex items-center space-x-3">
                  {product.mrp > currentPrice && (
                    <>
                      <span className="text-xl text-brand-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {discountPercentage}% off
                      </span>
                    </>
                  )}
                </div>
                {currentPrice !== product.basePrice && (
                  <span className="text-sm text-orange-600 font-medium">
                    {currentPrice > product.basePrice ? '+' : ''}₹{(currentPrice - product.basePrice).toLocaleString()} variant cost
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Variant Selection */}
            <VariantSelector
              variants={product.variants}
              selectedVariants={selectedVariants}
              onVariantSelect={handleVariantSelect}
              getVariantsByType={getVariantsByType}
            />

            {/* Product Features */}
            <div>
              <h3 className="text-lg font-semibold text-brand-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-brand-700 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-brand-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-brand-600">Free Shipping</p>
                  <p className="text-xs text-brand-500">Dispatch in less than 48 hours and delivery in 3-7 working days after dispatch</p>
                </div>
                <div className="text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="text-xs text-brand-500">
                <strong>Sold by:</strong> Balaji Infocom
              </div>
            </div>

            {/* Convenience Features */}
            <ConvenienceFeatures />
          </div>

          {/* EMI Options - Right Side */}
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-8">
              <EMICalculator
                basePrice={product.basePrice}
                mrp={product.mrp}
                selectedVariantPrices={getVariantPriceModifiers()}
                emiPlans={product.emiPlans}
                productId={product._id}
                calculateCustomEMI={productService.calculateCustomEMI}
                onPlanSelect={(selectedPlan) => {
                  setSelectedEmiPlan(selectedPlan);
                }}
                key={JSON.stringify(selectedVariants)}
              />

              {selectedEmiPlan && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-brand-200 mt-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-brand-900 mb-2">Ready to Proceed?</h3>
                    <p className="text-sm text-brand-600">Complete your purchase with the selected EMI plan</p>
                  </div>

                  <div className="space-y-3 mb-4 p-4 bg-brand-50 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-brand-700">Product:</span>
                      <span className="text-brand-900 font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-brand-700">Monthly EMI:</span>
                      <span className="text-brand-900 font-semibold">₹{selectedEmiPlan.monthlyAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-brand-700">Tenure:</span>
                      <span className="text-brand-900">{selectedEmiPlan.tenure} months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-brand-700">Down Payment:</span>
                      <span className="text-brand-900">₹{selectedEmiPlan.downpayment?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-brand-700">Total Price:</span>
                      <span className="text-brand-900 font-semibold">₹{selectedEmiPlan.totalPrice?.toLocaleString()}</span>
                    </div>
                    {selectedEmiPlan.savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-brand-700">You Save:</span>
                        <span className="text-green-600 font-semibold">₹{selectedEmiPlan.savings?.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedEmiPlan.cashback > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-brand-700">Cashback:</span>
                        <span className="text-green-600 font-semibold">₹{selectedEmiPlan.cashback?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-brand-900 text-white py-3 px-4 rounded-xl hover:bg-brand-800 transition-colors font-semibold">
                    Buy on {selectedEmiPlan.tenure} Months EMI
                  </button>

                  <p className="text-xs text-center text-brand-500 mt-3">
                    *Total payment per month includes taxes. EMIs starting 3rd Dec
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;