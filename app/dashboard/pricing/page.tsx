"use client";

import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";
import useSubscription from "@/components/hooks/useSubscription";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

const pricingPlans = [
  {
    name: "Free",
    description: "Get started with essential features to chat with PDFs.",
    monthlyPrice: 0,
    link: "https://github.com/ansub/syntaxUI",
    features: [
      "Chat with up to 5 PDFs",
      "Basic AI response",
      "Limited to 5 queries per document",
      "No support",
      "No document deletion",
    ],
  },
  {
    name: "Pro",
    description: "Unlock advanced features for more intensive use.",
    monthlyPrice: 11.99,
    link: "https://github.com/ansub/syntaxUI",
    features: [
      "Chat with up to 20 PDFs",
      "Advanced AI response",
      "Limited to 100 queries per document",
      "Priority support",
      "Able to delete documents",
    ],
  },
  //   {
  //     name: "Enterprise",
  //     description: "Ultimate features and support for enterprise needs.",
  //     monthlyPrice: 99.99,
  //     link: "https://github.com/ansub/syntaxUI",
  //     features: [
  //       "Chat with unlimited PDFs",
  //       "Custom AI models",
  //       "Unlimited queries",
  //       "Dedicated support & training",
  //     ],
  //   },
];

export type UserDetails = {
  email: string;
  name: string;
};

const Pricing = () => {
  const { user } = useUser();
  const router = useRouter();

  const { error, hasActiveSubscription, isFileLimitOver, fetching } =
    useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetail: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };
    startTransition(async () => {
      const stripe = await getStripe();
      if (hasActiveSubscription) {
        const stripePortal = await createStripePortal();
        const createCheckoutSession = stripePortal;
        // console.log("stripePortal: ", stripePortal);
        return router.push(createCheckoutSession);
      }

      const sessionId = await createCheckoutSession(userDetail);

      // console.log("sessionId: ", sessionId);

      await stripe?.redirectToCheckout({
        sessionId: sessionId!,
      });
    });
  };

  useEffect(() => {
    if (!user) {
      router.push("/dashboard");
    }
  }, []);

  const Heading = () => (
    <div className="relative z-10 my-12 flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        <div className="mb-2 inline-block rounded-full bg-orange-100 px-2 py-[0.20rem] text-xs font-medium uppercase text-orange-500 dark:bg-orange-200">
          Pricing
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-gray-200">
          Fair pricing, unfair advantage.
        </p>
        <p className="text-md max-w-xl text-gray-700 md:text-center dark:text-gray-300">
          Get started with our app today and talk to your PDFs like never
          before.
        </p>
      </div>
    </div>
  );

  const PricingCards = () => (
    <div className="relative z-10 mx-auto items-center flex w-full justify-center max-w-6xl flex-col gap-8 lg:flex-row lg:gap-4">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className={`max-w-lg rounded-xl border-2 ${
            plan.monthlyPrice === 19.99 || plan.monthlyPrice === 99.99
              ? "border-orange-500"
              : "border-gray-200"
          } p-6 text-left`}
        >
          <p className="mb-1 mt-0 text-sm font-medium uppercase text-orange-500">
            {plan.name}
          </p>
          <p className="my-0 mb-6 text-sm text-gray-600">{plan.description}</p>
          <div className="mb-8 overflow-hidden">
            <motion.p
              key="monthly"
              className="my-0 text-3xl font-semibold text-gray-900 dark:text-gray-100"
            >
              <span>${plan.monthlyPrice}</span>
              <span className="text-sm font-medium">/month</span>
            </motion.p>
          </div>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="mb-3 flex items-center gap-2">
              <Check className="text-orange-500" size={18} />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
          {plan.name === "Free" ? (
            <>
              <motion.button
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                whileTap={{ scale: 0.985 }}
                className="mt-8 w-full rounded-lg border-orange-500 py-2 text-sm font-medium border text-orange-500 hover:bg-orange-500 hover:text-white duration-150 "
              >
                Get Started
              </motion.button>
            </>
          ) : (
            <>
              {hasActiveSubscription ? (
                <motion.button
                  onClick={handleUpgrade}
                  className="mt-8 w-full rounded-lg  border-orange-500 py-2 text-sm font-medium border text-orange-500 hover:bg-orange-500 hover:text-white duration-150 "
                >
                  Manage Plans
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleUpgrade}
                  disabled={isPending || fetching}
                  whileTap={{ scale: 0.985 }}
                  className={`mt-8 w-full rounded-lg ${
                    isPending || fetching
                      ? "bg-orange-200"
                      : "bg-orange-500 hover:bg-orange-500/90"
                  } py-2 text-sm font-medium text-white `}
                >
                  {isPending || fetching
                    ? "Loading..."
                    : `Upgrade to ${plan.name}`}
                </motion.button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative w-full px-8 overflow-hidden py-12 text-black lg:px-2 lg:py-12">
      <Heading />
      <PricingCards />
    </section>
  );
};

export default function PricingPage() {
  return <Pricing />;
}
