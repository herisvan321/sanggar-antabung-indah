import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Swal from 'sweetalert2';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';

DataTable.use(DT);

interface User {
  id: number;
  name: string;
  email: string;
}

interface Role {
  id: number;
  name: string;
}

interface UserRole {
  id: number;
  role_id: number;
  model_id: number;
}

interface UsersProps {
  users: User[];
  roles: Role[];
  userRoles: UserRole[];
  userName?: string;
  userEmail?: string;
}

export default function Users({ users, roles, userRoles, userName, userEmail }: UsersProps) {
  const { isDark } = useOtherTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: [] as number[]
  });

  const getUserRoles = (userId: number) => {
    return userRoles
      .filter(ur => ur.model_id === userId)
      .map(ur => roles.find(r => r.id === ur.role_id)?.name)
      .filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      router.post(`/dashboard/users/${editingUser.id}`, formData);
    } else {
      router.post('/dashboard/users', formData);
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', roles: [] });
  };

  const deleteUser = (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data pengguna akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      color: isDark ? '#fff' : '#1e293b',
      backdrop: `rgba(0,0,0,0.4) backdrop-filter: blur(4px)`,
      customClass: {
        popup: 'premium-swal-popup',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(`/dashboard/users/${id}/delete`);
      }
    });
  };

  const toggleRole = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  return (
    <>
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Daftar Pengguna</h3>
            <p className="text-xs text-slate-500 mt-1">Total {users.length} pengguna terdaftar.</p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingUser(null);
              setFormData({ name: '', email: '', password: '', roles: [] });
            }}
            className="px-6 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#e11d48]/20"
          >
            <i className="fas fa-user-plus"></i> Tambah Pengguna
          </button>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <DataTable className="w-full text-left display">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roles</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {getUserRoles(user.id).map((roleName, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                          {roleName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          const currentRoleIds = userRoles
                            .filter(ur => ur.model_id === user.id)
                            .map(ur => ur.role_id);
                          setFormData({ name: user.name, email: user.email, password: '', roles: currentRoleIds });
                          setShowModal(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white">
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="Nama User"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Alamat Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Password {editingUser && '(Kosongkan jika tidak ingin diubah)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pilih Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleRole(role.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        formData.roles.includes(role.id)
                          ? 'bg-[#e11d48] border-[#e11d48] text-white'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-[#e11d48] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-[#e11d48]/20"
                >
                  {editingUser ? 'Perbarui User' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
