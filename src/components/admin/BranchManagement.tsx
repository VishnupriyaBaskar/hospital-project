import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Users,
  Package,
  Edit,
  CheckCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Branch } from '../../types';

export const BranchManagement: React.FC = () => {
  const { branches, addBranch, updateBranch, setCurrentAdminTab } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setCode(`B${branches.length + 1}-${city ? city.toUpperCase().slice(0, 4) : 'EXT'}`);
    setCity('');
    setLocation('');
    setAddress('');
    setPhone('+91 ');
    setEditingBranch(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setEditingBranch(b);
    setName(b.name);
    setCode(b.code);
    setCity(b.city);
    setLocation(b.location);
    setAddress(b.address);
    setPhone(b.phone);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city) return;

    if (editingBranch) {
      updateBranch(editingBranch.id, {
        name,
        code,
        city,
        location,
        address,
        phone,
      });
    } else {
      addBranch({
        name,
        code: code || `B${branches.length + 1}`,
        city,
        location: location || city,
        address,
        phone,
        status: 'Active',
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#159A9C]" />
            <span>Branches Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure hospital branches, clinics, pharmacy counters & regional stock centers
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Branch</span>
        </button>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2 bg-[#F7FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-[#eaf2f8] text-[#123B5D] flex items-center justify-center font-bold text-sm border border-[#123B5D]/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123B5D] text-sm">{b.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{b.city}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-400">{b.code}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#edf7f4] text-[#2E8B70] border border-[#2E8B70]/30">
                  {b.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-xs">
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-[#F7FAFC] p-2 rounded-lg border border-slate-200/80 text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Assigned Staff</div>
                    <div className="text-sm font-bold text-[#123B5D] font-mono mt-0.5">
                      {b.staffCount} Staff
                    </div>
                  </div>
                  <div className="bg-[#F7FAFC] p-2 rounded-lg border border-slate-200/80 text-center">
                    <div className="text-[10px] text-slate-500 font-medium">Stock Catalog</div>
                    <div className="text-sm font-bold text-[#123B5D] font-mono mt-0.5">
                      {b.productCount} Products
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-2.5 bg-[#F7FAFC] border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentAdminTab('branch-stock')}
                className="text-xs font-semibold text-[#159A9C] hover:text-[#0f7a7c] flex items-center gap-1 transition-colors"
              >
                <span>Branch Stock</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleOpenEdit(b)}
                className="p-1.5 text-slate-500 hover:text-[#123B5D] hover:bg-[#eaf2f8] rounded-md transition-colors"
                title="Edit Branch"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c2942]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#123B5D] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingBranch ? 'Edit Hospital Branch' : 'Add New Hospital Branch'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Branch 4 - Specialty Clinic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B4-CLINIC"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madurai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Location Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anna Nagar East"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Postal Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Address details..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  {editingBranch ? 'Save Changes' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
