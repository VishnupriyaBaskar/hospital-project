import React, { useState } from 'react';
import {
  Boxes,
  Building2,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BranchStockView: React.FC = () => {
  const {
    branches,
    getStockForBranch,
    updateBranchStock,
    setCurrentAdminTab,
  } = useApp();

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Low' | 'Normal'>('All');

  // Quick Restock Modal state
  const [restockModalItem, setRestockModalItem] = useState<{
    productId: string;
    productName: string;
    currentStock: number;
    threshold: number;
  } | null>(null);
  const [quickAddQty, setQuickAddQty] = useState<number>(50);

  const stockItems = getStockForBranch(selectedBranchId);
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const filteredItems = stockItems.filter((item) => {
    const matchSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === 'All' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const lowCount = stockItems.filter((i) => i.status === 'Low').length;

  const handleQuickRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem || quickAddQty <= 0) return;
    updateBranchStock(selectedBranchId, restockModalItem.productId, Number(quickAddQty));
    setRestockModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#159A9C]" />
            <span>Branch Stock View</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time branch inventory levels, threshold compliance, and stock status
          </p>
        </div>
        <button
          onClick={() => setCurrentAdminTab('stock-update')}
          className="px-3.5 py-1.5 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add / Update Stock</span>
        </button>
      </div>

      {/* Controls Bar: Branch Dropdown + Search + Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branch Selector Dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Select Branch:
          </label>
          <div className="relative w-full md:w-64">
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] bg-[#F7FAFC]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search medicine at this branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-stretch md:self-auto justify-center">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'All'
                ? 'bg-white text-[#123B5D] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#123B5D]'
            }`}
          >
            All ({stockItems.length})
          </button>
          <button
            onClick={() => setStatusFilter('Low')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'Low'
                ? 'bg-[#faecec] text-[#D95C5C] shadow-xs font-bold border border-[#D95C5C]/30'
                : 'text-slate-600 hover:text-[#D95C5C]'
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            onClick={() => setStatusFilter('Normal')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'Normal'
                ? 'bg-white text-[#2E8B70] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal
          </button>
        </div>
      </div>

      {/* Stock Table matching Screen 9 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F7FAFC] border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#159A9C]" />
            <span className="font-bold text-[#123B5D]">{selectedBranch?.name}</span>
            <span className="text-slate-500">· {selectedBranch?.city}</span>
          </div>
          {lowCount > 0 && (
            <div className="flex items-center gap-1.5 text-[#D95C5C] font-bold bg-[#faecec] px-2.5 py-1 rounded-md border border-[#D95C5C]/30 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D95C5C]" />
              <span>{lowCount} medicines below minimum threshold!</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-right">Selling Rate</th>
                <th className="py-3.5 px-4 font-semibold text-center">Alert Threshold</th>
                <th className="py-3.5 px-4 font-semibold text-center">Current Stock</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map((item) => (
                <tr
                  key={item.product.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    item.status === 'Low' ? 'bg-[#faecec]/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{item.product.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.product.unit || 'unit'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                      {item.product.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#123B5D]">
                    ₹{item.product.rate.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                    ≤ {item.threshold}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold text-sm ${
                        item.status === 'Low' ? 'text-[#D95C5C]' : 'text-slate-800'
                      }`}
                    >
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'Low' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#faecec] text-[#D95C5C] border border-[#D95C5C]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D95C5C]"></span>
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#edf7f4] text-[#2E8B70] border border-[#2E8B70]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B70]"></span>
                        <span>Normal</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() =>
                        setRestockModalItem({
                          productId: item.product.id,
                          productName: item.product.name,
                          currentStock: item.currentStock,
                          threshold: item.threshold,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#eef8f8] text-[#159A9C] hover:bg-[#dff3f3] border border-[#159A9C]/20 transition-colors"
                    >
                      + Add Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Restock Dialog */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c2942]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-[#123B5D] text-white flex items-center justify-between">
              <h3 className="font-bold text-xs">
                Quick Restock: {restockModalItem.productName}
              </h3>
              <button
                onClick={() => setRestockModalItem(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickRestockSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-[#F7FAFC] rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Branch:</span>
                  <span className="font-semibold text-[#123B5D]">{selectedBranch?.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Stock:</span>
                  <span className="font-mono font-bold text-[#123B5D]">
                    {restockModalItem.currentStock} units
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Alert Threshold:</span>
                  <span className="font-mono text-[#D99A24] font-semibold">
                    {restockModalItem.threshold} units
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quickAddQty}
                  onChange={(e) => setQuickAddQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
                <div className="flex gap-1.5 mt-2">
                  {[25, 50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuickAddQty(preset)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-[#eef8f8] hover:text-[#159A9C] rounded text-slate-700 text-[11px] font-mono transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-[#edf7f4] rounded-lg border border-[#2E8B70]/30 flex justify-between text-xs text-[#2E8B70]">
                <span>New Resulting Stock:</span>
                <span className="font-bold font-mono">
                  {restockModalItem.currentStock + (Number(quickAddQty) || 0)} units
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  Confirm & Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
