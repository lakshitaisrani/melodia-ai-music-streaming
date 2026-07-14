import { Link } from 'react-router-dom';
import { ChevronRight, Compass } from 'lucide-react';

/**
 * Hero Section — Landing Page
 *
 * Two-column layout on desktop, stacked on mobile.
 * Left: headline, sub-copy, CTAs, social proof badge.
 * Right: floating hero image with ambient glow.
 */
const HeroSection = () => {
  const scrollToTrending = (e) => {
    e.preventDefault();
    document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/4 w-[480px] h-[480px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #842bd2 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 w-[320px] h-[320px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #3cddc7 0%, transparent 70%)' }}
      />

      <div className="container-melodia relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left column: copy ── */}
          <div className="flex flex-col gap-7 animate-on-scroll">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-tertiary/20">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse-slow" />
              <span className="font-mono text-label-sm uppercase tracking-widest text-tertiary">
                New · AI Engine 2.0
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-[clamp(2.6rem,6vw,5rem)] leading-[1.08] tracking-tight text-balance">
              Listen.{' '}
              <span className="gradient-text">Discover.</span>{' '}
              Create.
            </h1>

            {/* Body copy */}
            <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Melodia redefines your auditory journey with hyper-personalized AI playlists,
              lossless streaming, and an ecosystem built for discovery. Experience music as
              a living, breathing landscape.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/signup" className="btn-primary text-base gap-2">
                Start Listening Free
                <ChevronRight size={18} />
              </Link>
              <a
                href="#trending"
                onClick={scrollToTrending}
                className="btn-ghost text-base gap-2"
              >
                <Compass size={18} />
                Explore Music
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <AvatarStack />
              <p className="text-label-md font-mono text-on-surface-variant">
                Join <span className="text-primary font-bold">2M+</span> listeners discovering daily
              </p>
            </div>
          </div>

          {/* ── Right column: hero visual ── */}
          <div className="relative animate-on-scroll" style={{ transitionDelay: '150ms' }}>
            {/* Glow halo behind image */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-full blur-[80px] opacity-30"
              style={{ background: 'linear-gradient(135deg, #842bd2, #3cddc7)' }}
            />
            {/* Card frame */}
            <div className="relative glass-panel rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-primary/10 group">
              <img
                src="/hero-headphones.png"
                alt="Premium studio headphones surrounded by neon sound waves — Melodia"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="eager"
              />
              {/* Floating mini player card */}
              <div className="absolute bottom-5 left-5 right-5 glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shrink-0">
                  <span className="text-base">♪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface truncate">Stellar Echoes</p>
                  <p className="font-mono text-label-sm text-on-surface-variant truncate">Lumina Flux</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5 items-end h-4">
                    {[3, 5, 4, 6, 3, 5].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-sm bg-primary opacity-80"
                        style={{
                          height: `${h * 3}px`,
                          animation: `pulse ${0.6 + i * 0.1}s ease-in-out infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Stacked avatar circles used for social proof */
const AvatarStack = () => {
  const colors = [
    'from-purple-500 to-indigo-600',
    'from-teal-500 to-emerald-600',
    'from-amber-500 to-orange-600',
  ];
  const initials = ['L', 'A', 'K'];
  return (
    <div className="flex -space-x-3" aria-hidden="true">
      {colors.map((c, i) => (
        <div
          key={i}
          className={`w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br ${c} flex items-center justify-center text-xs font-bold text-white shadow-md`}
        >
          {initials[i]}
        </div>
      ))}
    </div>
  );
};

export default HeroSection;
