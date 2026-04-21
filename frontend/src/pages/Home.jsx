import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';
import { LOCALITIES, ROOM_TYPES } from '../constants.js';

/* ---------- Inline mini SVGs ---------- */
const Squiggle = ({ className = '' }) => (
  <svg viewBox="0 0 120 12" className={className} fill="none" aria-hidden>
    <path d="M2 6 C 18 -2, 38 14, 60 6 S 102 -2, 118 6"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
const Arrow = ({ className = '' }) => (
  <svg viewBox="0 0 36 14" className={className} fill="none" aria-hidden>
    <path d="M2 7 C 12 2, 22 12, 32 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 3 L33 7 L28 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Star = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2.5l2.6 6.4 6.9.5-5.3 4.5 1.7 6.8L12 17.3 6.1 20.7l1.7-6.8L2.5 9.4l6.9-.5L12 2.5z" />
  </svg>
);

/* ---------- Decorative hand-drawn home illustration ---------- */
const HouseDoodle = () => (
  <svg viewBox="0 0 320 280" className="w-full h-auto" aria-hidden>
    <defs>
      <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="#1B1B1F" opacity="0.18" />
      </pattern>
    </defs>

    {/* faint dotted background patch */}
    <rect x="20" y="40" width="280" height="220" rx="22" fill="url(#dots)" />

    {/* mountains behind */}
    <path d="M30 180 L100 90 L150 150 L210 70 L300 180 Z"
      fill="none" stroke="#1B1B1F" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M70 180 L120 130 L150 160" stroke="#D9911A" strokeWidth="2.4" fill="none" strokeLinecap="round" />

    {/* sun */}
    <circle cx="245" cy="78" r="22" fill="#FDDF9B" stroke="#1B1B1F" strokeWidth="2.4" />
    <g stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round">
      <line x1="245" y1="40" x2="245" y2="48" />
      <line x1="245" y1="108" x2="245" y2="116" />
      <line x1="207" y1="78" x2="215" y2="78" />
      <line x1="275" y1="78" x2="283" y2="78" />
      <line x1="218" y1="51" x2="223" y2="56" />
      <line x1="267" y1="100" x2="272" y2="105" />
    </g>

    {/* house */}
    <path d="M90 230 L90 160 L160 110 L230 160 L230 230 Z"
      fill="#FFFFFF" stroke="#1B1B1F" strokeWidth="2.6" strokeLinejoin="round" />
    {/* roof */}
    <path d="M80 165 L160 105 L240 165"
      stroke="#1B1B1F" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* door */}
    <path d="M145 230 L145 188 Q160 178 175 188 L175 230"
      fill="#FDDF9B" stroke="#1B1B1F" strokeWidth="2.4" strokeLinejoin="round" />
    <circle cx="170" cy="210" r="1.8" fill="#1B1B1F" />
    {/* windows */}
    <rect x="105" y="175" width="26" height="22" rx="2" fill="#FFF8EB" stroke="#1B1B1F" strokeWidth="2" />
    <rect x="195" y="175" width="22" height="22" rx="2" fill="#FFF8EB" stroke="#1B1B1F" strokeWidth="2" />
    <line x1="118" y1="175" x2="118" y2="197" stroke="#1B1B1F" strokeWidth="1.6" />
    <line x1="105" y1="186" x2="131" y2="186" stroke="#1B1B1F" strokeWidth="1.6" />
    <line x1="206" y1="175" x2="206" y2="197" stroke="#1B1B1F" strokeWidth="1.6" />

    {/* chimney + smoke */}
    <rect x="200" y="125" width="14" height="22" fill="#FFFFFF" stroke="#1B1B1F" strokeWidth="2" />
    <path d="M207 118 q -6 -8 2 -16 q 8 -8 0 -18"
      stroke="#1B1B1F" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* tree */}
    <path d="M60 230 L60 200" stroke="#1B1B1F" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="60" cy="195" r="18" fill="#FFF3D6" stroke="#1B1B1F" strokeWidth="2.4" />

    {/* ground line */}
    <path d="M20 232 C 100 244, 220 220, 300 234"
      stroke="#1B1B1F" strokeWidth="2.4" strokeLinecap="round" fill="none" />

    {/* hand-written tag */}
    <g transform="translate(252,205) rotate(-6)">
      <rect width="60" height="28" rx="6" fill="#FFFFFF" stroke="#1B1B1F" strokeWidth="2" />
      <text x="30" y="19" textAnchor="middle"
        fontFamily="Caveat, cursive" fontSize="18" fill="#1B1B1F">home ♡</text>
    </g>
  </svg>
);

