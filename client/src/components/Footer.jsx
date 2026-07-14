import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { FOOTER_LINKS } from '../utils/landingData';
// Note: Footer is in src/components/, so landingData is at ../utils/landingData ✓

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Site-wide Footer
 * 4-column responsive grid: brand + 3 link groups.
 * On mobile stacks vertically.
 */
const Footer = () => {
  return (
    <footer className="bg-background border-t border-outline-variant">
      <div className="container-melodia py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* ── Brand column ── */}
          <div className="flex flex-col gap-5 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Music2 size={18} className="text-on-primary" />
              </span>
              <span className="font-extrabold text-headline-md text-on-surface">Melodia</span>
            </Link>

            <p className="text-body-md text-on-surface-variant leading-relaxed max-w-xs">
              Crafting the future of sound through artificial intelligence and uncompromising quality.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: 'Twitter / X', icon: '𝕏' },
                { label: 'Website', icon: '🌐' },
                { label: 'YouTube', icon: '▶' },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200 text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-label-md uppercase tracking-widest text-on-surface mb-5">
                {group}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-mono text-label-sm text-on-surface-variant hover:text-tertiary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-label-sm text-on-surface-variant">
            © {CURRENT_YEAR} Melodia AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-mono text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
