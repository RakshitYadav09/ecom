import React from 'react';

const VariantSelector = ({ 
  variants, 
  selectedVariants, 
  onVariantSelect,
  getVariantsByType 
}) => {
  const renderColorVariant = (variant, type, isSelected) => {
    return (
      <button
        key={`${variant.type}-${variant.value}`}
        onClick={() => onVariantSelect(type, variant)}
        className={`relative p-2 rounded-full border-3 transition-all duration-300 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center ${
          isSelected
            ? 'border-brand-700 shadow-lg ring-4 ring-brand-700 ring-opacity-30 scale-105'
            : 'border-gray-300 hover:border-brand-400 hover:shadow-md hover:scale-102'
        }`}
        title={variant.value}
      >
        {/* Color swatch */}
        {variant.hexCode ? (
          <div 
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 ${
              isSelected ? 'border-white' : 'border-gray-200'
            }`}
            style={{ backgroundColor: variant.hexCode }}
          >
            {/* Checkmark for selected color */}
            {isSelected && (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          // Fallback if no hex code
          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-300 border-2 flex items-center justify-center ${
            isSelected ? 'border-white' : 'border-gray-200'
          }`}>
            <span className="text-xs font-medium text-gray-600">{variant.value.charAt(0)}</span>
          </div>
        )}
        
        {/* Price modifier indicator */}
        {variant.priceModifier !== 0 && (
          <div className={`absolute -bottom-1 -right-1 text-xs px-1 py-0.5 rounded-full text-white font-bold shadow-md ${
            variant.priceModifier > 0 ? 'bg-orange-500' : 'bg-green-500'
          }`}>
            {variant.priceModifier > 0 ? '+' : ''}₹{Math.abs(variant.priceModifier / 1000)}k
          </div>
        )}
      </button>
    );
  };

  const renderStorageVariant = (variant, type, isSelected) => {
    return (
      <button
        key={`${variant.type}-${variant.value}`}
        onClick={() => onVariantSelect(type, variant)}
        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all duration-300 ${
          isSelected
            ? 'border-brand-700 bg-brand-50 text-brand-800 shadow-lg ring-2 ring-brand-700 ring-opacity-20 scale-105'
            : 'border-brand-200 bg-white hover:border-brand-400 hover:shadow-sm hover:scale-102'
        }`}
      >
        <div className="text-center">
          <div className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-brand-800' : 'text-brand-800'}`}>
            {variant.value}
          </div>
          {variant.priceModifier !== 0 && (
            <div className={`text-xs mt-1 ${
              variant.priceModifier > 0 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {variant.priceModifier > 0 ? '+' : ''}₹{Math.abs(variant.priceModifier).toLocaleString()}
            </div>
          )}
        </div>
      </button>
    );
  };

  const renderGenericVariant = (variant, type, isSelected) => {
    return (
      <button
        key={`${variant.type}-${variant.value}`}
        onClick={() => onVariantSelect(type, variant)}
        className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          isSelected
            ? 'border-brand-700 bg-brand-50 text-brand-800 shadow-md'
            : 'border-brand-200 bg-white hover:border-brand-400 hover:shadow-sm'
        }`}
      >
        <div className="text-center">
          <span className={`font-medium ${isSelected ? 'text-brand-800' : 'text-brand-700'}`}>
            {variant.value}
          </span>
          {variant.priceModifier !== 0 && (
            <div className={`text-xs mt-1 ${
              variant.priceModifier > 0 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {variant.priceModifier > 0 ? '+' : ''}₹{Math.abs(variant.priceModifier).toLocaleString()}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {['storage', 'color', 'finish'].map(type => {
        const typeVariants = getVariantsByType(type);
        if (typeVariants.length === 0) return null;

        const selectedVariant = selectedVariants[type];

        return (
          <div key={type}>
            <h3 className="text-base sm:text-lg font-semibold text-brand-800 mb-2 sm:mb-3 capitalize">
              Choose {type}
              {selectedVariant && (
                <span className="text-sm sm:text-base font-normal text-brand-600 block sm:inline sm:ml-2">
                  {selectedVariant.value}
                </span>
              )}
            </h3>
            
            <div className={`${
              type === 'color' ? 'flex flex-wrap gap-3 sm:gap-4' : 
              type === 'storage' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3' :
              'flex flex-wrap gap-2 sm:gap-3'
            }`}>
              {typeVariants.map((variant) => {
                const isSelected = selectedVariant?.value === variant.value;
                
                if (type === 'color') {
                  return renderColorVariant(variant, type, isSelected);
                } else if (type === 'storage') {
                  return renderStorageVariant(variant, type, isSelected);
                } else {
                  return renderGenericVariant(variant, type, isSelected);
                }
              })}
            </div>

            {/* Additional info for selected variant */}
            {selectedVariant && selectedVariant.priceModifier !== 0 && (
              <div className="mt-2 text-xs sm:text-sm text-brand-600">
                <span className={`font-medium ${
                  selectedVariant.priceModifier > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {selectedVariant.priceModifier > 0 ? 'Additional' : 'Discount'} cost: 
                  ₹{Math.abs(selectedVariant.priceModifier).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;