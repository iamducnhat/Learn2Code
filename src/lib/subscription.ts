"use client";

import { useSession } from "next-auth/react";

export function useSubscription() {
  const { data: session, status } = useSession();

  const isPro = session?.user?.subscriptionTier === "pro";
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return {
    isPro,
    isLoading,
    isAuthenticated,
    tier: session?.user?.subscriptionTier || "free",
  };
}

export function canAccessFeature(feature: string, tier: string): boolean {
  const proFeatures = [
    "full_solutions",
    "unlimited_practice",
    "detailed_feedback",
    "export_progress",
    "priority_support",
  ];

  if (tier === "pro") return true;
  return !proFeatures.includes(feature);
}
