import React, { useState, useEffect } from 'react';
import { MapPin, Frame, ArrowRight, ArrowLeft } from 'lucide-react';
import UserInfoForm from './UserInfoForm';
import PaymentSystem from './PaymentSystem';
import OrderConfirmation from './OrderConfirmation';

interface Size {
  dimensions: string;
  visualWidth: string;
}

interface CountryData {
  name: string;
  flag: string;
  sizes: Size[];
}

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
  triggerImage?: File | null;
}

interface PaymentInfo {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mediaPreferences: string;
    mediaFiles: {
      images: File[];
      videos: File[];
    };
    triggerImage?: File | null;
  };
  selectedSize: string;
  selectedCountry: string;
}

const countries: CountryData[] = [
  {
    name: 'United States',
    flag: '🇺🇸',
    sizes: [
      { dimensions: 'Small (8"x10")', visualWidth: 'w-20' },
      { dimensions: 'Medium (12"x16")', visualWidth: 'w-24' },
      { dimensions: 'Large (18"x24")', visualWidth: 'w-28' },
    ],
  },
  {
    name: 'Naija',
    flag: '🇳🇬',
    sizes: [
      { dimensions: 'Small (20cm x 25cm)', visualWidth: 'w-20' },
      { dimensions: 'Medium (30cm x 40cm)', visualWidth: 'w-24' },
      { dimensions: 'Large (45cm x 60cm)', visualWidth: 'w-28' },
    ],
  },
];

export default function JoinMovement() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  // Reset size when country changes
  useEffect(() => {
    setSelectedSize('');
  }, [selectedCountry]);

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleContinue = () => {
    if (selectedCountry && selectedSize) {
      setShowUserInfo(true);
    }
  };

  const handleBack = () => {
    if (showUserInfo) {
      setShowUserInfo(false);
    } else {
      setSelectedCountry(null);
      setSelectedSize('');
    }
  };

  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowOrderConfirmation(true);
  };

  const handleOrderConfirmationBack = () => {
    setShowOrderConfirmation(false);
    setShowUserInfo(true);
    // User data is preserved in paymentInfo state
  };

  const handleProceedToCheckout = () => {
    setShowOrderConfirmation(false);
    setShowPayment(true);
  };

  const handleUserInfoSubmit = (userInfo: UserInfo) => {
    if (selectedCountry && selectedSize) {
      setPaymentInfo({
        userInfo,
        selectedSize,
        selectedCountry: selectedCountry.name,
      });
      setShowUserInfo(false);
      setShowOrderConfirmation(true);
    }
  };

  if (showPayment && paymentInfo) {
    return (
      <PaymentSystem
        onBack={handlePaymentBack}
        amount={selectedCountry?.name === 'Naija' ? 25000 : 150}
        userInfo={paymentInfo.userInfo}
        selectedCountry={paymentInfo.selectedCountry}
      />
    );
  }

  if (showOrderConfirmation && paymentInfo) {
    return (
      <OrderConfirmation
        onBack={handleOrderConfirmationBack}
        onCheckout={handleProceedToCheckout}
        orderInfo={{
          name: `${paymentInfo.userInfo.firstName} ${paymentInfo.userInfo.lastName}`,
          email: paymentInfo.userInfo.email,
          phone: paymentInfo.userInfo.phone,
          preferences: paymentInfo.userInfo.mediaPreferences,
          frameType: `D-Frame ${paymentInfo.selectedSize} (${paymentInfo.selectedCountry})`,
          quantity: 1,
          price: selectedCountry?.name === 'Naija' ? 25000 : 150,
          triggerImage: paymentInfo.userInfo.triggerImage,
          mediaFiles: paymentInfo.userInfo.mediaFiles
        }}
      />
    );
  }

  if (showUserInfo) {
    return (
      <UserInfoForm 
        onSubmit={handleUserInfoSubmit} 
        onBack={() => setShowUserInfo(false)} 
        initialData={paymentInfo?.userInfo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors rounded-full bg-purple-600/20 backdrop-blur-sm hover:bg-purple-600/30"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join the Movement</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select your location and frame size to get started with your custom D-frames experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Country Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <MapPin className="mr-2" />
              Select Your Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {countries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountrySelect(country)}
                  className={`p-6 rounded-xl flex items-center border-2 transition-all ${
                    selectedCountry?.name === country.name
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-purple-500/20 hover:border-purple-500/50 bg-black/20'
                  }`}
                >
                  <span className="text-4xl mr-4">{country.flag}</span>
                  <span className="text-xl font-medium">{country.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection - Only show if country is selected */}
          {selectedCountry && (
            <div className="mb-12 animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Frame className="mr-2" />
                Select Your Frame Size
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedCountry.sizes.map((size) => (
                  <button
                    key={size.dimensions}
                    onClick={() => handleSizeSelect(size.dimensions)}
                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center ${
                      selectedSize === size.dimensions
                        ? 'border-purple-500 bg-purple-900/30'
                        : 'border-purple-500/20 hover:border-purple-500/50 bg-black/20'
                    }`}
                  >
                    <div className={`${size.visualWidth} aspect-[4/5] bg-purple-400/10 rounded-lg mb-4 flex items-center justify-center`}>
                      <div className="w-3/4 h-3/4 border-2 border-purple-400/30 rounded"></div>
                    </div>
                    <span className="text-lg font-medium">{size.dimensions}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button - Only enable if both country and size are selected */}
          {selectedCountry && (
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!selectedSize}
                className={`flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium transition-all ${
                  selectedSize
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-600/30 text-white/50 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
