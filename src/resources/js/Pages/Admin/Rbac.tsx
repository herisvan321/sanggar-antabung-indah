import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Swal from 'sweetalert2';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';

DataTable.use(DT);

interface Role {
  id: number;
  name: string;
  guard_name: string;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface RbacProps {
  roles: Role[];
  permissions_list: Permission[];
}

export default function Rbac({ roles, permissions_list }: RbacProps) {
  const { isDark } = useOtherTheme();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ name: '', guard_name: 'web' });

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      router.post(`/dashboard/rbac/role/${editingRole.id}`, formData);
    } else {
      router.post('/dashboard/rbac/role', formData);
    }
    setShowRoleModal(false);
    setEditingRole(null);
    setFormData({ name: '', guard_name: 'web' });
  };

  const handlePermissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPermission) {
      router.post(`/dashboard/rbac/permission/${editingPermission.id}`, formData);
    } else {
      router.post('/dashboard/rbac/permission', formData);
    }
    setShowPermissionModal(false);
    setEditingPermission(null);
    setFormData({ name: '', guard_name: 'web' });
  };

  const deleteRole = (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Role ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      color: isDark ? '#fff' : '#1e293b',
      backdrop: `rgba(0,0,0,0.4)`,
      customClass: {
        popup: 'premium-swal-popup',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(`/dashboard/rbac/role/${id}/delete`);
      }
    });
  };

  const deletePermission = (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Permission ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fbbf24',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      color: isDark ? '#fff' : '#1e293b',
      backdrop: `rgba(0,0,0,0.4)`,
      customClass: {
        popup: 'premium-swal-popup',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(`/dashboard/rbac/permission/${id}/delete`);
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roles Section */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Daftar Role</h3>
            <button
              onClick={() => { setShowRoleModal(true); setEditingRole(null); setFormData({ name: '', guard_name: 'web' }); }}
              className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Tambah Role
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <DataTable className="w-full text-left display">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guard</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{role.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{role.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{role.guard_name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditingRole(role); setFormData({ name: role.name, guard_name: role.guard_name }); setShowRoleModal(true); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Daftar Permission</h3>
            <button
              onClick={() => { setShowPermissionModal(true); setEditingPermission(null); setFormData({ name: '', guard_name: 'web' }); }}
              className="px-4 py-2 bg-[#fbbf24] hover:bg-[#d97706] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Tambah Permission
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <DataTable className="w-full text-left display">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Permission</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guard</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {permissions_list.map((perm) => (
                  <tr key={perm.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{perm.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{perm.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{perm.guard_name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditingPermission(perm); setFormData({ name: perm.name, guard_name: perm.guard_name }); setShowPermissionModal(true); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => deletePermission(perm.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </div>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white">
                {editingRole ? 'Edit Role' : 'Tambah Role Baru'}
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleRoleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Role</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                  placeholder="Contoh: Admin, Instructor"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Guard Name</label>
                <input
                  type="text"
                  value={formData.guard_name}
                  onChange={(e) => setFormData({ ...formData, guard_name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                  placeholder="Default: web"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#e11d48] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-[#e11d48]/20"
                >
                  {editingRole ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white">
                {editingPermission ? 'Edit Permission' : 'Tambah Permission Baru'}
              </h3>
              <button onClick={() => setShowPermissionModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handlePermissionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Permission</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all dark:text-white"
                  placeholder="Contoh: view_dashboard, manage_users"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Guard Name</label>
                <input
                  type="text"
                  value={formData.guard_name}
                  onChange={(e) => setFormData({ ...formData, guard_name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all dark:text-white"
                  placeholder="Default: web"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPermissionModal(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  {editingPermission ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
