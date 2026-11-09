import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Lock, 
  Clock, 
  Ban,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminRole, AdminUser } from '../../types';
import { getAllAdminUsers, updateAdminUserStatus, deleteAdminUser } from '../../services/firestoreService';

export const StaffView: React.FC = () => {
  const { createStaffAccount, isSuperAdmin, currentUser } = useAuth();

  const [staffList, setStaffList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New staff form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<AdminRole>('Office Manager');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const records = await getAllAdminUsers();
      // Ensure super admin is included in list if not already
      if (!records.some(r => r.email === 'hasanaamir815@gmail.com')) {
        records.unshift({
          id: 'super-admin-root',
          uid: 'super-admin-root',
          email: 'hasanaamir815@gmail.com',
          displayName: 'Chaudhry Asad Hanif Jutt (Super Admin)',
          role: 'Super Admin',
          status: 'Active',
          createdAt: new Date().toISOString(),
          createdBy: 'System Root'
        });
      }
      setStaffList(records);
    } catch (err) {
      console.warn('Error loading staff accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setFormLoading(true);
    setFormError(null);
    try {
      await createStaffAccount(email, password, displayName, role);
      setSuccessMsg(`Staff account for ${email} (${role}) provisioned successfully.`);
      setShowAddModal(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
      await loadStaff();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create staff account.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (staff: AdminUser) => {
    if (staff.email === 'hasanaamir815@gmail.com') {
      alert('The root Super Admin account cannot be suspended.');
      return;
    }
    const newStatus = staff.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateAdminUserStatus(staff.uid, newStatus);
      await loadStaff();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (staff: AdminUser) => {
    if (staff.email === 'hasanaamir815@gmail.com') {
      alert('The root Super Admin account cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to revoke and delete ${staff.displayName}'s (${staff.email}) account?`)) {
      return;
    }
    try {
      await deleteAdminUser(staff.uid, staff.email);
      await loadStaff();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const getRoleBadge = (roleName: AdminRole) => {
    switch (roleName) {
      case 'Super Admin':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Office Manager':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Project Manager':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Media Manager':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Data Entry Operator':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#087A43]" />
            <span>Authorized Staff & RBAC Accounts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin Access: Manage secretariat team access, assign departmental roles, and control credentials.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold shadow-md transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <UserPlus className="w-4 h-4 text-[#C9A227]" />
            <span>Provision New Staff Account</span>
          </button>
        )}
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Definitions Card */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-[11px] font-bold text-amber-900 block">Super Admin</span>
          <p className="text-[10px] text-amber-700 mt-0.5">Full control, settings, audit logs & staff provisioning.</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-900 block">Office Manager</span>
          <p className="text-[10px] text-emerald-700 mt-0.5">Complaints, appointments, WhatsApp & SMS dispatches.</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-[11px] font-bold text-blue-900 block">Project Manager</span>
          <p className="text-[10px] text-blue-700 mt-0.5">PP-203 Development projects, GIS map & progress.</p>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <span className="text-[11px] font-bold text-purple-900 block">Media Manager</span>
          <p className="text-[10px] text-purple-700 mt-0.5">Press statements, photo gallery & public notices.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-800 block">Data Entry Operator</span>
          <p className="text-[10px] text-slate-600 mt-0.5">Complaint logging, citizen lookup & view projects.</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading authorized staff accounts...</td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No staff accounts found.</td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff.uid || staff.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{staff.displayName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{staff.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadge(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        staff.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{staff.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString('en-GB') : 'System Initial'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {staff.email !== 'hasanaamir815@gmail.com' && isSuperAdmin && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(staff)}
                            title={staff.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                            className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                              staff.status === 'Active'
                                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {staff.status === 'Active' ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(staff)}
                            title="Delete Account"
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {staff.email === 'hasanaamir815@gmail.com' && (
                        <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          Root Super Admin
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#087A43]" />
                <span>Provision Secretariat Staff Account</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg">×</button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Member Full Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Muhammad Usman (Secretariat Coordinator)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#087A43] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. usman@chasadhanif.pk"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#087A43] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#087A43] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned RBAC Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#087A43] focus:border-transparent bg-white"
                >
                  <option value="Office Manager">Office Manager (Complaints, Inquiries, Notices)</option>
                  <option value="Project Manager">Project Manager (Infrastructure & GIS Map)</option>
                  <option value="Media Manager">Media Manager (News, Gallery, Press)</option>
                  <option value="Data Entry Operator">Data Entry Operator (Complaint Processing)</option>
                  <option value="Super Admin">Super Admin (Full Administrative Powers)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-[#087A43] hover:bg-[#066135] text-white rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4 text-[#C9A227]" />
                  <span>{formLoading ? 'Provisioning...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
