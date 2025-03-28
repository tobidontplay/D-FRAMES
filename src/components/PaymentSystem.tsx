import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import StripeCheckout from './StripeCheckout';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mediaPreferences: string;
  mediaFiles: {
    images: File[];
    videos: File[];
  };
}

interface PaymentSystemProps {
  onBack: () => void;
  amount: number;
  userInfo: UserInfo;
  selectedCountry: string;
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({ 
  onBack, 
  amount, 
  userInfo, 
  selectedCountry 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack' | null>(null);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  
  // Determine currency based on country
  const currency = selectedCountry === 'Naija' ? 'ngn' : 'usd';
  
  // Format amount based on currency
  const formattedAmount = new Intl.NumberFormat(
    selectedCountry === 'Naija' ? 'en-NG' : 'en-US', 
    { 
      style: 'currency', 
      currency: currency.toUpperCase() 
    }
  ).format(amount);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    // Here you would typically redirect to a success page or show a success message
    alert('Payment successful! Thank you for your order.');
  };

  const handlePaymentMethodSelect = (method: 'stripe' | 'paystack') => {
    setPaymentMethod(method);
  };

  if (paymentMethod === 'stripe') {
    return (
      <StripeCheckout 
        amount={amount}
        currency={currency}
        customerEmail={userInfo.email}
        onSuccess={handlePaymentSuccess}
        onBack={() => setPaymentMethod(null)}
      />
    );
  }

  // Future implementation for Paystack
  if (paymentMethod === 'paystack') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setPaymentMethod(null)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Payment Options
          </button>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-6 text-center">Paystack Payment</h2>
            <p className="text-center mb-6">Paystack integration coming soon!</p>
            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Order
        </button>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 text-center">Choose Payment Method</h2>
          
          <div className="mb-6">
            <p className="text-center text-xl mb-2">Total: {formattedAmount}</p>
            <p className="text-center text-gray-400 mb-6">Select your preferred payment method below</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Stripe Payment Option */}
            <button
              onClick={() => handlePaymentMethodSelect('stripe')}
              className="flex flex-col items-center justify-center p-6 border border-purple-500/30 rounded-xl hover:border-purple-400 transition-colors bg-purple-900/20"
              disabled={selectedCountry === 'Naija'}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                alt="Stripe" 
                className="h-10 mb-4 object-contain"
              />
              <span className="text-lg font-medium">Pay with Stripe</span>
              <span className="text-sm text-gray-400 mt-2">For US Customers</span>
              {selectedCountry === 'Naija' && (
                <span className="text-xs text-red-400 mt-2">Not available for Nigerian customers</span>
              )}
            </button>
            
            {/* Paystack Payment Option */}
            <button
              onClick={() => handlePaymentMethodSelect('paystack')}
              className="flex flex-col items-center justify-center p-6 border border-purple-500/30 rounded-xl hover:border-purple-400 transition-colors bg-purple-900/20"
              disabled={selectedCountry !== 'Naija'}
            >
              <img 
                src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png" 
                alt="Paystack" 
                className="h-10 mb-4 object-contain"
              />
              <span className="text-lg font-medium">Pay with Paystack</span>
              <span className="text-sm text-gray-400 mt-2">For Nigerian Customers</span>
              {selectedCountry !== 'Naija' && (
                <span className="text-xs text-red-400 mt-2">Only available for Nigerian customers</span>
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>All payments are secure and encrypted.</p>
            <p className="mt-2">By proceeding with the payment, you agree to our Terms of Service.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;
