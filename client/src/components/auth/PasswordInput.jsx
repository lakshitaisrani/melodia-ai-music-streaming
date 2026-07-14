import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * PasswordInput
 * Password field with a show/hide visibility toggle.
 * Extends InputField's styling approach.
 *
 * @param {string}   id
 * @param {string}   label
 * @param {string}   value
 * @param {Function} onChange
 * @param {boolean}  required
 * @param {string}   error
 * @param {string}   placeholder
 */
const PasswordInput = ({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  required = false,
  error,
  placeholder = '••••••••',
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-xs font-medium tracking-widest uppercase text-on-surface-variant ml-0.5"
        >
          {label}
        </label>
      )}

      <div className="auth-input-wrapper">
        {/* Lock icon on the left */}
        <span className="auth-input-icon" aria-hidden="true">
          <Lock size={16} />
        </span>

        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={visible ? 'off' : 'current-password'}
          aria-required={required}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          /* Extra right padding so text doesn't overlap toggle button */
          className="auth-input auth-input-pr"
        />

        {/* Visibility toggle on the right */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-3.5 text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center"
          tabIndex={0}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
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
};

export default PasswordInput;
