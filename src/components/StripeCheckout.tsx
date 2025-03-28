import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft } from 'lucide-react';

// Replace with your publishable key from the Stripe Dashboard
const stripePromise = loadStripe('pk_test_51Qt0v3A0fUxhhN0xVZFDxZXZmIkXFEPpAoOKvlOQVOUfvNBUDYfRXBXpqCTJVqQUZMRPKqjvfhMgDPLXpXnVdVCY00tJBFbGIE');

interface CheckoutFormProps {
  amount: number;
  currency: string;
  customerEmail: string;
  onSuccess: () => void;
  onBack: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#FFFFFF',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  amount, 
  currency, 
  customerEmail,
  onSuccess,
  onBack
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement(CardElement)?.focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    try {
      // Create a PaymentIntent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
          email: customerEmail,
        }),
      });

      const paymentIntentData = await response.json();

      // Confirm the payment with the client
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        setError('Card element not found');
        setProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: customerEmail,
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || 'An error occurred during payment');
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setProcessing(false);
        onSuccess();
      }
    } catch (err) {
      setError('An error occurred during payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Order
      </button>

      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Complete Your Purchase</h2>
        
        {paymentSuccess ? (
          <div className="text-center">
            <div className="mb-4 text-green-400 text-5xl">✓</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Payment Successful!</h3>
            <p className="text-gray-300 mb-6">Thank you for your purchase.</p>
            <button
              onClick={onSuccess}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Details
              </label>
              <div className="p-4 border border-purple-500/30 rounded-lg bg-purple-900/20">
                <CardElement 
                  options={CARD_ELEMENT_OPTIONS} 
                  onChange={(e) => {
                    setError(e.error ? e.error.message : '');
                    setCardComplete(e.complete);
                  }}
                />
              </div>
              {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-gray-300 mb-2">
                <span>Total</span>
                <span className="font-semibold text-white">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency.toUpperCase(),
                  }).format(amount)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || processing || !cardComplete}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                !stripe || processing || !cardComplete
                  ? 'bg-purple-600/50 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {processing ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency.toUpperCase(),
              }).format(amount)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface StripeCheckoutProps {
  amount: number;
  currency: string;
  customerEmail: string;
  onSuccess: () => void;
  onBack: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white py-12 px-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm {...props} />
      </Elements>
    </div>
  );
};

export default StripeCheckout;
