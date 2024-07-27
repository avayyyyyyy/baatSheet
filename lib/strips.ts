import Stripe from "stripe";

let stripeApiKey = process.env.STRIPE_SECRET_KEY;

if (!stripeApiKey) {
  throw new Error("Stripe secret key is not provided");
}

const stripe = new Stripe(stripeApiKey);

export default stripe;
