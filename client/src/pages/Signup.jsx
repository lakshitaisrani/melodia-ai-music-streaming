import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Music2, User, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { setUser } from '../redux/authSlice';
import apiClient from '../services/apiClient';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';
import SocialButton, { GoogleIcon } from '../components/auth/SocialButton';

/**
 * Signup Page — /signup
 *
 * Reuses AuthLayout and Auth components.
 */
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ── Form state ── */
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* ── Password Strength Logic ── */
  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(4, score);
  };
  const strength = getPasswordStrength(form.password);

  /* ── Client-side validation ── */
  const validate = () => {
    const next = {};
    if (!form.name) next.name = 'Full name is required.';
    if (!form.email) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match.';
    if (!form.terms) next.terms = 'You must agree to the terms.';
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
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      
      // 2. Set user display name
      await updateProfile(userCredential.user, { displayName: form.name });
      
      // 3. Retrieve ID Token
      const idToken = await userCredential.user.getIdToken();
      
      // 4. Save user to MongoDB on backend
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
      let msg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.';
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
    <AuthLayout pageTitle="Sign Up">
      <AuthCard>
        {/* ── Card header ── */}
        <header className="mb-8 text-center">
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
          <h2 className="font-extrabold text-3xl text-on-surface tracking-tight mb-1">
            Create Your Account
          </h2>
          <p className="text-sm text-on-surface-variant">
            Start your personalized music journey today.
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



        {/* ── Signup form ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Full Name */}
          <InputField
            id="name"
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            icon={<User size={16} />}
            error={errors.name}
          />

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



          {/* Password with Strength Indicator */}
          <div className="flex flex-col gap-1.5">
            <PasswordInput
              id="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              required
              error={errors.password}
              placeholder="••••••••"
            />
            {/* Strength meter */}
            <div className="flex gap-1 px-1 mt-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 rounded-sm flex-1 transition-colors duration-300 ${
                    strength >= level ? 'bg-primary' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
            placeholder="••••••••"
          />

          {/* T&C Checkbox */}
          <div className="flex flex-col gap-1 mt-1">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="auth-checkbox mt-0.5"
                aria-label="I agree to the Terms and Privacy Policy"
              />
              <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-snug">
                I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && (
              <p className="font-mono text-xs text-error ml-7 mt-0.5" role="alert">
                {errors.terms}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Creating Account…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <ArrowRight size={20} />
              </span>
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

        {/* ── Login link ── */}
        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary font-bold hover:underline underline-offset-2 transition-colors"
          >
            Login
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

export default Signup;
