import React, { useState } from 'react';
import { X, Database, ShieldAlert, ShieldCheck, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { User } from '../types';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onConfigured: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onConfigured,
}) => {
  const isAuthorizedTeacher = currentUser?.role === 'teacher' && currentUser.isApproved;

  const currentConfig = supabaseService.getConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  // STRICT ACCESS CONTROL: If user is not a verified teacher, deny access and return to student dashboard
  if (!isAuthorizedTeacher) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="supabase-denied-title"
      >
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-rose-500 space-y-5 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 id="supabase-denied-title" className="text-2xl font-black text-rose-950">
              Access Denied
            </h2>
            <p className="text-sm text-slate-700 mt-2 font-medium leading-relaxed">
              Supabase cloud database configuration and administrative credentials are restricted strictly to verified teacher administrators.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-md focus:ring-4 focus:ring-blue-400 active:scale-95 transition-all"
          >
            Return to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage('Please provide both Project URL and Public Anon Key.');
      return;
    }

    setIsVerifying(true);
    setStatusMessage(null);

    // Server-side authorization and validation before applying administrative settings
    try {
      const verifyRes = await fetch('/api/admin/save-supabase-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRole: currentUser?.role,
          isApproved: currentUser?.isApproved,
          url: url.trim(),
          anonKey: anonKey.trim(),
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json().catch(() => ({}));
        setIsVerifying(false);
        soundEffects.playWarning();
        setStatusMessage(errorData.error || 'Server-side authorization failed. Administrative settings require a verified teacher account.');
        return;
      }
    } catch {
      // In offline mode, still require verified teacher role
      if (currentUser?.role !== 'teacher' || !currentUser?.isApproved) {
        setIsVerifying(false);
        setStatusMessage('Administrative settings are restricted to verified teacher accounts.');
        return;
      }
    }

    const success = supabaseService.saveConfig(url.trim(), anonKey.trim());
    setIsVerifying(false);

    if (success) {
      soundEffects.playSuccess();
      speechService.announce('Supabase credentials verified and saved. Connected to cloud database.');
      setStatusMessage('Connected successfully! Reloading session...');
      setTimeout(() => {
        onConfigured();
        onClose();
      }, 1000);
    } else {
      soundEffects.playWarning();
      setStatusMessage('Failed to initialize Supabase client. Check that URL begins with https://.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="supabase-config-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border-4 border-emerald-600 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Verified Teacher Administrator Access</span>
              </div>
              <h2 id="supabase-config-title" className="text-xl md:text-2xl font-black text-slate-900">
                Supabase Backend Configuration
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 focus:ring-4 focus:ring-emerald-600"
            aria-label="Close Supabase setup dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Secure Teacher Administration</span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            This backend configuration is protected and hidden from student learners. Use only your <strong>Public Anon Key</strong>. Never enter or expose your Supabase <strong>service_role</strong> secret key in client browsers.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="sb-url" className="block text-sm font-black text-slate-900 mb-1">
              Supabase Project URL *
            </label>
            <input
              id="sb-url"
              type="url"
              required
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-mono text-xs md:text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
            />
          </div>

          <div>
            <label htmlFor="sb-key" className="block text-sm font-black text-slate-900 mb-1">
              Supabase Public Anon Key *
            </label>
            <input
              id="sb-key"
              type="password"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-mono text-xs md:text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200"
            />
            <p className="text-xs text-slate-500 mt-1">
              Publishable anon key only. Secret database credentials and service-role keys are never stored on client devices.
            </p>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold border border-slate-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-sm shadow-md focus:ring-4 focus:ring-emerald-400 flex items-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <span>Save & Connect Cloud</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
