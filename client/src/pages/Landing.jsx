import { useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TrendingSection from '../components/landing/TrendingSection';
import AISection from '../components/landing/AISection';
import useScrollAnimation from '../hooks/useScrollAnimation';

/**
 * Landing Page — Melodia
 * Assembles all landing page sections in order.
 * Scroll animation observer is initialized here.
 */
const Landing = () => {
  // Activate scroll-triggered entrance animations
  useScrollAnimation('.animate-on-scroll');

  // Update document title
  useEffect(() => {
    document.title = 'Melodia – Listen. Discover. Create.';
    return () => { document.title = 'Melodia'; };
  }, []);

  return (
    <main className="animate-fade-in-up">
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <AISection />
    </main>
  );
};

export default Landing;
