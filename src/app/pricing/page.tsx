"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      { text: "Unlimited practice sessions", included: true },
      { text: "4 programming languages", included: true },
      { text: "AI-powered feedback", included: true },
      { text: "Theory & documentation", included: true },
      { text: "Key concepts only", included: true, note: "hints for answers" },
      { text: "Full reference solutions", included: false },
      { text: "Detailed explanations", included: false },
      { text: "Progress export", included: false },
    ],
    cta: "Get Started",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious learners",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Full reference solutions", included: true, note: "complete answers" },
      { text: "Detailed explanations", included: true },
      { text: "Progress analytics", included: true },
      { text: "Export your progress", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to features", included: true },
    ],
    cta: "Upgrade to Pro",
    href: "/api/checkout",
    highlight: true,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const isPro = session?.user?.subscriptionTier === "pro";

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="border-b-2 border-[#00ff87] pb-1">Pricing</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Choose the plan that's right for your learning journey.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-0 border border-[#222]">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`
                p-8 
                ${index === 0 ? "md:border-r border-[#222]" : ""}
                ${plan.highlight ? "bg-[#00ff87]/5" : ""}
              `}
            >
              {/* Plan Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  {plan.highlight && (
                    <span className="text-[10px] px-2 py-0.5 bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30">
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-600 text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <span className={feature.included ? "text-[#00ff87]" : "text-gray-700"}>
                      {feature.included ? "✓" : "×"}
                    </span>
                    <span className={`text-sm ${feature.included ? "text-gray-300" : "text-gray-600"}`}>
                      {feature.text}
                      {feature.note && (
                        <span className="text-gray-600 text-xs ml-1">({feature.note})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isPro && plan.name === "Pro" ? (
                <div className="text-center py-3 border border-[#00ff87] text-[#00ff87] text-sm">
                  Current Plan
                </div>
              ) : (
                <Link
                  href={plan.href}
                  className={`
                    block text-center py-3 text-sm font-medium transition-colors
                    ${plan.highlight 
                      ? "bg-[#00ff87] text-black hover:bg-[#00cc6a]"
                      : "border border-[#333] text-gray-300 hover:border-[#00ff87] hover:text-[#00ff87]"
                    }
                  `}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-0 border border-[#222]">
            <div className="p-6 border-b border-[#222]">
              <h3 className="font-medium text-white mb-2">What's the difference between Free and Pro?</h3>
              <p className="text-sm text-gray-500">
                Free users get key concepts and hints to guide their answers. Pro users see complete reference solutions with detailed explanations, helping them learn faster.
              </p>
            </div>
            <div className="p-6 border-b border-[#222]">
              <h3 className="font-medium text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-gray-500">
                Yes! You can cancel your Pro subscription at any time. You'll keep Pro access until the end of your billing period.
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-white mb-2">Do you offer student discounts?</h3>
              <p className="text-sm text-gray-500">
                Yes! Students with a valid .edu email get 50% off Pro. Contact us at support@learn2code.dev.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
