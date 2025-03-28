// Stripe service for client-side integration
import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key from the Stripe Dashboard
const stripePromise = loadStripe('pk_test_51Qt0v3A0fUxhhN0xVZFDxZXZmIkXFEPpAoOKvlOQVOUfvNBUDYfRXBXpqCTJVqQUZMRPKqjvfhMgDPLXpXnVdVCY00tJBFbGIE');

export const createCheckoutSession = async (priceId: string, customerEmail: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail,
      }),
    });

    const session = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (error) {
        console.error('Error redirecting to checkout:', error);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createPaymentIntent = async (amount: number, currency: string, customerEmail: string) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        customerEmail,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
