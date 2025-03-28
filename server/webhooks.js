const express = require('express');
const stripe = require('stripe')('sk_test_51Qt0v3A0fUxhhN0xSzVFqjpsPCLRd9YO0tZ47lk4Qv0SDvz9yoIGYIYAmKOoi1oNrr9LfoDEWJIXMAGraw7FGboH00zuixG7uf');
const router = express.Router();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_12345"; // Replace with your actual webhook secret

router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];

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
      // Then define and call a function to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);
      // Then define and call a function to handle the failed payment intent.
      // handlePaymentIntentFailed(failedPaymentIntent);
      break;
    case 'charge.succeeded':
      const charge = event.data.object;
      console.log(`Charge succeeded: ${charge.id}`);
      // Then define and call a function to handle the successful charge.
      // handleChargeSucceeded(charge);
      break;
    // Handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

module.exports = router;
