import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import JoinMovement from './components/JoinMovement';
import './App.css';

// Replace with your publishable key from the Stripe Dashboard
const stripePromise = loadStripe('pk_test_51Qt0v3A0fUxhhN0xVZFDxZXZmIkXFEPpAoOKvlOQVOUfvNBUDYfRXBXpqCTJVqQUZMRPKqjvfhMgDPLXpXnVdVCY00tJBFbGIE');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <JoinMovement />
      </div>
    </Elements>
  );
}

export default App;