/* ---------- Steps content ---------- */
const STEPS = [
  { n: '01', title: 'Search smart', desc: 'Filter by locality, budget, gender & room type — find what fits in seconds.', tilt: '-rotate-1' },
  { n: '02', title: 'Talk directly', desc: 'No middlemen. Reach the owner over WhatsApp or a quick call right away.', tilt: 'rotate-1' },
  { n: '03', title: 'Move in calm', desc: 'Inspect, agree on terms in person, and settle into your new room.', tilt: '-rotate-1' },
];

const FEATURES = [
  { icon: '✦', title: 'Verified locals', desc: 'Listings checked by people who actually live in Srinagar.' },
  { icon: '✦', title: 'Hyperlocal map', desc: 'Rooms near HNBGU, Bus Stand, Bada Bazaar & more.' },
  { icon: '✦', title: 'Zero brokerage', desc: 'Connect with owners directly — no commission, ever.' },
  { icon: '✦', title: 'Real photos', desc: 'No stock filler. Honest pictures of the actual room.' },
];

const TESTIMONIALS = [
  {
    text: 'Found a quiet single-room near campus in two days. The owner was lovely and there were no middlemen.',
    name: 'Anjali Rawat',
    role: 'B.Sc Student, HNBGU',
    tilt: '-rotate-2',
  },
  {
    text: 'Listed my flat on a Sunday, got three serious enquiries by Tuesday. Simple and honest platform.',
    name: 'Mahesh Bhatt',
    role: 'Owner · Bada Bazaar',
    tilt: 'rotate-1',
  },
  {
    text: 'I love that everything feels personal — the photos are real, and the locality info actually matches.',
    name: 'Suman Negi',
    role: 'Working Professional',
    tilt: '-rotate-1',
  },
];

const FAQS = [
  { q: 'Is BASERA really free for students?', a: 'Yes. Browsing, filtering and contacting owners is completely free. We never charge brokerage.' },
  { q: 'How do I list my room as an owner?', a: 'Sign up as an owner, add a few photos, set your price and locality, and you’re live in under five minutes.' },
  { q: 'Are the listings verified?', a: 'Owners are verified locally and we manually review every new listing for clarity and honesty.' },
  { q: 'Can I edit or unlist my room later?', a: 'Absolutely. Use the owner dashboard to edit details, mark a room as taken, or remove it anytime.' },
];

