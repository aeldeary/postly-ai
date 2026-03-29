import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, signOutUser } from '../services/firebase';
import { ProjectContext } from '../contexts/ProjectContext';

const AuthBar: React.FC = () => {
  const { user, cloudArchive } = useAuth();
  const { appLanguage, theme } = React.useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isDark = theme === 'dark';
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try { await signInWithGoogle(); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setShowMenu(false);
  };

  const menuBg = isDark ? 'bg-[#0a1e3c] border-white/10' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  const subText = isDark ? 'text-white/50' : 'text-gray-500';

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition hover:scale-105 active:scale-95 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? '...' : (isAr ? 'تسجيل الدخول' : 'Sign in')}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl border transition hover:opacity-80"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} className="w-7 h-7 rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#bf8339] flex items-center justify-center text-white text-xs font-bold">
            {user.displayName?.[0] || user.email?.[0] || '?'}
          </div>
        )}
        <span className={`text-xs font-semibold max-w-[80px] truncate hidden sm:block ${textColor}`}>
          {user.displayName?.split(' ')[0] || user.email}
        </span>
        <svg className={`w-3 h-3 ${subText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className={`absolute ${isAr ? 'left-0' : 'right-0'} top-full mt-2 w-56 rounded-2xl border shadow-xl z-50 overflow-hidden ${menuBg}`}>
            {/* User Info */}
            <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <p className={`text-sm font-bold truncate ${textColor}`}>{user.displayName || 'User'}</p>
              <p className={`text-xs truncate mt-0.5 ${subText}`}>{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className={`text-xs ${subText}`}>
                  {isAr ? `${cloudArchive.length} عنصر محفوظ` : `${cloudArchive.length} items saved`}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isAr ? 'تسجيل الخروج' : 'Sign out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthBar;
