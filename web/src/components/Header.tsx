"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import SearchBar from "./SearchBar";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🪑</span>
            <span className="text-xl font-bold text-gray-900">{SITE_NAME}</span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Nav - desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_LINKS.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-1 text-gray-600 hover:text-blue-600 rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="px-2 py-1 text-gray-600 hover:text-blue-600 rounded transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/boutique"
              className="px-2 py-1 text-gray-600 hover:text-blue-600 rounded transition-colors"
            >
              Boutique
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Search - mobile */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-2 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                href="/boutique"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm"
              >
                Boutique
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
