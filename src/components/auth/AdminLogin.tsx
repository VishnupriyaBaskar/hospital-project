import React, { useState } from 'react';
import { Mail, Lock, LogIn, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onSwitchToStaff: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onSwitchToStaff }) => {
  const { loginAdmin } = useApp();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const showResetInfo = () => {
    setInfoMsg('Password reset instructions sent. Demo admin credentials: admin@gmail.com / admin123');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F7FAFC]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Brand Banner */}
        <div className="bg-[#123B5D] p-8 text-white text-center relative overflow-hidden border-b border-[#0c2942]">
          <div className="w-14 h-14 bg-white text-[#123B5D] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md font-black text-3xl border-2 border-[#C9A227]/30">
            +
          </div>
          <h2 className="text-2xl font-bold tracking-tight">MediCare</h2>
          <p className="text-slate-200 text-sm mt-0.5 font-medium">Central Admin Portal</p>
          <div className="inline-flex items-center gap-1.5 mt-2.5 bg-white/10 px-3 py-1 rounded-full text-xs text-slate-100 border border-white/15">
            <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Master Management & Branch Sync</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] bg-[#F7FAFC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] bg-[#F7FAFC]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#159A9C] rounded border-slate-300 focus:ring-[#159A9C]"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => showResetInfo()}
              className="text-[#159A9C] hover:text-[#0f7a7c] font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {infoMsg && (
            <div className="p-3 bg-[#edf7f4] border border-[#2E8B70]/30 text-[#2E8B70] rounded-lg text-xs">
              {infoMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg font-semibold text-sm shadow-md hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login as Admin</span>
          </button>

          {/* Quick Demo Access */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Demo Access
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@gmail.com');
                setPassword('admin123');
                loginAdmin();
              }}
              className="w-full py-2 bg-slate-50 hover:bg-[#edf7f4] text-slate-700 hover:text-[#2E8B70] border border-slate-200 hover:border-[#2E8B70]/40 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2E8B70]" />
              <span>One-Click Central Admin Login</span>
            </button>
          </div>

          {/* Switch to Staff */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchToStaff}
              className="text-xs text-[#123B5D] hover:text-[#159A9C] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Are you a Branch Billing Staff? Go to Staff Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
