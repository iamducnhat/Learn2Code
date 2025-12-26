"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === "loading") {
    return <div className="w-8 h-8 bg-[#222] animate-pulse" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/auth/signup"
          className="text-xs px-3 py-1.5 bg-[#00ff87] text-black hover:bg-[#00cc6a] transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-[#222] flex items-center justify-center text-xs font-medium">
          {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase()}
        </div>
        {session.user?.subscriptionTier === "pro" && (
          <span className="text-[8px] px-1.5 py-0.5 bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30">
            PRO
          </span>
        )}
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-[#222] z-50">
            <div className="px-4 py-3 border-b border-[#222]">
              <p className="text-sm text-white truncate">{session.user?.name || "User"}</p>
              <p className="text-xs text-gray-600 truncate">{session.user?.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                onClick={() => setShowMenu(false)}
              >
                Profile
              </Link>
              {session.user?.subscriptionTier !== "pro" && (
                <Link
                  href="/pricing"
                  className="block px-4 py-2 text-sm text-[#00ff87] hover:bg-[#1a1a1a]"
                  onClick={() => setShowMenu(false)}
                >
                  Upgrade to Pro
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
