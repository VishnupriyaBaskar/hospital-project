import React, { useState } from 'react';
import {
  Users,
  Plus,
  Building2,
  Mail,
  Phone,
  Shield,
  Edit2,
  CheckCircle2,
  X,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Staff } from '../../types';

export const StaffManagement: React.FC = () => {
  const { staff, branches, addStaff, updateStaff, loginStaffMember } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [role, setRole] = useState<'Billing Staff' | 'Admin'>('Billing Staff');

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setUsername('');
    setEmail('');
    setPhone('+91 ');
    setBranchId(branches[0]?.id || '');
    setRole('Billing Staff');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Staff) => {
    setEditingStaff(s);
    setName(s.name);
    setUsername(s.username);
    setEmail(s.email);
    setPhone(s.phone);
    setBranchId(s.branchId);
    setRole(s.role);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) return;

    const branch = branches.find((b) => b.id === branchId);
    const branchName = branch ? branch.name : 'Central';

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name,
        username,
        email,
        phone,
        branchId,
        branchName,
        role,
      });
    } else {
      addStaff({
        name,
        username,
        email: email || `${username.toLowerCase()}@medicare.com`,
        phone,
        branchId,
        branchName,
        role,
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
            <Users className="w-5 h-5 text-[#159A9C]" />
            <span>Staff Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Control billing staff terminals, branch assignments, and credential access permissions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-[#159A9C] hover:bg-[#0f7a7c] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Billing Staff</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Assigned Branch</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#eef8f8] text-[#159A9C] flex items-center justify-center font-bold text-xs shrink-0 border border-[#159A9C]/20">
                        {s.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">@{s.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.role === 'Admin'
                          ? 'bg-[#123B5D] text-white'
                          : 'bg-[#eef8f8] text-[#159A9C] border border-[#159A9C]/20'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>{s.role}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#159A9C] shrink-0" />
                      <span>{s.branchName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-600">{s.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{s.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#edf7f4] text-[#2E8B70] border border-[#2E8B70]/20">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {s.role === 'Billing Staff' && (
                        <button
                          onClick={() => loginStaffMember(s.id)}
                          className="px-2 py-1 bg-[#edf7f4] hover:bg-[#dbf0ea] text-[#2E8B70] rounded text-[11px] font-semibold flex items-center gap-1 transition-colors border border-[#2E8B70]/20"
                          title="Simulate login as this staff"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Login As</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-slate-500 hover:text-[#159A9C] hover:bg-[#eef8f8] rounded-md transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c2942]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#123B5D] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingStaff ? 'Edit Staff Account' : 'Add Billing Counter Staff'}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh V"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username / Terminal ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ramesh"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                  >
                    <option value="Billing Staff">Billing Staff</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Branch *
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ramesh@medicare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98400 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#159A9C] focus:border-[#159A9C] focus:outline-none"
                />
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
                  {editingStaff ? 'Save Changes' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
