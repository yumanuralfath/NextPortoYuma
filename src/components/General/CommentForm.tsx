"use client";

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import AuthModal from './AuthModal'; 

const CommentForm = () => {
  const [comment, setComment] = useState('');
  const { accessToken } = useAuthStore();
  const { user } = useUserStore();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const isAuthenticated = !!accessToken;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      // TODO: Implement API call for comment submission
      console.log('User:', user);
      alert(`Comment submitted: ${comment}`);
      setComment('');
    }
  };

  const handleSuccessLogin = () => {
    setAuthModalOpen(false);
    // Mungkin ada logic tambahan setelah login sukses
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <textarea
          placeholder="Share your thoughts..."
          className="w-full h-32 p-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
          aria-label="Comment box"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl p-4 px-8 font-bold transition-colors bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-slate-400"
        >
          Submit
        </button>
      </form>

      {isAuthModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
          onSuccessLogin={handleSuccessLogin}
        />
      )}
    </>
  );
};

export default CommentForm;
