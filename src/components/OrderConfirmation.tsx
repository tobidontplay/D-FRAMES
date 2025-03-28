import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderConfirmationProps {
  onBack: () => void;
  onCheckout: () => void;
  orderInfo: {
    name: string;
    email: string;
    phone: string;
    preferences: string;
    frameType: string;
    quantity: number;
    price: number;
    triggerImage?: File | null;
    mediaFiles?: {
      images: File[];
      videos: File[];
    };
  };
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onBack, onCheckout, orderInfo }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const needsReadMore = orderInfo.preferences.length > maxLength;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Modify Order
        </button>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 text-center">Order Confirmation</h2>
          
          <div className="space-y-6">
            <div className="bg-purple-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-medium">{orderInfo.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-medium">{orderInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-medium">{orderInfo.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Preferences</p>
                  <div className="relative">
                    <div className="bg-purple-900/20 p-3 rounded-lg">
                      <p className="font-medium break-words">
                        {expanded ? orderInfo.preferences : orderInfo.preferences.substring(0, maxLength)}
                        {!expanded && needsReadMore && '...'}
                      </p>
                      {needsReadMore && (
                        <button
                          onClick={() => setExpanded(!expanded)}
                          className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mt-2 transition-colors"
                        >
                          {expanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Read More
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Order Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-400">Frame Type</p>
                  <p className="font-medium">{orderInfo.frameType}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Quantity</p>
                  <p className="font-medium">{orderInfo.quantity}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Price</p>
                  <p className="font-medium">
                    {orderInfo.frameType.includes('Naija') 
                      ? `₦${orderInfo.price.toLocaleString()}`
                      : `$${orderInfo.price.toLocaleString()}`
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {orderInfo.triggerImage && (
              <div className="bg-purple-900/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Uploaded Image</h3>
                <div className="flex justify-center">
                  <div className="max-w-xs">
                    <img 
                      src={URL.createObjectURL(orderInfo.triggerImage)} 
                      alt="Uploaded trigger" 
                      className="w-full h-auto rounded-lg"
                    />
                    <p className="text-sm text-center text-gray-400 mt-2">{orderInfo.triggerImage.name}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-full border border-purple-500/50 text-purple-400 hover:bg-purple-900/30 transition-colors"
              >
                Modify Order
              </button>
              <button
                onClick={onCheckout}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
