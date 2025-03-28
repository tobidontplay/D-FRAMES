const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')('sk_test_51Qt0v3A0fUxhhN0xSzVFqjpsPCLRd9YO0tZ47lk4Qv0SDvz9yoIGYIYAmKOoi1oNrr9LfoDEWJIXMAGraw7FGboH00zuixG7uf');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4242;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


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

// Webhook handling for Stripe events
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = "whsec_12345"; // Replace with your actual webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);
      break;
    case 'charge.succeeded':
      const charge = event.data.object;
      console.log(`Charge succeeded: ${charge.id}`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

// Serve the preview.html file for any routes that don't match an API endpoint
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('\nIMPORTANT: Open http://localhost:5001 in your browser to view the DFrames website');
});
