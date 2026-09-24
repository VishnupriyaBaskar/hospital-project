import React, { useState } from 'react';
import {
  Boxes,
  Building2,
  Package,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  History,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StockManagement: React.FC = () => {
  const {
    branches,
    products,
    updateBranchStock,
    getProductStockAtBranch,
    setCurrentAdminTab,
  } = useApp();

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [addQty, setAddQty] = useState<number>(50);

  // Audit log of adjustments done this session
  const [stockHistory, setStockHistory] = useState<
    Array<{
      id: string;
      branchName: string;
      productName: string;
      added: number;
      oldStock: number;
      newStock: number;
      time: string;
    }>
  >([]);

  const currentStock = getProductStockAtBranch(selectedBranchId, selectedProductId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const newCalculatedStock = Math.max(0, currentStock + (Number(addQty) || 0));

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId || !selectedProductId || addQty <= 0) return;

    const oldVal = currentStock;
    const addedVal = Number(addQty);
    const newVal = oldVal + addedVal;

    updateBranchStock(selectedBranchId, selectedProductId, addedVal);

    setStockHistory((prev) => [
      {
        id: `adj-${Date.now()}`,
        branchName: selectedBranch?.name || 'Branch',
        productName: selectedProduct?.name || 'Product',
        added: addedVal,
        oldStock: oldVal,
        newStock: newVal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);

    // Reset quantity
    setAddQty(50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#159A9C]" />
            <span>Add / Update Stock (Admin Only)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Dispatch central warehouse inventory to specific hospital branches and pharmacy counters
          </p>
        </div>
        <button
          onClick={() => setCurrentAdminTab('branch-stock')}
          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-[#123B5D] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <span>View All Branch Stocks</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#159A9C]" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Stock Update Form matching Screen 8 */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-[#eaf2f8] text-[#123B5D] flex items-center justify-center font-bold">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#123B5D] text-sm">Update Branch Inventory</h3>
              <p className="text-[11px] text-slate-500">
                Select target branch and medicine to restock
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateStock} className="space-y-5 text-xs">
            {/* Select Branch */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Select Branch *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] bg-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Product */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Select Product *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Package className="w-4 h-4" />
                </div>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] bg-white"
                >
                  {products.map((p) => {
                    const bStock = getProductStockAtBranch(selectedBranchId, p.id);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} — Current: {bStock} units (Rate: ₹{p.rate})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Current Stock vs Add vs New Stock calculation grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F7FAFC] rounded-xl border border-slate-200">
              <div className="text-center">
                <div className="text-[11px] text-slate-500 font-medium">Current Stock</div>
                <div
                  className={`text-xl font-bold font-mono mt-1 ${
                    selectedProduct && currentStock <= selectedProduct.threshold
                      ? 'text-[#D95C5C]'
                      : 'text-[#123B5D]'
                  }`}
                >
                  {currentStock}
                </div>
                {selectedProduct && currentStock <= selectedProduct.threshold && (
                  <span className="inline-block mt-0.5 text-[10px] text-[#D95C5C] font-semibold bg-[#faecec] border border-[#D95C5C]/30 px-1.5 py-0.2 rounded">
                    LOW
                  </span>
                )}
              </div>

              <div className="text-center border-x border-slate-200 px-2">
                <label className="block text-[11px] text-[#159A9C] font-semibold">
                  Add Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addQty}
                  onChange={(e) => setAddQty(parseInt(e.target.value) || 0)}
                  className="w-full mt-1 py-1 px-2 border border-[#159A9C]/40 rounded bg-white text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#159A9C] text-[#123B5D]"
                />
                <div className="flex justify-center gap-1 mt-1">
                  {[25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAddQty(preset)}
                      className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 hover:bg-[#eef8f8] hover:text-[#159A9C] font-mono transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-slate-500 font-medium">New Stock</div>
                <div className="text-xl font-bold font-mono mt-1 text-[#2E8B70]">
                  {newCalculatedStock}
                </div>
                <div className="text-[10px] text-[#2E8B70] mt-0.5 font-medium">
                  After Update
                </div>
              </div>
            </div>

            {/* Threshold info reminder */}
            {selectedProduct && (
              <div className="p-3 bg-[#eef8f8] rounded-lg border border-[#159A9C]/20 flex items-center justify-between text-[11px] text-[#123B5D]">
                <span>
                  Threshold for {selectedProduct.name}: <strong>{selectedProduct.threshold} units</strong>
                </span>
                <span>
                  Unit: <strong>{selectedProduct.unit || 'Standard'}</strong>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Update Stock</span>
            </button>
          </form>
        </div>

        {/* Right: Restock History & Quick Tips */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-[#123B5D] text-xs">Recent Stock Updates (Audit Log)</h3>
            </div>

            {stockHistory.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs space-y-1">
                <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No manual adjustments performed yet in this session.</p>
                <p className="text-[11px] text-slate-400">
                  Updates made above will log here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {stockHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-[#F7FAFC] rounded-lg border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">{item.branchName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#2E8B70] font-bold font-mono">
                        +{item.added} units
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.oldStock} → {item.newStock} · {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Independent Stock Rule Card */}
          <div className="bg-[#eef8f8]/60 border border-[#159A9C]/25 rounded-xl p-4 text-xs text-[#123B5D] space-y-2 shadow-2xs">
            <div className="font-bold flex items-center gap-1.5 text-[#123B5D]">
              <Building2 className="w-4 h-4 text-[#159A9C]" />
              <span>Independent Branch Inventory Rule</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Every branch maintains its own localized stock. When billing staff at Branch 1
              issues Paracetamol, only Branch 1 inventory is deducted. Central Admin can view and
              replenish each branch independently at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
