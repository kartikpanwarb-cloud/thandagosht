import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="mt-20 border-t border-line bg-canvas-soft/70 relative overflow-hidden"
    >
      {/* Wavy hand-drawn divider */}
      <svg viewBox="0 0 1440 40" className="absolute inset-x-0 top-0 w-full h-6 text-accent-dark/30" preserveAspectRatio="none" aria-hidden>
        <path d="M0 22 C 200 4, 360 36, 560 20 S 940 4, 1120 22 1440 16 1440 16"
          fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>

      <div className="page-container py-14 relative">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-ink text-canvas font-display font-bold">
                B
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-canvas-soft" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">BASERA</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              A small, handcrafted directory of rooms, PGs &amp; flats in Srinagar
              (Garhwal). Built quietly, with care, for students &amp; owners alike.
            </p>
            <p className="mt-4 font-hand text-2xl text-accent-dark leading-none">
              made in the hills · with chai &amp; ☕
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/listings" className="text-ink hover:text-accent-dark transition">Browse rooms</Link></li>
              <li><Link to="/register" className="text-ink hover:text-accent-dark transition">List your room</Link></li>
              <li><Link to="/dashboard" className="text-ink hover:text-accent-dark transition">Owner dashboard</Link></li>
              <li><Link to="/listings?roomType=PG" className="text-ink hover:text-accent-dark transition">PGs near campus</Link></li>
            </ul>
          </div>

          {/* Stay safe */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Stay safe</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-dark shrink-0" />
                Always inspect the room in person before paying.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-dark shrink-0" />
                Never share OTPs or bank details with owners.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-dark shrink-0" />
                Prefer in-person token deposits with a written receipt.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-ink-subtle md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} BASERA — Srinagar, Garhwal · Uttarakhand.</p>
          <p className="font-hand text-base text-ink-muted">designed minimally · listings updated daily</p>
        </div>
      </div>
    </footer>
  );
}
