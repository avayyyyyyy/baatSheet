import { loadStripe, Stripe } from "@stripe/stripe-js";

let dtripePromise: Promise<Stripe | null>;

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Stripe public key not found");
}

const getStripe = async (): Promise<Stripe | null> => {
  if (!dtripePromise) {
    dtripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return dtripePromise;
};

export default getStripe;
