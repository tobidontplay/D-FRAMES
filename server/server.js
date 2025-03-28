const express = require('express');
const cors = require('cors');
// Your Stripe secret key. Make sure to move this to an environment variable in production
const stripe = require('stripe')('sk_test_51Qt0v3A0fUxhhN0xSzVFqjpsPCLRd9YO0tZ47lk4Qv0SDvz9yoIGYIYAmKOoi1oNrr9LfoDEWJIXMAGraw7FGboH00zuixG7uf');
const bodyParser = require('body-parser');
const path = require('path');
const webhookRoutes = require('./webhooks');

const app = express();
const port = process.env.PORT || 4242;

// Middleware
app.use(cors());
// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});
app.use(express.static(path.join(__dirname, '../build')));

// Use webhook routes
app.use('/api', webhookRoutes);

// Create a payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, email } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, customerEmail } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/canceled`,
      customer_email: customerEmail,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a product and price
app.post('/api/create-product', async (req, res) => {
  try {
    const { name, description, amount, currency } = req.body;
    
    const product = await stripe.products.create({
      name,
      description,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency,
    });

    res.json({
      product: product.id,
      price: price.id,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('\nIMPORTANT SETUP STEPS:');
  console.log('1. Set up your Stripe account to receive payments:');
  console.log('   - Go to https://dashboard.stripe.com/account');
  console.log('   - Complete your business details');
  console.log('   - Add your bank account for payouts');
  console.log('\n2. Set up webhooks to track payment events:');
  console.log('   - Go to https://dashboard.stripe.com/webhooks');
  console.log('   - Add an endpoint: http://your-domain.com/api/webhook');
  console.log('   - Select events: payment_intent.succeeded, payment_intent.payment_failed, charge.succeeded');
  console.log('   - Get your webhook secret and update it in webhooks.js');
  console.log('\n3. For local testing, use the Stripe CLI:');
  console.log('   stripe listen --forward-to localhost:4242/api/webhook');
});

// Export app for testing
module.exports = app;
