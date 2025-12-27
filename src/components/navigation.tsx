"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserMenu } from "./user-menu";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", authRequired: true },
  { href: "/learn", label: "Practice", authRequired: false },
  { href: "/theory", label: "Theory", authRequired: false },
  { href: "/docs/languages", label: "Languages", authRequired: false },
  { href: "/docs/algorithms", label: "Algorithms", authRequired: false },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show on home page
  if (pathname === "/") return null;

  // Filter nav links based on auth status
  const filteredLinks = navLinks.filter(link => 
    !link.authRequired || (link.authRequired && session)
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#222]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={session ? "/dashboard" : "/"} className="font-bold text-white">
            <span className="border-b border-[#00ff87] pb-0.5">L2C</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-xs uppercase tracking-wider transition-colors
                  ${pathname.startsWith(link.href) 
                    ? "text-[#00ff87]" 
                    : "text-gray-600 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <UserMenu />
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#222] py-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block py-2 text-sm
                  ${pathname.startsWith(link.href) 
                    ? "text-[#00ff87]" 
                    : "text-gray-500 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
