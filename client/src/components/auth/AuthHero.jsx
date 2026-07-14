/**
 * AnimatedWaveform
 * Inline SVG waveform that uses CSS keyframe animation.
 * No inline styles used — animation classes defined in index.css.
 */
const AnimatedWaveform = () => (
  <div
    className="w-full max-w-xs h-16 waveform-svg overflow-hidden"
    aria-hidden="true"
    role="presentation"
  >
    <svg
      viewBox="0 0 600 80"
      preserveAspectRatio="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="authWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#b76dff" stopOpacity="0.0" />
          <stop offset="20%"  stopColor="#b76dff" stopOpacity="0.8" />
          <stop offset="50%"  stopColor="#6366f1" stopOpacity="1.0" />
          <stop offset="80%"  stopColor="#3cddc7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3cddc7" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Primary wave */}
      <path
        d="M0,40 Q75,10 150,40 T300,40 T450,40 T600,40"
        fill="none"
        stroke="url(#authWaveGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <animate
          attributeName="d"
          dur="8s"
          repeatCount="indefinite"
          values="
            M0,40 Q75,10 150,40 T300,40 T450,40 T600,40;
            M0,40 Q75,65 150,40 T300,40 T450,40 T600,40;
            M0,40 Q75,10 150,40 T300,40 T450,40 T600,40
          "
        />
      </path>
      {/* Secondary faint wave */}
      <path
        d="M0,40 Q75,65 150,40 T300,40 T450,40 T600,40"
        fill="none"
        stroke="url(#authWaveGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      >
        <animate
          attributeName="d"
          dur="11s"
          repeatCount="indefinite"
          values="
            M0,40 Q75,65 150,40 T300,40 T450,40 T600,40;
            M0,40 Q75,15 150,40 T300,40 T450,40 T600,40;
            M0,40 Q75,65 150,40 T300,40 T450,40 T600,40
          "
        />
      </path>
    </svg>
  </div>
);

/**
 * AnimatedEqualizer
 * 12 vertical bars that bounce at staggered speeds.
 * Delays defined via eq-d1 … eq-d12 CSS classes in index.css.
 */
const EQ_DELAYS = ['eq-d1','eq-d2','eq-d3','eq-d4','eq-d5','eq-d6',
                   'eq-d7','eq-d8','eq-d9','eq-d10','eq-d11','eq-d12'];

const AnimatedEqualizer = () => (
  <div
    className="flex items-end gap-1 h-10"
    aria-hidden="true"
    role="presentation"
  >
    {EQ_DELAYS.map((cls) => (
      <div
        key={cls}
        className={`eq-bar opacity-20 ${cls}`}
        style={{ height: '8px' }}    /* base height only — animation drives it */
      />
    ))}
  </div>
);

/**
 * AuthHero — Left panel of the auth two-column layout.
 *
 * @param {ReactNode} children  Optional override content (unused currently)
 */
const AuthHero = () => {
  const pills = [
    { icon: '🎵', label: 'Smart Playlists' },
    { icon: '☁️', label: 'Cloud Streaming' },
    { icon: '🤖', label: 'AI Recommendations' },
  ];

  return (
    <section
      className="relative hidden lg:flex flex-col justify-center items-start overflow-hidden lg:w-[55%] min-h-screen px-12 xl:px-20 py-16"
      aria-label="Melodia feature highlights"
    >
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/auth-hero-bg.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 auth-hero-bg" />
        {/* Left-to-right fade so content is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(9,9,11,0.0) 0%, rgba(9,9,11,0.6) 100%)',
          }}
        />
      </div>

      {/* Ambient glow blobs */}
      <div
        className="auth-blob w-80 h-80 top-10 -left-20 opacity-20"
        style={{ background: '#842bd2' }}
        aria-hidden="true"
      />
      <div
        className="auth-blob w-64 h-64 bottom-20 right-10 opacity-15"
        style={{ background: '#3cddc7', animationDelay: '3s' }}
        aria-hidden="true"
      />

      {/* ── Hero content ── */}
      <div className="relative z-10 space-y-9 max-w-xl">
        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-lg shadow-lg">
            ♪
          </span>
          <span className="font-extrabold text-2xl text-primary tracking-tight">Melodia</span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          {/* Radial glow sits behind the headline */}
          <h1 className="font-extrabold text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.1] tracking-tight text-on-surface">
            Welcome back to{' '}
            <span className="gradient-text">Melodia.</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-md">
            AI-powered music discovery, cloud streaming, and playlists designed around your taste.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3">
          {pills.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10"
            >
              <span aria-hidden="true" className="text-base">{icon}</span>
              <span className="font-mono text-xs font-medium tracking-wide text-on-surface">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Animated waveform */}
        <AnimatedWaveform />

        {/* Equalizer bars */}
        <AnimatedEqualizer />
      </div>
    </section>
  );
};

export default AuthHero;
