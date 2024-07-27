"use server";

import { adminDB } from "@/firebaseAdmin";
import stripe from "@/lib/strips";
import { auth, Session } from "@clerk/nextjs/server";

export async function createStripePortal() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await adminDB.collection("users").doc(userId).get();

  const customerStripeId = user.data()?.stripeCustomerId;

  if (!customerStripeId) {
    throw new Error("Stripe customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerStripeId,
    return_url: `https://baat-sheet.vercel.app/dashboard`,
  });

  console.log("Session: ", session);

  return session.url;
}
