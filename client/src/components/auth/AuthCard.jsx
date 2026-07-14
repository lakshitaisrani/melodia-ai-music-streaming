/**
 * AuthCard
 * Glass-morphism card container used in the right panel of auth pages.
 * Wrap any form content with this component.
 *
 * @param {ReactNode} children
 * @param {string}    className  Optional additional classes
 */
const AuthCard = ({ children, className = '' }) => (
  <div
    className={`glass-panel rounded-3xl p-8 md:p-10 border border-white/8 w-full max-w-md ${className}`}
  >
    {children}
  </div>
);

export default AuthCard;
