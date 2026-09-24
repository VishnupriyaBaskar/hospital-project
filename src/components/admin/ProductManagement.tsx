import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  IndianRupee,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, setCurrentAdminTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [rate, setRate] = useState<number>(10);
  const [threshold, setThreshold] = useState<number>(10);
  const [unit, setUnit] = useState('strip');
  const [batchNo, setBatchNo] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === 'All' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchSearch && matchCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('General');
    setRate(10);
    setThreshold(10);
    setUnit('strip (10 tabs)');
    setBatchNo(`BATCH-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setRate(p.rate);
    setThreshold(p.threshold);
    setUnit(p.unit || 'strip');
    setBatchNo(p.batchNo || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        category,
        rate: Number(rate),
        threshold: Number(threshold),
        unit,
        batchNo,
      });
    } else {
      addProduct({
        name,
        category,
        rate: Number(rate),
        threshold: Number(threshold),
        unit,
        batchNo: batchNo || `BATCH-${Date.now().toString().slice(-4)}`,
        status: 'Active',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-[#159A9C]" />
            <span>Master Product Catalog</span>
          </h2>
          <p className="text-xs text-slate-500">
            Define medicines, rates, alert thresholds, and dispensing units across all hospital branches
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search product name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs text-slate-600">
          <span>Showing <strong className="font-mono text-[#123B5D]">{filteredProducts.length}</strong> products</span>
          <button
            onClick={() => setCurrentAdminTab('stock-update')}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#eef8f8] text-[#159A9C] font-semibold hover:bg-[#dff3f3] border border-[#159A9C]/20 transition-colors"
          >
            Update Branch Stock
          </button>
        </div>
      </div>

      {/* Products Table matching Screen 7 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Product Name</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-right">Selling Rate</th>
                <th className="py-3.5 px-4 font-semibold text-center">Alert Threshold</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {p.unit || 'unit'} · {p.batchNo || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#123B5D]">
                    ₹{p.rate.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-[#fdf8ee] text-[#D99A24] border border-[#D99A24]/30 text-[11px]">
                      ≤ {p.threshold} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#edf7f4] text-[#2E8B70] border border-[#2E8B70]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B70]"></span>
                      <span>{p.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-500 hover:text-[#159A9C] hover:bg-[#eef8f8] rounded-md transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c2942]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#123B5D] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? 'Edit Medicine / Product' : 'Add New Medicine / Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 500mg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Analgesics, Antibiotics, Supplements"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Selling Rate (₹) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      ₹
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0.5"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Low Stock Alert Threshold *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Alert triggers when branch stock ≤ this value
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dispensing Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. strip (10 tabs), 100ml bottle"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Batch / Lot No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PCM-2026-A1"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  {editingProduct ? 'Save Updates' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
