/**
 * Navigation Header Component
 */

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">🏓</span>
            <span className="font-bold text-lg">MTTF</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-blue-100 transition">
              Home
            </Link>
            <Link href="/players" className="hover:text-blue-100 transition">
              Players
            </Link>
            <Link href="/tournaments" className="hover:text-blue-100 transition">
              Tournaments
            </Link>
            <Link href="/rankings" className="hover:text-blue-100 transition">
              Rankings
            </Link>
            <Link href="/news" className="hover:text-blue-100 transition">
              News
            </Link>
            <Link href="/admin/login" className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/" className="block hover:text-blue-100">
              Home
            </Link>
            <Link href="/players" className="block hover:text-blue-100">
              Players
            </Link>
            <Link href="/tournaments" className="block hover:text-blue-100">
              Tournaments
            </Link>
            <Link href="/rankings" className="block hover:text-blue-100">
              Rankings
            </Link>
            <Link href="/news" className="block hover:text-blue-100">
              News
            </Link>
            <Link href="/admin/login" className="block bg-white text-blue-600 px-4 py-2 rounded-md font-medium">
              Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
