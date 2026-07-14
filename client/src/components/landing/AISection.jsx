import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';

/**
 * AI Highlight / CTA Section
 * Full-width glass panel with:
 * - Left: headline, copy, social proof
 * - Right: AI brain visual
 * Also serves as the main CTA to sign up.
 */
const AISection = () => {
  return (
    <section id="ai" className="section-padding overflow-hidden relative">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #3cddc7 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-[100px] opacity-15"
        style={{ background: 'radial-gradient(circle, #842bd2 0%, transparent 70%)' }}
      />

      <div className="container-melodia">
        <div className="glass-panel rounded-[2.5rem] border border-white/10 p-10 md:p-16 xl:p-20 relative overflow-hidden animate-on-scroll">
          {/* Subtle inner gradient overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
            style={{
              background:
                'linear-gradient(135deg, rgba(132,43,210,0.08) 0%, rgba(60,221,199,0.05) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-14 xl:gap-20">

            {/* ── Left: copy ── */}
            <div className="flex-1 space-y-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles size={14} className="text-primary" />
                <span className="font-mono text-label-sm uppercase tracking-widest text-primary">
                  Melodia AI Engine
                </span>
              </div>

              <h2 className="font-extrabold text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.1] tracking-tight">
                Music That{' '}
                <br className="hidden sm:block" />
                <span className="gradient-text">Understands You.</span>
              </h2>

              <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Our proprietary AI analyzes over 50 sonic dimensions of every track you love
                to predict what you'll want to hear next — even before you know it yourself.
              </p>

              {/* Social proof row */}
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                <AvatarStack />
                <p className="font-mono text-label-md text-on-surface-variant">
                  Join <span className="text-primary font-bold">2M+</span> listeners discovering daily.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <Link to="/signup" className="btn-primary gap-2">
                  Try AI Mix Free
                  <ChevronRight size={18} />
                </Link>
                <Link to="/explore" className="btn-ghost gap-2">
                  Explore Music
                </Link>
              </div>
            </div>

            {/* ── Right: AI visual ── */}
            <div className="flex-1 w-full max-w-md lg:max-w-none animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="relative group">
                <div
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"
                  style={{ background: 'linear-gradient(135deg, #ddb7ff, #3cddc7)' }}
                />
                <div className="relative glass-panel rounded-[2rem] overflow-hidden border border-white/15 aspect-video">
                  <img
                    src="/ai-brain.png"
                    alt="AI neural network visualization representing Melodia's smart recommendation engine"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Glare overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
          className={`w-10 h-10 rounded-full border-2 border-surface bg-gradient-to-br ${c} flex items-center justify-center text-xs font-bold text-white shadow-md`}
        >
          {initials[i]}
        </div>
      ))}
    </div>
  );
};

export default AISection;
