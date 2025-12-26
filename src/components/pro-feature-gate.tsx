"use client";

import Link from "next/link";

interface ProFeatureGateProps {
  children: React.ReactNode;
  isPro: boolean;
  feature: string;
  fallback?: React.ReactNode;
}

export function ProFeatureGate({ children, isPro, feature, fallback }: ProFeatureGateProps) {
  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="border border-[#222] bg-[#111] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-[#00ff87]/20 text-[#00ff87] px-2 py-0.5">PRO</span>
        <span className="text-sm text-white">{feature}</span>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        Upgrade to Pro to unlock this feature.
      </p>
      <Link
        href="/pricing"
        className="text-xs text-[#00ff87] hover:underline"
      >
        Learn more →
      </Link>
    </div>
  );
}

export function ProBadge({ small = false }: { small?: boolean }) {
  return (
    <span className={`
      bg-gradient-to-r from-[#00ff87]/20 to-[#00cc6a]/20 
      text-[#00ff87] border border-[#00ff87]/30
      ${small ? "text-[8px] px-1 py-0.5" : "text-[10px] px-2 py-0.5"}
    `}>
      PRO
    </span>
  );
}
