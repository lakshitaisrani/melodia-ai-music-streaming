import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Music2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { setUser } from '../redux/authSlice';
import apiClient from '../services/apiClient';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';
import SocialButton, { GoogleIcon } from '../components/auth/SocialButton';

/**
 * Login Page — /login
 *
 * Two-column layout via AuthLayout.
 * Right panel contains the login card with full form.
 */
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ── Form state ── */
  const [form, setForm] = useState({
    email:    '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* ── Client-side validation ── */
  const validate = () => {
    const next = {};
    if (!form.email)    next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                        next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6)
                        next.password = 'Password must be at least 6 characters.';
    return next;
  };

  /* ── Submit handler ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      // 1. Sign in with Firebase Email/Password
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);

      // 2. Retrieve ID Token
      const idToken = await userCredential.user.getIdToken();
      
      // 4. Exchange for Melodia Session JWT
      const response = await apiClient.post('/auth/firebase', { idToken });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      const userPayload = {
        uid: user._id || user.firebaseUid,
        email: user.email,
        displayName: user.name,
        photoURL: user.photoURL,
        likedSongs: user.likedSongs || []
      };
      
      localStorage.setItem('user', JSON.stringify(userPayload));
      dispatch(setUser(userPayload));
      
      navigate('/explore');
    } catch (error) {
      console.error(error);
      let msg = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please try again.';
      } else if (error.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error.message) {
        msg = error.message;
      }
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const response = await apiClient.post('/auth/google', { idToken });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      const userPayload = {
        uid: user._id || user.firebaseUid,
        email: user.email,
        displayName: user.name,
        photoURL: user.photoURL,
        likedSongs: user.likedSongs || []
      };
      
      localStorage.setItem('user', JSON.stringify(userPayload));
      dispatch(setUser(userPayload));
      
      navigate('/explore');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Google Authentication failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout pageTitle="Sign In">
      <AuthCard>
        {/* ── Card header ── */}
        <header className="mb-8 text-center">
          {/* Logo mark */}
          <div className="flex justify-center mb-5">
            <span
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
              style={{
                background: 'linear-gradient(135deg, #b76dff 0%, #3131c0 100%)',
              }}
              aria-hidden="true"
            >
              <Music2 size={26} color="#ffffff" />
            </span>
          </div>
          <h1 className="font-extrabold text-3xl text-on-surface tracking-tight mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-on-surface-variant">
            Sign in to continue your music journey.
          </p>
        </header>

        {/* ── General error ── */}
        {errors.general && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 rounded-xl border border-error/30 bg-error/10 text-error text-sm text-center"
          >
            {errors.general}
          </div>
        )}

        {/* ── Login form ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Email */}
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            icon={<Mail size={16} />}
            error={errors.email}
          />

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            {/* Label row with Forgot Password link inline */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-mono text-xs font-medium tracking-widest uppercase text-on-surface-variant"
              >
                Password
              </label>
              <a
                href="#"
                className="font-mono text-xs text-primary hover:text-primary-fixed transition-colors underline underline-offset-2 decoration-primary/30"
              >
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id="password"
              label=""
              value={form.password}
              onChange={handleChange}
              required
              error={errors.password}
            />
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="auth-checkbox"
              aria-label="Remember me for 30 days"
            />
            <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
              Remember me for 30 days
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="relative flex items-center my-7">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="flex-shrink mx-4 font-mono text-xs uppercase tracking-widest text-outline">
            or
          </span>
          <div className="flex-grow border-t border-outline-variant" />
        </div>

        {/* ── Google (UI only) ── */}
        <div onClick={handleGoogleSignIn}>
          <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
        </div>

        {/* ── Signup link ── */}
        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-primary font-bold hover:underline underline-offset-2 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

/** Inline mini spinner for loading state */
const LoadingSpinner = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default Login;
