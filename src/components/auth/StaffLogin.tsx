import React, { useState } from 'react';
import { User, Lock, Building2, LogIn, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onSwitchToAdmin: () => void;
}

export const StaffLogin: React.FC<Props> = ({ onSwitchToAdmin }) => {
  const { staff, loginStaffMember, branches } = useApp();
  const [selectedStaffId, setSelectedStaffId] = useState(
    staff.find((s) => s.role === 'Billing Staff')?.id || ''
  );
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaffId) {
      loginStaffMember(selectedStaffId);
    }
  };

  const currentStaff = staff.find((s) => s.id === selectedStaffId);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F7FAFC]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Brand Header */}
        <div className="bg-[#123B5D] p-8 text-white text-center relative overflow-hidden border-b border-[#0c2942]">
          <div className="w-14 h-14 bg-white text-[#159A9C] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md font-black text-3xl border-2 border-[#C9A227]/30">
            +
          </div>
          <h2 className="text-2xl font-bold tracking-tight">MediCare</h2>
          <p className="text-slate-200 text-sm mt-0.5 font-medium">Branch Billing Terminal</p>
          <div className="inline-flex items-center gap-1.5 mt-2.5 bg-white/10 px-3 py-1 rounded-full text-xs text-white border border-white/15">
            <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Dedicated Branch Access & POS</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-white">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Staff Member / Branch
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] bg-[#F7FAFC]"
              >
                {staff
                  .filter((s) => s.role === 'Billing Staff')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.branchName}
                    </option>
                  ))}
              </select>
            </div>
            {currentStaff && (
              <div className="mt-1.5 text-[11px] text-slate-600 bg-[#edf7f4] p-2 rounded-lg border border-[#2E8B70]/30">
                Assigned Branch: <strong className="text-[#123B5D]">{currentStaff.branchName}</strong>
              </div>
            )}
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
              <span>Remember this terminal</span>
            </label>
            <span className="text-slate-400 font-mono">Terminal #01</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg font-semibold text-sm shadow-md hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Billing Terminal</span>
          </button>

          {/* Quick Staff Fast Access Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Branch Staff Login
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginStaffMember('staff-1')}
                className="p-2 text-center rounded-lg border border-slate-200 hover:bg-[#eef8f8] hover:border-[#159A9C]/40 text-slate-700 text-xs transition-colors"
              >
                <div className="font-bold text-[#159A9C]">Arun</div>
                <div className="text-[10px] text-slate-500 truncate">Branch 1</div>
              </button>
              <button
                type="button"
                onClick={() => loginStaffMember('staff-3')}
                className="p-2 text-center rounded-lg border border-slate-200 hover:bg-[#eef8f8] hover:border-[#159A9C]/40 text-slate-700 text-xs transition-colors"
              >
                <div className="font-bold text-[#159A9C]">Priya</div>
                <div className="text-[10px] text-slate-500 truncate">Branch 2</div>
              </button>
              <button
                type="button"
                onClick={() => loginStaffMember('staff-5')}
                className="p-2 text-center rounded-lg border border-slate-200 hover:bg-[#eef8f8] hover:border-[#159A9C]/40 text-slate-700 text-xs transition-colors"
              >
                <div className="font-bold text-[#159A9C]">Karthik</div>
                <div className="text-[10px] text-slate-500 truncate">Branch 3</div>
              </button>
            </div>
          </div>

          {/* Switch to Admin */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="text-xs text-[#123B5D] hover:text-[#159A9C] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Central Administrator? Go to Admin Portal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
