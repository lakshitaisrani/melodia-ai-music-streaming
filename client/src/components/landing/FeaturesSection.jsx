import { FEATURES } from '../../utils/landingData';

/**
 * Features Bento Grid Section
 * 6-card responsive grid (1 col → 2 col → 3 col)
 * Each card has an accent icon, title, and description.
 */
const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="section-padding bg-surface-container-lowest"
    >
      <div className="container-melodia">
        {/* Section header */}
        <div className="mb-14 text-center max-w-2xl mx-auto animate-on-scroll">
          <span className="font-mono text-label-md uppercase tracking-widest text-primary mb-3 block">
            Platform Features
          </span>
          <h2 className="text-headline-lg md:text-headline-lg font-extrabold text-on-surface mb-4">
            Crafted for the Next Generation
          </h2>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Revolutionary features designed to elevate your sound experience to a professional standard.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.id} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

/** Individual feature card with glassmorphism and hover lift */
const FeatureCard = ({ feature, index }) => {
  const accentClasses = {
    primary:   { icon: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/20'   },
    tertiary:  { icon: 'text-tertiary',  bg: 'bg-tertiary/10',  border: 'border-tertiary/20'  },
    secondary: { icon: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
  };
  const accent = accentClasses[feature.accent] || accentClasses.primary;

  return (
    <div
      className="glass-card p-7 flex flex-col gap-5 animate-on-scroll"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Icon container */}
      <div
        className={`w-13 h-13 rounded-2xl ${accent.bg} ${accent.border} border flex items-center justify-center shrink-0`}
        style={{ width: '52px', height: '52px' }}
      >
        <span className={`text-2xl font-bold leading-none ${accent.icon}`} aria-hidden="true">
          {feature.icon}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-headline-md font-bold text-on-surface mb-2">{feature.title}</h3>
        <p className="text-body-md text-on-surface-variant leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
};

export default FeaturesSection;