/* ---------- Page ---------- */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const [search, setSearch] = useState('');
  const [locality, setLocality] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/rooms?limit=4')
      .then((res) => {
        const rooms = Array.isArray(res.data) ? res.data : (res.data.rooms || []);
        setFeatured(rooms.slice(0, 4));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (locality) params.set('locality', locality);
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div id="home-page">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* warm wash */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-50 via-canvas to-canvas" />
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 18% 22%, rgba(253,223,155,0.55), transparent 38%), radial-gradient(circle at 82% 12%, rgba(217,145,26,0.18), transparent 40%)',
            }}
          />
        </div>

        {/* tiny floating decorations */}
        <Star className="absolute left-[6%] top-[18%] w-3 text-accent-dark/70 hidden md:block animate-float" style={{ ['--r']: '-8deg' }} />
        <Star className="absolute right-[12%] top-[10%] w-4 text-accent-dark/60 hidden md:block animate-float" style={{ ['--r']: '12deg', animationDelay: '1.4s' }} />
        <Star className="absolute right-[6%] bottom-[14%] w-3 text-accent-dark/60 hidden md:block animate-float" style={{ ['--r']: '6deg', animationDelay: '2.4s' }} />

        <div className="page-container relative grid lg:grid-cols-12 gap-10 lg:gap-8 items-center !py-16 lg:!py-24">
          {/* left: copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas-card/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-ink-muted shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-dark animate-pulse" />
              Made in Srinagar · Garhwal, Uttarakhand
            </div>

            <h1 className="mt-6 font-display font-extrabold tracking-tight text-ink leading-[0.98]
              text-[44px] sm:text-[56px] lg:text-[72px]">
              <span className="block">A calmer way to</span>
              <span className="block">
                find your <span className="hand-underline italic text-accent-dark">room</span>{' '}
                <span className="font-hand text-accent-dark text-[0.78em] align-baseline relative -top-1">in the hills.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted">
              BASERA is a small, handcrafted directory of rooms, PGs and flats across
              Srinagar (Garhwal). Real owners, honest photos, zero brokerage — just a
              quiet way to land somewhere that feels like home.
            </p>

            {/* search card */}
            <form
              onSubmit={submitSearch}
              className="mt-8 paper-card p-2.5 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-1 max-w-2xl"
              data-testid="hero-search"
            >
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Try ‘single room near HNBGU’"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-ink-subtle"
                />
              </div>
              <div className="hidden sm:block w-px bg-line my-1.5" />
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="px-3 py-2 text-sm bg-transparent outline-none text-ink rounded-lg sm:rounded-none focus:bg-canvas-soft"
              >
                <option value="">Any locality</option>
                {LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button type="submit" className="btn-accent !rounded-full !px-5">
                Search
                <Arrow className="w-5 h-3" />
              </button>
            </form>

            {/* quick chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-subtle">Popular:</span>
              {['HNBGU Campus', 'Bada Bazaar', 'PG', '1BHK'].map((tag) => (
                <Link
                  key={tag}
                  to={`/listings?${LOCALITIES.includes(tag) ? 'locality' : 'roomType'}=${encodeURIComponent(tag)}`}
                  className="chip hover:border-accent/60 hover:text-accent-dark transition"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* social proof */}
            <div className="mt-8 flex items-center gap-5">
              <div className="flex -space-x-2">
                {['#FDDF9B','#FFE9C4','#F5E0BE','#E8D5A8'].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-canvas grid place-items-center text-[11px] font-bold text-ink"
                    style={{ background: c }}>
                    {['A','M','S','R'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-accent-dark">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" />)}
                  <span className="ml-1 font-semibold text-ink">4.9</span>
                </div>
                <p className="text-xs text-ink-muted">loved by 500+ students &amp; owners</p>
              </div>
            </div>
          </div>

          {/* right: doodle */}
          <div className="lg:col-span-5 relative">
            <div className="paper-card p-6 sm:p-8 max-w-md mx-auto relative">
              <span className="tape" />
              <HouseDoodle />
              <div className="mt-3 flex items-center justify-between">
                <p className="font-hand text-xl text-ink">a place to come back to.</p>
                <span className="font-hand text-accent-dark text-lg">— BASERA</span>
              </div>
            </div>

            {/* floating mini-stat */}
            <div className="hidden md:flex absolute -left-6 bottom-6 paper-card px-4 py-3 items-center gap-3 -rotate-3 shadow-lift">
              <div className="h-9 w-9 rounded-full bg-accent-100 grid place-items-center text-accent-dark text-lg">⛰</div>
              <div>
                <p className="text-xs text-ink-muted">Rooms across</p>
                <p className="text-sm font-semibold text-ink">6+ localities</p>
              </div>
            </div>
            <div className="hidden md:flex absolute -right-4 top-6 paper-card px-4 py-3 items-center gap-3 rotate-3 shadow-lift">
              <div className="h-9 w-9 rounded-full bg-accent-100 grid place-items-center text-accent-dark text-lg">₹</div>
              <div>
                <p className="text-xs text-ink-muted">Starts from</p>
                <p className="text-sm font-semibold text-ink">₹2,500/mo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE STRIP ============ */}
      <section className="border-y border-line bg-canvas-soft/60 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...Array(2)].flatMap((_, dup) =>
            ['Single rooms', 'Double sharing', 'PG with meals', '1BHK flats', 'Working women PGs',
             'Near HNBGU', 'Bada Bazaar', 'Furnished', 'WiFi included', 'Power backup']
              .map((w, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-6 px-8 text-ink-muted text-sm">
                  <span className="font-display italic text-ink">{w}</span>
                  <Star className="w-3 h-3 text-accent-dark/60" />
                </span>
              ))
          )}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="page-container !py-20" id="how-it-works">
        <div className="max-w-2xl">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Three small steps to a <span className="hand-underline hand-underline-ink">good landing</span>.
          </h2>
          <p className="mt-3 text-ink-muted">
            We kept the flow short on purpose. Less clicking, more moving in.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className={`paper-card p-7 ${s.tilt} hover:rotate-0 transition-transform duration-300`}>
              <div className="flex items-start justify-between">
                <span className="font-hand text-5xl text-accent-dark leading-none">{s.n}</span>
                <Squiggle className="w-14 text-accent-dark/60" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ POPULAR LOCALITIES ============ */}
      <section className="page-container !pt-0 !pb-20" id="localities">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="eyebrow">Popular pockets</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Where <span className="text-italic-serif text-accent-dark">people</span> are landing.
            </h2>
          </div>
          <Link to="/listings" className="text-sm font-semibold text-ink hover:text-accent-dark inline-flex items-center gap-2">
            Browse all <Arrow className="w-6 h-3" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {LOCALITIES.map((loc, i) => (
            <Link
              key={loc}
              to={`/listings?locality=${encodeURIComponent(loc)}`}
              className={`group paper-card p-5 hover:-translate-y-1 hover:shadow-lift transition-all duration-300 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'} hover:rotate-0`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-full bg-accent-100 grid place-items-center text-accent-dark text-lg">📍</div>
                <Arrow className="w-7 h-3 text-ink-subtle group-hover:text-accent-dark transition" />
              </div>
              <p className="font-display text-lg font-semibold leading-tight">{loc}</p>
              <p className="mt-1 text-xs text-ink-muted">View rooms →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="bg-canvas-soft/70 border-y border-line">
        <div className="page-container !py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <span className="eyebrow">Why BASERA</span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Built small, with <span className="font-hand text-accent-dark text-[1.15em]">care</span>.
              </h2>
              <p className="mt-4 text-ink-muted">
                We are not a big portal. We are a tiny team that knows every gully of
                Srinagar — and we want your move-in to feel just as familiar.
              </p>
              <Link to="/listings" className="btn-primary mt-7">Start exploring</Link>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="card p-6 card-hover">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-accent-100 grid place-items-center text-accent-dark font-bold">
                      {f.icon}
                    </span>
                    <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED ROOMS ============ */}
      <section className="page-container !py-20" id="featured">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div>
            <span className="eyebrow">Hand-picked</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Recently <span className="hand-underline hand-underline-ink">added rooms</span>.
            </h2>
          </div>
          <Link to="/listings" className="text-sm font-semibold text-ink hover:text-accent-dark inline-flex items-center gap-2">
            View all listings <Arrow className="w-6 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-canvas-soft" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-canvas-soft rounded w-3/4" />
                  <div className="h-3 bg-canvas-soft rounded w-1/2" />
                  <div className="h-8 bg-canvas-soft rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="paper-card text-center py-16 px-6">
            <div className="text-5xl mb-3">🏘️</div>
            <p className="font-display text-xl font-semibold">No listings yet — be the first!</p>
            <p className="text-sm text-ink-muted mt-1">Owners get free placement on the front page in the early days.</p>
            <Link to="/register" className="btn-primary mt-5 inline-block">Get started</Link>
          </div>
        )}

        {/* room type filter chips */}
        <div className="mt-10 flex flex-wrap items-center gap-2 justify-center">
          <span className="text-xs text-ink-subtle uppercase tracking-wider">Looking for:</span>
          {ROOM_TYPES.map((t) => (
            <Link
              key={t}
              to={`/listings?roomType=${encodeURIComponent(t)}`}
              className="chip hover:border-accent/60 hover:text-accent-dark transition"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-canvas-soft/70 border-y border-line" id="testimonials">
        <div className="page-container !py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="eyebrow justify-center">Kind words</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Notes from <span className="hand-circle">people</span> who landed well.
            </h2>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className={`paper-card p-7 ${t.tilt} hover:rotate-0 transition-transform duration-300`}
              >
                <div className="flex gap-1 text-accent-dark mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" />)}
                </div>
                <blockquote className="font-display text-[17px] leading-relaxed text-ink">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent-100 grid place-items-center text-accent-dark font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="page-container !py-20" id="faq">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">Questions</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Things people often <span className="text-italic-serif text-accent-dark">ask</span>.
            </h2>
            <p className="mt-4 text-ink-muted">
              Can’t find your answer here? Drop a message via WhatsApp from any
              listing — we usually reply within an hour.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className={`paper-card overflow-hidden transition-all ${isOpen ? 'shadow-lift' : ''}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-semibold pr-4">{f.q}</span>
                    <span className={`shrink-0 h-8 w-8 rounded-full grid place-items-center border border-line bg-canvas-soft text-ink transition-transform duration-300 ${isOpen ? 'rotate-45 bg-accent text-ink' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M7 2v10M2 7h10" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm text-ink-muted leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="page-container !pt-4 !pb-24">
        <div className="relative overflow-hidden rounded-[28px] bg-ink text-canvas px-6 sm:px-12 py-14 sm:py-20 shadow-lift">
          {/* decorative dots */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, #FDDF9B 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <Star className="absolute right-10 top-10 w-5 text-accent-200/60 animate-float hidden sm:block" />
          <Squiggle className="absolute left-10 bottom-12 w-24 text-accent-200/60 hidden sm:block" />

          <div className="relative max-w-3xl">
            <span className="font-hand text-accent-200 text-2xl">— for owners</span>
            <h2 className="mt-2 font-display font-bold tracking-tight text-4xl sm:text-5xl leading-[1.05]">
              Have a room to share?
              <br />
              <span className="text-accent-200 italic">List it in five minutes.</span>
            </h2>
            <p className="mt-5 max-w-xl text-canvas/75">
              Sign up as an owner, upload a few photos, and start receiving direct
              enquiries from real people in Srinagar — no listing fee, no commission.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-accent">
                List your room — free
                <Arrow className="w-6 h-3" />
              </Link>
              <Link to="/listings" className="inline-flex items-center gap-2 rounded-full border border-canvas/30 text-canvas font-semibold px-6 py-3 text-sm hover:bg-canvas/10 transition">
                Browse rooms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
