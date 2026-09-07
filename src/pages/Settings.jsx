import React, { useState, useEffect } from 'react';
import { useApp } from '../App.jsx';
import { 
  User, 
  KeyRound, 
  Sliders, 
  Bell, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown,
  Save,
  RotateCcw,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  Check
} from 'lucide-react';

export const Settings = () => {
  const { currentUser, updateUserProfile, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('profile');

  // Local draft state for Profile form (changes here do NOT affect the saved profile until Save is clicked)
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Inspector A',
    email: currentUser?.email || 'inspector.a@gov.in',
    mobile: currentUser?.mobile || '+91 98260 12345',
    department: currentUser?.department || 'Legal Metrology Department',
    designation: currentUser?.designation || 'Inspector',
    division: currentUser?.division || 'Indore Division'
  });

  // Password tab draft state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences tab draft state
  const [prefData, setPrefData] = useState({
    language: 'English',
    theme: 'system',
    autoDraftNotice: true,
    minOcrConfidence: 85,
    enforceStrictUsp: true,
    soundAlerts: false
  });

  // Notifications tab draft state
  const [notifData, setNotifData] = useState({
    emailViolations: true,
    smsCritical: true,
    dailyDigest: false,
    appPush: true
  });

  // Re-sync draft form data only when currentUser changes externally (e.g. user switch)
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.name || '',
        email: currentUser.email || '',
        mobile: currentUser.mobile || '+91 98260 12345',
        department: currentUser.department || 'Legal Metrology Department',
        designation: currentUser.designation || 'Inspector',
        division: currentUser.division || 'Indore Division'
      });
    }
  }, [currentUser]);

  // Check if there are unsaved changes in the profile form
  const hasProfileChanges = 
    formData.fullName !== (currentUser?.name || '') ||
    formData.email !== (currentUser?.email || '') ||
    formData.mobile !== (currentUser?.mobile || '+91 98260 12345') ||
    formData.department !== (currentUser?.department || 'Legal Metrology Department') ||
    formData.designation !== (currentUser?.designation || 'Inspector') ||
    formData.division !== (currentUser?.division || 'Indore Division');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiscardProfileChanges = () => {
    setFormData({
      fullName: currentUser?.name || '',
      email: currentUser?.email || '',
      mobile: currentUser?.mobile || '+91 98260 12345',
      department: currentUser?.department || 'Legal Metrology Department',
      designation: currentUser?.designation || 'Inspector',
      division: currentUser?.division || 'Indore Division'
    });
    addToast({
      type: 'info',
      title: 'Changes Discarded',
      description: 'Profile inputs reverted to current saved profile values.'
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Full name cannot be empty.'
      });
      return;
    }

    if (!formData.email.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Email address cannot be empty.'
      });
      return;
    }

    // Explicitly commit changes to the application state and persistence
    updateUserProfile({
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department,
      designation: formData.designation,
      division: formData.division
    });

    addToast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Profile and officer details have been successfully saved.'
    });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      addToast({
        type: 'error',
        title: 'Password Required',
        description: 'Please enter your current password.'
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast({
        type: 'error',
        title: 'Weak Password',
        description: 'New password must be at least 6 characters long.'
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        type: 'error',
        title: 'Mismatch',
        description: 'New password and confirm password do not match.'
      });
      return;
    }

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    addToast({
      type: 'success',
      title: 'Password Updated',
      description: 'Your security credentials have been updated successfully.'
    });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      description: 'Inspection workspace preferences updated successfully.'
    });
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Notification Settings Saved',
      description: 'Enforcement alert channels have been updated.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Officer Profile Summary (Committed data from currentUser, NOT unsubmitted inputs) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center text-center">
          {/* Avatar Graphic */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-b from-sky-100 to-emerald-50 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden mb-4">
            <svg viewBox="0 0 100 100" className="w-24 h-24 mt-2">
              {/* Head & Neck */}
              <circle cx="50" cy="38" r="18" fill="#fcd34d" />
              {/* Hair */}
              <path d="M 32 35 C 32 20, 68 20, 68 35 Z" fill="#334155" />
              {/* Suit / Collar */}
              <path d="M 22 90 L 35 60 L 65 60 L 78 90 Z" fill="#1e293b" />
              {/* Shirt Collar */}
              <polygon points="45,60 55,60 50,72" fill="#ffffff" />
              {/* Tie */}
              <polygon points="48,65 52,65 54,85 50,90 46,85" fill="#0d4734" />
            </svg>
          </div>

          {/* Displays Saved Profile from currentUser only */}
          <h3 className="text-base font-bold text-slate-900">{currentUser?.name || 'Inspector'}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{currentUser?.designation || 'Inspector'}</p>
          <p className="text-xs text-slate-500">{currentUser?.division || 'Indore Division'}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-[#0d4734] border border-emerald-200 rounded-full text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active Enforcement Officer</span>
          </div>

          <div className="w-full border-t border-slate-100 mt-5 pt-4 text-left space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentUser?.email || 'officer@gov.in'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{currentUser?.mobile || '+91 98260 12345'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentUser?.department || 'Legal Metrology Department'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="mt-5 w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Edit Profile Details
          </button>
        </div>

        {/* Right Card: Tabs & Details Form (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold pb-3 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`relative pb-3 -mb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-[#0d4734] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0d4734]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`relative pb-3 -mb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'password'
                  ? 'text-[#0d4734] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0d4734]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`relative pb-3 -mb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'text-[#0d4734] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0d4734]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`relative pb-3 -mb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'text-[#0d4734] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0d4734]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Notifications
            </button>
          </div>

          {/* TAB 1: PROFILE FORM */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {hasProfileChanges && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>You have unsaved changes. Click <strong>"Save Changes"</strong> to apply them to your profile.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDiscardProfileChanges}
                    className="text-amber-800 hover:text-amber-950 font-bold underline text-[11px] shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter officer full name"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900 font-medium"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="officer@domain.gov.in"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900 font-medium"
                  />
                </div>

                {/* Mobile No. */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile No.
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="+91 98260 12345"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900 font-medium"
                  />
                </div>

                {/* Department */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden appearance-none pr-8 cursor-pointer font-medium"
                  >
                    <option value="Legal Metrology Department">Legal Metrology Department</option>
                    <option value="Legal Metrology Enforcement Wing">Legal Metrology Enforcement Wing</option>
                    <option value="Directorate of Legal Metrology">Directorate of Legal Metrology</option>
                    <option value="Food Safety & Standards">Food Safety & Standards</option>
                    <option value="Weights and Measures Bureau">Weights and Measures Bureau</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-8 pointer-events-none" />
                </div>

                {/* Designation */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Designation
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden appearance-none pr-8 cursor-pointer font-medium"
                  >
                    <option value="Inspector">Field Inspector</option>
                    <option value="Senior Inspector">Senior Inspector</option>
                    <option value="Deputy General Manager (DGM)">Deputy General Manager (DGM)</option>
                    <option value="Senior Metrological Officer (SMO)">Senior Metrological Officer (SMO)</option>
                    <option value="Assistant Controller">Assistant Controller</option>
                    <option value="Joint Controller of Legal Metrology">Joint Controller of Legal Metrology</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-8 pointer-events-none" />
                </div>

                {/* Division */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Division Jurisdiction
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden appearance-none pr-8 cursor-pointer font-medium"
                  >
                    <option value="Indore Division">Indore Division</option>
                    <option value="Indore Central Division">Indore Central Division</option>
                    <option value="Bhopal Division">Bhopal Division</option>
                    <option value="State Headquarters, Bhopal">State Headquarters, Bhopal</option>
                    <option value="Jabalpur Division">Jabalpur Division</option>
                    <option value="Gwalior Division">Gwalior Division</option>
                    <option value="Ujjain Commercial Hub">Ujjain Commercial Hub</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-8 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>

                {hasProfileChanges && (
                  <button
                    type="button"
                    onClick={handleDiscardProfileChanges}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discard</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password (min. 6 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-slate-900"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Auto-Draft Notice (Form V)</h4>
                    <p className="text-[11px] text-slate-500">Automatically prepare compoundable notice draft upon detecting high-severity violations.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefData.autoDraftNotice}
                    onChange={(e) => setPrefData({ ...prefData, autoDraftNotice: e.target.checked })}
                    className="w-4 h-4 text-[#0d4734] rounded focus:ring-[#0d4734] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Strict Unit Sale Price (USP) Rule 18(8) Check</h4>
                    <p className="text-[11px] text-slate-500">Enforce mandatory unit sale price for commodities exceeding 100g/ml.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefData.enforceStrictUsp}
                    onChange={(e) => setPrefData({ ...prefData, enforceStrictUsp: e.target.checked })}
                    className="w-4 h-4 text-[#0d4734] rounded focus:ring-[#0d4734] cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">Minimum OCR Confidence Threshold</h4>
                    <span className="text-xs font-mono font-bold text-[#0d4734]">{prefData.minOcrConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={prefData.minOcrConfidence}
                    onChange={(e) => setPrefData({ ...prefData, minOcrConfidence: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#0d4734] cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Detections below this confidence will be flagged for Mandatory Officer Review.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Critical Violation Email Alerts</h4>
                    <p className="text-[11px] text-slate-500">Receive immediate email dispatch whenever a Section 36 penalty violation is verified.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifData.emailViolations}
                    onChange={(e) => setNotifData({ ...notifData, emailViolations: e.target.checked })}
                    className="w-4 h-4 text-[#0d4734] rounded focus:ring-[#0d4734] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">SMS Alerts for Field Seizures</h4>
                    <p className="text-[11px] text-slate-500">Instant SMS on mobile number when short measure beyond MPE is logged.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifData.smsCritical}
                    onChange={(e) => setNotifData({ ...notifData, smsCritical: e.target.checked })}
                    className="w-4 h-4 text-[#0d4734] rounded focus:ring-[#0d4734] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Daily Regional Enforcement Digest</h4>
                    <p className="text-[11px] text-slate-500">Summary of all scans and compliance stats conducted across your division.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifData.dailyDigest}
                    onChange={(e) => setNotifData({ ...notifData, dailyDigest: e.target.checked })}
                    className="w-4 h-4 text-[#0d4734] rounded focus:ring-[#0d4734] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
