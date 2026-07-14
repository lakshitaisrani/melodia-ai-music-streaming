/**
 * InputField
 * Labeled text/email/tel input with a leading icon.
 * Styling via .auth-input and .auth-input-wrapper classes in index.css.
 *
 * @param {string}    id          - Input id (also used for htmlFor)
 * @param {string}    label       - Visible label text
 * @param {string}    type        - Input type (default: "text")
 * @param {string}    placeholder
 * @param {string}    value
 * @param {Function}  onChange
 * @param {boolean}   required
 * @param {string}    autoComplete
 * @param {ReactNode} icon        - Lucide icon element (16–18px)
 * @param {string}    error       - Error message (if any)
 */
const InputField = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  autoComplete,
  icon,
  error,
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="font-mono text-xs font-medium tracking-widest uppercase text-on-surface-variant ml-0.5"
    >
      {label}
    </label>

    <div className="auth-input-wrapper">
      {icon && (
        <span className="auth-input-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="auth-input"
      />
    </div>

    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="font-mono text-xs text-error ml-0.5 mt-0.5"
      >
        {error}
      </p>
    )}
  </div>
);

export default InputField;
