/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderBar } from './components/common/HeaderBar';
import { WorkflowModal } from './components/common/WorkflowModal';
import { AdminLogin } from './components/auth/AdminLogin';
import { StaffLogin } from './components/auth/StaffLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { StaffLayout } from './components/billing/StaffLayout';

function MainAppContent() {
  const { session, showWorkflowModal, toastMessage } = useApp();
  const [loginRole, setLoginRole] = useState<'admin' | 'staff'>('admin');

  const isAuthenticated = session !== null;

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#159A9C]/20 selection:text-[#123B5D]">
      {/* Universal Top Switcher & System Navigation Header */}
      <HeaderBar />

      {/* Main Views */}
      <div className="flex-1 flex flex-col bg-[#F7FAFC]">
        {!isAuthenticated ? (
          <main className="flex-1 flex items-center justify-center p-4">
            {loginRole === 'admin' ? (
              <AdminLogin onSwitchToStaff={() => setLoginRole('staff')} />
            ) : (
              <StaffLogin onSwitchToAdmin={() => setLoginRole('admin')} />
            )}
          </main>
        ) : session?.role === 'admin' ? (
          <AdminLayout />
        ) : (
          <StaffLayout />
        )}
      </div>

      {/* Global Interactive Workflow & Architecture Diagram Modal */}
      {showWorkflowModal && <WorkflowModal />}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#123B5D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-[#123B5D]/40 shadow-slate-900/10">
            <span className="w-2 h-2 rounded-full bg-[#159A9C] animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
