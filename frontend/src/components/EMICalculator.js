import React, { useState, useEffect, useCallback } from 'react';

// Local EMI calculation function
const calculateLocalEMI = (principal, tenure, interestRate) => {
  if (interestRate === 0) {
    return Math.round(principal / tenure);
  }
  
  const monthlyRate = interestRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  return Math.round(emi);
};

const EMICalculator = ({ 
  basePrice, 
  mrp, 
  selectedVariantPrices, 
  emiPlans, 
  productId, 
  onPlanSelect,
  calculateCustomEMI 
}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customTenure, setCustomTenure] = useState(6);
  const [customDownpayment, setCustomDownpayment] = useState(0);
  const [calculatedPlans, setCalculatedPlans] = useState(emiPlans || []);
  const [loading, setLoading] = useState(false);

  // Calculate total price with variant modifiers
  const totalPrice = basePrice + (selectedVariantPrices || []).reduce((sum, price) => sum + price, 0);

  const updateEMICalculations = useCallback(async () => {
    if (!calculateCustomEMI || !productId) {
      console.log('Missing calculateCustomEMI or productId');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Calling calculateCustomEMI with:', {
        productId, 
        selectedVariantPrices,
        customTenure: customMode ? customTenure : null,
        customDownpayment: customMode ? customDownpayment : null
      });
      
      const result = await calculateCustomEMI(
        productId, 
        selectedVariantPrices || [],
        customMode ? customTenure : null,
        customMode ? customDownpayment : null
      );
      
      console.log('EMI calculation result:', result);
      setCalculatedPlans(result.emiPlans || []);
    } catch (error) {
      console.error('Error updating EMI calculations:', error);
      // Fallback to basic calculation if API fails
      if (emiPlans && emiPlans.length > 0) {
        const fallbackPlans = emiPlans.map(plan => ({
          ...plan,
          monthlyAmount: calculateLocalEMI(totalPrice - plan.downpayment, plan.tenure, plan.interestRate),
          totalPrice
        }));
        setCalculatedPlans(fallbackPlans);
      }
    } finally {
      setLoading(false);
    }
  }, [calculateCustomEMI, productId, selectedVariantPrices, customMode, customTenure, customDownpayment, emiPlans, totalPrice]);

  useEffect(() => {
    console.log('useEffect triggered with:', {
      selectedVariantPrices,
      basePrice,
      emiPlans: emiPlans?.length,
      productId
    });
    
    // Always update calculations when variant prices change
    if (selectedVariantPrices && selectedVariantPrices.some(price => price > 0)) {
      updateEMICalculations();
    } else if (emiPlans && emiPlans.length > 0) {
      // Use base plans with total price adjustment
      const adjustedPlans = emiPlans.map(plan => ({
        ...plan,
        monthlyAmount: calculateLocalEMI(totalPrice - plan.downpayment, plan.tenure, plan.interestRate),
        totalPrice
      }));
      setCalculatedPlans(adjustedPlans);
    }
  }, [selectedVariantPrices, basePrice, emiPlans, updateEMICalculations, totalPrice, productId]);

  useEffect(() => {
    // Set default downpayment to 15% of total price
    setCustomDownpayment(Math.round(totalPrice * 0.15));
  }, [totalPrice]);

  const handleCustomCalculation = async () => {
    await updateEMICalculations();
  };

  // Auto-update when custom parameters change in custom mode
  useEffect(() => {
    if (customMode) {
      const timeoutId = setTimeout(() => {
        updateEMICalculations();
      }, 300); // Debounce for 300ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [customMode, customTenure, customDownpayment, updateEMICalculations]);

  const handlePlanSelect = (plan) => {
    console.log('Plan selected:', plan);
    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect({
        ...plan,
        totalPrice,
        savings: mrp - totalPrice
      });
    }
  };

  const isPlanSelected = (plan) => {
    if (!selectedPlan) return false;
    const isSelected = selectedPlan.tenure === plan.tenure && 
           selectedPlan.interestRate === plan.interestRate &&
           selectedPlan.downpayment === plan.downpayment;
    return isSelected;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-brand-900 mb-2">EMI Options</h3>
        <div className="flex flex-col space-y-1 text-sm">
          <span className="text-brand-600">Total Price: </span>
          <div className="flex flex-col space-y-1">
            <span className="text-xl sm:text-2xl font-bold text-brand-800">{formatCurrency(totalPrice)}</span>
            {mrp > totalPrice && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm">
                <span className="line-through text-brand-500">{formatCurrency(mrp)}</span>
                <span className="text-green-600">Save {formatCurrency(mrp - totalPrice)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mb-4 sm:mb-6">
        <div className="flex bg-brand-100 rounded-lg p-1">
          <button
            onClick={() => setCustomMode(false)}
            className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              !customMode 
                ? 'bg-white text-brand-800 shadow-sm' 
                : 'text-brand-500 hover:text-brand-700'
            }`}
          >
            Popular Plans
          </button>
          <button
            onClick={() => setCustomMode(true)}
            className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              customMode 
                ? 'bg-white text-brand-800 shadow-sm' 
                : 'text-brand-500 hover:text-brand-700'
            }`}
          >
            Custom EMI
          </button>
        </div>
      </div>

      {customMode ? (
        // Custom EMI Calculator
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-700 mb-2">
              Downpayment: {formatCurrency(customDownpayment)}
            </label>
            <input
              type="range"
              min={Math.round(totalPrice * 0.1)}
              max={Math.round(totalPrice * 0.5)}
              step="1000"
              value={customDownpayment}
              onChange={(e) => setCustomDownpayment(parseInt(e.target.value))}
              className="w-full h-2 bg-brand-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-brand-500 mt-1">
              <span>{formatCurrency(Math.round(totalPrice * 0.1))}</span>
              <span>{formatCurrency(Math.round(totalPrice * 0.5))}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-700 mb-2">
              Tenure: {customTenure} months
            </label>
            <input
              type="range"
              min="3"
              max="24"
              step="3"
              value={customTenure}
              onChange={(e) => setCustomTenure(parseInt(e.target.value))}
              className="w-full h-2 bg-brand-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-brand-500 mt-1">
              <span>3 months</span>
              <span>24 months</span>
            </div>
          </div>

          <button
            onClick={handleCustomCalculation}
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-800 text-white font-medium rounded-lg hover:bg-brand-900 transition-colors disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate EMI'}
          </button>
        </div>
      ) : null}

      {/* EMI Plans Display */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-700"></div>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
          {calculatedPlans.map((plan, index) => (
            <div
              key={index}
              onClick={() => handlePlanSelect(plan)}
              className={`relative border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 ${
                isPlanSelected(plan)
                  ? 'border-brand-700 bg-brand-50 shadow-lg ring-2 ring-brand-700 ring-opacity-40'
                  : 'border-gray-300 hover:border-brand-400 hover:shadow-sm hover:bg-gray-50'
              } ${plan.isPopular ? 'ring-2 ring-green-500 ring-opacity-20' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-2 left-3 sm:left-4 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <div className={`text-base sm:text-lg font-semibold ${
                      isPlanSelected(plan) ? 'text-brand-900' : 'text-gray-800'
                    }`}>
                      {formatCurrency(plan.monthlyAmount)}/month
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                      <span className={isPlanSelected(plan) ? 'text-brand-700 font-medium' : 'text-brand-600'}>
                        {plan.tenure} months
                      </span>
                      {plan.interestRate === 0 ? (
                        <span className="font-medium text-green-600">0% Interest</span>
                      ) : (
                        <span className={isPlanSelected(plan) ? 'text-brand-700 font-medium' : 'text-brand-600'}>
                          {plan.interestRate}% interest
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm">
                    <span className={isPlanSelected(plan) ? 'text-brand-700 font-medium' : 'text-brand-600'}>
                      Downpayment: {formatCurrency(plan.downpayment)}
                    </span>
                    {plan.cashback > 0 && (
                      <span className="text-green-600 font-medium">
                        Cashback: {formatCurrency(plan.cashback)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ml-3 flex items-center justify-center transition-all duration-200 ${
                  isPlanSelected(plan)
                    ? 'border-brand-700 bg-brand-700 shadow-md'
                    : 'border-gray-400 bg-white hover:border-brand-500'
                }`}>
                  {isPlanSelected(plan) && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <button
          onClick={() => alert(`Proceeding with ${selectedPlan.tenure}-month EMI plan of ₹${selectedPlan.monthlyAmount?.toLocaleString()}/month`)}
          className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 px-4 bg-brand-900 text-white font-semibold rounded-lg hover:bg-brand-800 transition-colors text-sm sm:text-base"
        >
          Proceed with Selected Plan
        </button>
      )}
    </div>
  );
};

export default EMICalculator;