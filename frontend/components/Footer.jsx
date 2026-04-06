/**
 * Footer Component
 */

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>🏓</span> MTTF
            </h3>
            <p className="text-sm">
              Mongolian Table Tennis Federation - Promoting excellence in table tennis.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/players" className="hover:text-white transition">
                  Players
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-white transition">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-white transition">
                  Rankings
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm mb-2">
              Email: <a href="mailto:info@mttf.mn" className="hover:text-white">
                info@mttf.mn
              </a>
            </p>
            <p className="text-sm">
              Website: <a href="https://mttf.mn" className="hover:text-white">
                mttf.mn
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>
            &copy; {currentYear} Mongolian Table Tennis Federation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
