import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  TrendingUp,
  Boxes,
  FileText,
  IndianRupee,
  Download,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DailyTransactions: React.FC = () => {
  const { branches, invoices, setSelectedInvoice } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-09-24');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');

  // Baseline mock data from Screen 14:
  // Branch 1: 45 bills, ₹32,500, 120 items
  // Branch 2: 51 bills, ₹28,400, 98 items
  // Branch 3: 32 bills, ₹24,700, 86 items
  const newInvoices = invoices.filter(
    (inv) => !['inv-1001', 'inv-1002', 'inv-1003', 'inv-1004', 'inv-1005'].includes(inv.id)
  );

  const allBranchSummaryRows = branches.map((b, idx) => {
    const baseBills = idx === 0 ? 45 : idx === 1 ? 51 : idx === 2 ? 32 : 0;
    const baseSales = idx === 0 ? 32500 : idx === 1 ? 28400 : idx === 2 ? 24700 : 0;
    const baseItems = idx === 0 ? 120 : idx === 1 ? 98 : idx === 2 ? 86 : 0;

    const bNew = newInvoices.filter((i) => i.branchId === b.id);
    return {
      id: b.id,
      name: b.name,
      city: b.city,
      bills: baseBills + bNew.length,
      totalSales: baseSales + bNew.reduce((s, i) => s + i.grandTotal, 0),
      itemsSold: baseItems + bNew.reduce((s, i) => s + i.totalItems, 0),
    };
  });

  const branchSummaryRows = allBranchSummaryRows.filter(
    (b) => selectedBranchFilter === 'All' || b.id === selectedBranchFilter
  );

  const totalBills = branchSummaryRows.reduce((sum, r) => sum + r.bills, 0);
  const totalSales = branchSummaryRows.reduce((sum, r) => sum + r.totalSales, 0);
  const totalItemsSold = branchSummaryRows.reduce((sum, r) => sum + r.itemsSold, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchBranch = selectedBranchFilter === 'All' || inv.branchId === selectedBranchFilter;
    const isYesterday = selectedDate === '2026-09-23';
    const matchDate = isYesterday
      ? (inv.date === '2026-09-23' || inv.dateTime?.includes('23 Sep'))
      : (inv.date !== '2026-09-23' || inv.dateTime?.includes('24 Sep'));
    return matchBranch && matchDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#159A9C]" />
            <span>Daily Transactions (Admin View)</span>
          </h2>
          <p className="text-xs text-slate-500">
            End-of-day branch sales consolidation, invoice counts, and medicine dispensing units
          </p>
        </div>

        <button
          onClick={() => {
            const branchLines = allBranchSummaryRows
              .map((r) => `${r.name} (${r.city}): ${r.bills} bills, Rs.${r.totalSales.toLocaleString('en-IN')}, ${r.itemsSold} items`)
              .join('\n');
            const content = `Daily Consolidation Report - 24 Sep 2026\n----------------------------------------\n${branchLines}\n----------------------------------------\nTotal Network: ${totalBills} bills, Rs.${totalSales.toLocaleString('en-IN')}, ${totalItemsSold} items sold`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Daily_Report_24_Sep_2026.txt`;
            a.click();
          }}
          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-[#123B5D] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#159A9C]" />
          <span>Export Daily Summary</span>
        </button>
      </div>

      {/* Date & Branch Picker Bar matching Screen 14 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-[#159A9C]" />
          <span className="font-semibold text-slate-700">Audit Date:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-[#F7FAFC] focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C]"
          >
            <option value="2026-09-24">24 Sep 2026 (Today)</option>
            <option value="2026-09-23">23 Sep 2026 (Yesterday)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Building2 className="w-4 h-4 text-[#159A9C]" />
          <span className="font-semibold text-slate-700">Filter Branch:</span>
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-[#F7FAFC] focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C]"
          >
            <option value="All">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily Transactions Summary Table matching Screen 14 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-[#F7FAFC] border-b border-slate-200 font-bold text-xs text-[#123B5D]">
          Consolidated Branch Sales Table — 24 Sep 2026
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50/50">
                <th className="py-3 px-4 font-semibold">Branch</th>
                <th className="py-3 px-4 font-semibold text-center">Bills</th>
                <th className="py-3 px-4 font-semibold text-right">Total Sales</th>
                <th className="py-3 px-4 font-semibold text-center">Stock Items Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {branchSummaryRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#159A9C]" />
                    <span>{row.name}</span>
                    <span className="text-slate-400 font-normal">({row.city})</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    {row.bills}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#123B5D]">
                    ₹{row.totalSales.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                    {row.itemsSold} items
                  </td>
                </tr>
              ))}

              {/* Total Row matching Screen 14: Total 128 | ₹85,600 | 304 items */}
              {selectedBranchFilter === 'All' && (
                <tr className="bg-[#eef8f8] font-bold text-[#123B5D] border-t-2 border-[#159A9C]/40">
                  <td className="py-3 px-4 text-[#123B5D]">Total (All Branches)</td>
                  <td className="py-3 px-4 text-center font-mono text-sm">{totalBills}</td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-[#123B5D]">
                    ₹{totalSales.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-sm text-[#123B5D]">
                    {totalItemsSold} items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-[#123B5D] text-sm">Detailed Transaction History</h3>
            <p className="text-xs text-slate-500">Every customer invoice generated on this date</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredInvoices.length} invoices matching
          </span>
        </div>

        <div className="space-y-2">
          {filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No transactions found for this date or branch filter.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 bg-[#F7FAFC] hover:bg-slate-100/80 rounded-lg border border-slate-200 flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#eef8f8] text-[#159A9C] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#159A9C]/20">
                    #{inv.billNo}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{inv.branchName}</span>
                      <span className="text-slate-400 font-normal">· Cashier: {inv.staffName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Patient: {inv.customerName || 'Walk-in'} · {inv.dateTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#123B5D]">
                      ₹{inv.grandTotal.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {inv.totalItems} items · {inv.paymentMethod}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-[#eef8f8] hover:text-[#159A9C] text-slate-700 rounded font-semibold text-[11px] transition-colors shadow-2xs"
                  >
                    Slip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
