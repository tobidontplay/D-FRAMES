import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import JoinMovement from './components/JoinMovement';
import Admin from './components/Admin';
import Navigation from './components/Navigation';
import './App.css';

// Replace with your publishable key from the Stripe Dashboard
const stripePromise = loadStripe('pk_test_51Qt0v3A0fUxhhN0xVZFDxZXZmIkXFEPpAoOKvlOQVOUfvNBUDYfRXBXpqCTJVqQUZMRPKqjvfhMgDPLXpXnVdVCY00tJBFbGIE');

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<JoinMovement />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Elements>
    </Router>
  );
}

export default App;
