import React, { useState } from 'react';
import {
  FileText,
  Building2,
  Plus,
  History,
  LogOut,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Shield,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffDashboard } from './StaffDashboard';
import { CreateBill } from './CreateBill';
import { BillSuccess } from './BillSuccess';
import { InvoiceDetailModal } from '../admin/InvoiceDetailModal';
import { Invoice } from '../../types';

export const StaffLayout: React.FC = () => {
  const { session, logout, invoices, setSelectedInvoice, selectedInvoice } = useApp();

  const [activeView, setActiveView] = useState<'dashboard' | 'create-bill' | 'bill-success' | 'history'>('dashboard');
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState<Invoice | null>(null);

  // History search filter
  const [historySearch, setHistorySearch] = useState('');

  const branchId = session?.branchId || 'branch-1';
  const branchName = session?.branchName || 'Branch 1 - Main Hospital';
  const staffName = session?.staffName || 'Staff Member';

  const branchInvoices = invoices.filter((inv) => inv.branchId === branchId);

  const filteredHistory = branchInvoices.filter(
    (inv) =>
      inv.billNo.includes(historySearch) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(historySearch.toLowerCase()))
  );

  const handleBillCreated = (newInv: Invoice) => {
    setLastGeneratedInvoice(newInv);
    setActiveView('bill-success');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col">
      {/* Terminal Header Bar */}
      <header className="bg-[#123B5D] border-b border-[#0c2942] sticky top-0 z-40 shadow-sm text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Brand & Terminal Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#159A9C] text-white flex items-center justify-center font-black text-lg shadow-xs">
              +
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm tracking-tight leading-none">
                  MediCare POS
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1e5077] text-slate-100 border border-[#2b6594]">
                  {branchName}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>Cashier: <strong className="text-white">{staffName}</strong></span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-[#159A9C] text-white shadow-xs'
                  : 'text-slate-200 hover:bg-[#1e5077]'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveView('create-bill')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                activeView === 'create-bill'
                  ? 'bg-[#0f7a7c] text-white ring-2 ring-white/30'
                  : 'bg-[#159A9C] text-white hover:bg-[#0f7a7c]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Bill</span>
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                activeView === 'history'
                  ? 'bg-[#159A9C] text-white shadow-xs'
                  : 'text-slate-200 hover:bg-[#1e5077]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Bill History</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-600 mx-1 hidden sm:block" />

            {/* Terminal Security Badge - Confirms branch restriction */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e5077] text-slate-200 border border-[#2b6594] text-xs font-medium" title="Terminal restricted to assigned branch">
              <Lock className="w-3.5 h-3.5 text-slate-300" />
              <span>Assigned Counter</span>
            </div>

            {/* Logout / Switch Terminal */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-[#D95C5C] transition-colors text-xs font-semibold"
              title="Sign Out of Terminal"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Terminal View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeView === 'dashboard' && (
          <StaffDashboard
            onCreateBillClick={() => setActiveView('create-bill')}
            onViewBillHistory={() => setActiveView('history')}
          />
        )}

        {activeView === 'create-bill' && (
          <CreateBill
            onBillGenerated={handleBillCreated}
            onCancel={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'bill-success' && lastGeneratedInvoice && (
          <BillSuccess
            invoice={lastGeneratedInvoice}
            onCreateAnother={() => setActiveView('create-bill')}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
                  <History className="w-5 h-5 text-[#159A9C]" />
                  <span>Branch Bill History — {branchName}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Transactions generated at this counter terminal
                </p>
              </div>

              <button
                onClick={() => setActiveView('create-bill')}
                className="px-3.5 py-1.5 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New Bill</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="Search bill number, patient name..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C]"
                />
              </div>

              <div className="text-xs text-slate-500">
                Total Bills: <strong className="font-mono text-[#123B5D]">{filteredHistory.length}</strong>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 font-semibold">Bill No</th>
                      <th className="py-3 px-4 font-semibold">Patient / Customer</th>
                      <th className="py-3 px-4 font-semibold">Date & Time</th>
                      <th className="py-3 px-4 font-semibold text-center">Items</th>
                      <th className="py-3 px-4 font-semibold text-right">Grand Total</th>
                      <th className="py-3 px-4 font-semibold text-center">Payment</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No bills recorded matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#159A9C]">
                            #{inv.billNo}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">
                              {inv.customerName || 'Walk-in'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {inv.customerPhone || 'N/A'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {inv.dateTime}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-medium">
                            {inv.totalItems}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#123B5D]">
                            ₹{inv.grandTotal.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {inv.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1 bg-[#eef8f8] hover:bg-[#dff3f3] text-[#159A9C] border border-[#159A9C]/20 rounded text-xs font-semibold shadow-2xs transition-colors"
                            >
                              View Slip
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Detail Modal when viewing past slips */}
        {selectedInvoice && (
          <InvoiceDetailModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </main>
    </div>
  );
};
