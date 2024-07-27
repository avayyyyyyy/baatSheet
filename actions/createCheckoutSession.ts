"use server";

import { UserDetails } from "@/app/dashboard/pricing/page";
import { adminDB } from "@/firebaseAdmin";
import stripe from "@/lib/strips";

import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  try {
    const userDoc = await adminDB.collection("users").doc(userId).get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    console.log("stripeCustomerId from Firestore: ", stripeCustomerId);

    if (!stripeCustomerId) {
      console.log("Creating new customer in Stripe...");

      const customer = await stripe.customers.create({
        email: userDetails.email,
        name: userDetails.name,
        metadata: { userId },
        address: {
          line1: "Customer's Address Line 1",
          line2: "Customer's Address Line 2",
          city: "Customer's City",
          state: "Customer's State",
          postal_code: "Customer's Postal Code",
          country: "IN", // Country code for India
        },
      });

      stripeCustomerId = customer.id;

      console.log("New stripeCustomerId created: ", stripeCustomerId);

      // Update the Firestore document
      await adminDB.collection("users").doc(userId).set({
        stripeCustomerId: stripeCustomerId,
      });
      console.log("stripeCustomerId saved to Firestore");
    }

    console.log("Creating new checkout session...");
    console.log(process.env.VERCEL_URL);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `https://baat-sheet.vercel.app/dashboard?upgrade=true`,
      cancel_url: `https://baat-sheet.vercel.app/dashboard/pricing`,
      // success_url: `http://localhost:3000/dashboard?upgrade=true`,
      // cancel_url: `http://localhost:3000/dashboard/pricing`,
      shipping_address_collection: {
        allowed_countries: ["IN"], // Specify allowed countries for shipping
      },
      customer_update: {
        address: "auto", // Automatically update customer's address based on shipping address
      },
    });

    console.log("Checkout session created: ", session.id);

    return session.id;
  } catch (error) {
    console.error("Error in createCheckoutSession: ", error);
    throw new Error("Failed to create checkout session");
  }
}
