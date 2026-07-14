import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import apiClient from '../services/apiClient';
import { User, Mail, Shield, Save, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: currentUser?.name || currentUser?.displayName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL
      };

      if (formData.newPassword) {
        updatePayload.password = formData.newPassword;
      }

      const response = await apiClient.put('/user/profile', updatePayload);
      const updatedUser = response.data;

      // Update Redux and localStorage
      const userPayload = {
        uid: updatedUser._id || updatedUser.firebaseUid,
        email: updatedUser.email,
        displayName: updatedUser.name,
        photoURL: updatedUser.photoURL,
        likedSongs: updatedUser.likedSongs || []
      };

      dispatch(setUser(userPayload));
      localStorage.setItem('user', JSON.stringify(userPayload));

      setSuccessMsg('Profile updated successfully!');
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (err) {
      console.error('Update profile error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow overflow-y-auto relative pb-32 animate-fade-in-up">
      <div className="px-6 md:px-12 lg:px-24 pt-24 max-w-4xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
            My Profile
          </h1>
          <p className="text-on-surface-variant text-body-lg">
            Manage your Melodia account details and credentials.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Avatar Preview Column */}
          <div className="md:col-span-4 flex flex-col items-center glass-panel rounded-3xl p-6 text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-xl mb-4 relative group">
              <img
                src={formData.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuC37mWftkGPM4yrFjGInm0CR-pBDfG7fUPFfTkW-ozfbZduJjpLHfIBgA_7DDYwHTPVsI4_vojXY6ORvDGjhnSNOPlNdjNUu3mcEJXKyTefPVcBeEUVG3AKK99kyVUkZF8ERr7aKJa_64oU4gWBd5QIcanym90VVBHwXML-0iQSZi6x9JjP31vJBUyrz5Blj5srud1DXx6RuZS_Zi1at-wAlv1Xfy-lidi522_2Q5c08z08NWhCeVMwJ4WmwXKhoa94-rJnzPLqa-Y"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-lg text-on-surface">{formData.name || 'Melodia Listener'}</h3>
            <p className="text-xs text-on-surface-variant mt-1 truncate w-full">{formData.email}</p>
          </div>

          {/* Settings Form Column */}
          <div className="md:col-span-8">
            <form onSubmit={handleUpdateProfile} className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
              {successMsg && (
                <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-sm font-medium">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-error/15 border border-error/30 text-error text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Display Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Profile Image URL</label>
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleChange}
                      className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-white/5 my-2" />

              {/* Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Account Credentials
                </h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <hr className="border-white/5 my-2" />

              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Change Password
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-semibold text-on-surface-variant">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full bg-surface-container border border-white/5 rounded-xl pl-4 pr-10 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Confirm New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover active:scale-98 text-on-primary font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 transition-all cursor-pointer mt-8"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
