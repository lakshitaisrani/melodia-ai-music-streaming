/**
 * FeaturePill
 * Small rounded pill tag used in the Auth Hero panel.
 *
 * @param {string} icon  - Emoji or short symbol
 * @param {string} label - Display text
 */
const FeaturePill = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 backdrop-blur-sm">
    <span aria-hidden="true" className="text-base leading-none">{icon}</span>
    <span className="font-mono text-xs font-medium tracking-wide text-on-surface">{label}</span>
  </div>
);

export default FeaturePill;
