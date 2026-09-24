import React, { useState } from 'react';
import {
  Settings,
  Building2,
  FileText,
  Sliders,
  Bell,
  CheckCircle,
  Save,
  Printer,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useApp();

  const [hospitalName, setHospitalName] = useState('MediCare Hospital & Healthcare Network');
  const [tagline, setTagline] = useState('Multi-Branch Clinical Operations & Pharmacy System');
  const [phone, setPhone] = useState('+91 98765 45210');
  const [email, setEmail] = useState('admin@medicare.com');
  const [currency, setCurrency] = useState('₹');
  const [invoicePrefix, setInvoicePrefix] = useState('MED-');
  const [receiptFooter, setReceiptFooter] = useState('Thank You! Visit Again · Valid prescription required for refills.');
  const [defaultThreshold, setDefaultThreshold] = useState(10);
  const [enableLowStockAlerts, setEnableLowStockAlerts] = useState(true);
  const [autoDeductStock, setAutoDeductStock] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('System settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#159A9C]" />
            <span>Hospital & System Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure central branding, thermal billing receipt parameters, stock deduction rules, and alerts
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hospital Branding */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#159A9C]" />
            <h3 className="font-bold text-[#123B5D] text-xs">Hospital / Network Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hospital / Organization Name
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Central Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Central Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Billing & Invoice Receipt Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-[#2E8B70]" />
            <h3 className="font-bold text-[#123B5D] text-xs">Customer Invoice & Receipt Layout</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Printed Receipt Footer Message
              </label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stock Management & Automation Rules */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#159A9C]" />
            <h3 className="font-bold text-[#123B5D] text-xs">Stock Automation & Alert Rules</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg border border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">
                  Automatic Real-time Stock Deduction
                </div>
                <div className="text-[11px] text-slate-500">
                  Instantly decrement branch localized inventory whenever a bill is generated
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoDeductStock}
                onChange={(e) => setAutoDeductStock(e.target.checked)}
                className="w-4 h-4 text-[#159A9C] focus:ring-[#159A9C] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg border border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">
                  Low Stock Threshold Trigger
                </div>
                <div className="text-[11px] text-slate-500">
                  Generate immediate alert in Admin Portal when branch stock falls below threshold
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableLowStockAlerts}
                onChange={(e) => setEnableLowStockAlerts(e.target.checked)}
                className="w-4 h-4 text-[#159A9C] focus:ring-[#159A9C] rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
