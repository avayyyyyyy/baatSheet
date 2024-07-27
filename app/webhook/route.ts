import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebaseAdmin";
import Stripe from "stripe";
import stripe from "@/lib/strips";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  console.log("Signature:", signature);

  if (!signature) {
    console.log("No signature found");
    return NextResponse.json({ message: "No signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("No webhook secret found");
    return NextResponse.json({ message: "No webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Event:", event);
  } catch (err) {
    console.error("Error constructing event:", err);
    return NextResponse.json(
      { message: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  const getCustomerId = async (customerID: string) => {
    try {
      const userDetails = await adminDB
        .collection("users")
        .where("stripeCustomerId", "==", customerID)
        .limit(1)
        .get();
      console.log("User details:", userDetails);

      if (!userDetails.empty) {
        return userDetails.docs[0];
      } else {
        console.log("No user found with the provided Stripe customer ID");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded":
      try {
        const invoice = event.data.object as any;
        const customerID = invoice.customer as string;
        const userDetails = await getCustomerId(customerID);
        if (!userDetails) {
          console.log("No user found");
          return NextResponse.json(
            { message: "No user found" },
            { status: 404 }
          );
        }

        await adminDB.collection("users").doc(userDetails.id).update({
          hasActiveSubscription: true,
        });
        console.log("Subscription updated to active for user:", userDetails.id);
      } catch (err) {
        console.error("Error updating subscription to active:", err);
        return NextResponse.json(
          { message: `Error updating subscription: ${(err as Error).message}` },
          { status: 500 }
        );
      }
      break;

    case "customer.subscription.deleted":
    case "subscription_schedule.canceled":
      try {
        const subscription = event.data.object as Stripe.Subscription;
        const customerID = subscription.customer as string;
        const userDetails = await getCustomerId(customerID);
        if (!userDetails) {
          console.log("No user found");
          return NextResponse.json(
            { message: "No user found" },
            { status: 404 }
          );
        }

        await adminDB.collection("users").doc(userDetails.id).update({
          hasActiveSubscription: false,
        });
        console.log(
          "Subscription updated to inactive for user:",
          userDetails.id
        );
      } catch (err) {
        console.error("Error updating subscription to inactive:", err);
        return NextResponse.json(
          { message: `Error updating subscription: ${(err as Error).message}` },
          { status: 500 }
        );
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log(`Webhook received: ${event.id}`);
  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
