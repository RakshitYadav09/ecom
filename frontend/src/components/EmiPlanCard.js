import React from 'react';

const EmiPlanCard = ({ plan, isSelected, onSelect, productPrice }) => {
  const totalAmount = (plan.monthlyAmount * plan.tenure) + plan.downpayment;
  const savings = productPrice - totalAmount;

  return (
    <div
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-200 bg-white hover:border-primary-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              isSelected ? 'border-primary-600' : 'border-gray-300'
            }`}
          >
            {isSelected && <div className="w-2 h-2 bg-primary-600 rounded-full"></div>}
          </div>
          <div>
            <h4 className="font-semibold text-dark-800">₹{plan.monthlyAmount.toLocaleString()}</h4>
            <p className="text-sm text-dark-500">{plan.tenure} months</p>
          </div>
        </div>
        {plan.isPopular && (
          <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
            Popular
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-dark-600">Interest Rate:</span>
          <span className="font-medium text-dark-800">
            {plan.interestRate === 0 ? '0% EMI' : `${plan.interestRate}%`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-dark-600">Down Payment:</span>
          <span className="font-medium text-dark-800">₹{plan.downpayment.toLocaleString()}</span>
        </div>

        {plan.cashback > 0 && (
          <div className="flex justify-between">
            <span className="text-dark-600">Cashback:</span>
            <span className="font-medium text-green-600">₹{plan.cashback.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-dark-600">Total Amount:</span>
          <span className="font-semibold text-dark-800">₹{totalAmount.toLocaleString()}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between">
            <span className="text-dark-600">You Save:</span>
            <span className="font-medium text-green-600">₹{savings.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center text-xs text-dark-500">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>
            EMIs starting {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmiPlanCard;