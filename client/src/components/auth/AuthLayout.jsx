import AuthHero from './AuthHero';

/**
 * AuthLayout
 * Full-screen two-column layout wrapper for all auth pages.
 * Left  (55%): <AuthHero> — hidden on mobile
 * Right (45%): Form content — full width on mobile
 *
 * @param {ReactNode} children   Form content for the right panel
 * @param {string}    pageTitle  Used to update document title
 */
const AuthLayout = ({ children, pageTitle = 'Melodia' }) => {
  // Update document title
  if (typeof document !== 'undefined') {
    document.title = `${pageTitle} | Melodia`;
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left hero panel ── */}
      <AuthHero />

      {/* ── Right form panel ── */}
      <main
        className="relative flex flex-col justify-center items-center w-full lg:w-[45%] min-h-screen bg-surface-container-lowest px-5 pt-24 pb-14 md:px-10 overflow-hidden"
        aria-label="Authentication form"
      >
        {/* Ambient blobs for the right panel */}
        <div
          className="auth-blob w-72 h-72 -top-10 -right-10 opacity-15"
          style={{ background: '#ddb7ff' }}
          aria-hidden="true"
        />
        <div
          className="auth-blob w-56 h-56 -bottom-8 -left-8 opacity-10"
          style={{ background: '#c0c1ff', animationDelay: '2s' }}
          aria-hidden="true"
        />


        {/* Actual form content */}
        <div className="relative z-10 w-full flex justify-center">
          {children}
        </div>

        {/* Bottom legal links */}
        <footer className="absolute bottom-6 flex gap-6" aria-label="Legal links">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
            <a
              key={item}
              href="#"
              className="font-mono text-xs text-on-surface-variant opacity-50 hover:opacity-100 hover:text-primary transition-all duration-200"
            >
              {item}
            </a>
          ))}
        </footer>
      </main>
    </div>
  );
};

export default AuthLayout;
