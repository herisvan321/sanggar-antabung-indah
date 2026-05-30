import React from 'react';
import { router } from '@inertiajs/react';

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

interface Relation {
  id: number;
  role_id: number;
  permission_id: number;
}

interface MatrixProps {
  roles: Role[];
  permissions_list: Permission[];
  relations: Relation[];
}

export default function Matrix({ roles, permissions_list, relations }: MatrixProps) {
  const hasPermission = (roleId: number, permissionId: number) => {
    return relations.some(rel => rel.role_id === roleId && rel.permission_id === permissionId);
  };

  const togglePermission = (roleId: number, permissionId: number) => {
    router.post('/dashboard/matrix/toggle', {
      role_id: roleId,
      permission_id: permissionId
    }, {
      preserveScroll: true
    });
  };

  // Grouping definitions by prefix
  const groups = [
    {
      id: 'halaman',
      title: 'Akses Halaman (halaman_*)',
      icon: 'fa-file-invoice',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      borderColor: 'border-l-indigo-500',
      filter: (perm: Permission) => perm.name.startsWith('halaman_')
    },
    {
      id: 'create',
      title: 'Tambah Data (create_*)',
      icon: 'fa-plus',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      borderColor: 'border-l-emerald-500',
      filter: (perm: Permission) => perm.name.startsWith('create_')
    },
    {
      id: 'update',
      title: 'Ubah Data (update_*)',
      icon: 'fa-pen',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      borderColor: 'border-l-amber-500',
      filter: (perm: Permission) => perm.name.startsWith('update_')
    },
    {
      id: 'delete',
      title: 'Hapus Data (delete_*)',
      icon: 'fa-trash',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      borderColor: 'border-l-rose-500',
      filter: (perm: Permission) => perm.name.startsWith('delete_')
    },
    {
      id: 'manage',
      title: 'Manajemen Sistem (manage_* / view_*)',
      icon: 'fa-shield-halved',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      borderColor: 'border-l-sky-500',
      filter: (perm: Permission) => perm.name.startsWith('manage_') || perm.name.startsWith('view_')
    },
    {
      id: 'other',
      title: 'Lainnya',
      icon: 'fa-circle-question',
      color: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
      borderColor: 'border-l-slate-400',
      filter: (perm: Permission) => !perm.name.startsWith('halaman_') && 
                                    !perm.name.startsWith('create_') && 
                                    !perm.name.startsWith('update_') && 
                                    !perm.name.startsWith('delete_') && 
                                    !perm.name.startsWith('manage_') && 
                                    !perm.name.startsWith('view_')
    }
  ];

  return (
    <>
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Matriks Role & Permission</h3>
          <p className="text-xs text-slate-500 mt-1">Klik pada checkbox untuk mengaktifkan atau menonaktifkan permission untuk role tertentu.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-[#0f172a] z-10">
                  Permissions
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center min-w-[120px]">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {groups.map(group => {
                const groupPerms = permissions_list.filter(group.filter);
                if (groupPerms.length === 0) return null;

                return (
                  <React.Fragment key={group.id}>
                    {/* Category Header Row */}
                    <tr className="bg-slate-50/60 dark:bg-white/[0.01]">
                      <td 
                        colSpan={roles.length + 1} 
                        className={`px-6 py-2.5 text-[10px] font-bold border-l-4 ${group.borderColor} uppercase tracking-wider sticky left-0 bg-slate-50/90 dark:bg-[#0f172a]/95 backdrop-blur-sm z-10 border-b border-slate-100 dark:border-slate-800`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md border ${group.color}`}>
                            <i className={`fas ${group.icon} text-[9px]`}></i>
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{group.title}</span>
                          <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 lowercase bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full border border-slate-200/50 dark:border-white/5">
                            {groupPerms.length} item
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Permissions inside Category */}
                    {groupPerms.map(perm => (
                      <tr key={perm.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-3.5 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-[#0a0a0c] z-10">
                          <span className="font-mono text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 shadow-sm">
                            {perm.name}
                          </span>
                        </td>
                        {roles.map(role => (
                          <td key={role.id} className="px-6 py-3.5 text-center">
                            <button
                              onClick={() => togglePermission(role.id, perm.id)}
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mx-auto transition-all ${
                                hasPermission(role.id, perm.id)
                                  ? 'bg-[#e11d48] border-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
                                  : 'bg-transparent border-slate-200 dark:border-slate-700 text-transparent hover:border-[#e11d48]/50'
                              }`}
                            >
                              <i className="fas fa-check text-[10px]"></i>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
          <i className="fas fa-lightbulb"></i>
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Tips Keamanan</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Gunakan prinsip <strong>Least Privilege</strong>: berikan hak akses seminimal mungkin yang dibutuhkan oleh setiap role untuk menjalankan tugasnya. Selalu periksa kembali matriks ini setelah menambahkan fitur baru yang memerlukan permission khusus.
          </p>
        </div>
      </div>
    </>
  );
}
