import React from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

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
  userName?: string;
  userEmail?: string;
}

export default function Matrix({ roles, permissions_list, relations, userName, userEmail }: MatrixProps) {
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
              {permissions_list.map(perm => (
                <tr key={perm.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800 sticky left-0 bg-white dark:bg-[#0a0a0c] z-10">
                    {perm.name}
                  </td>
                  {roles.map(role => (
                    <td key={role.id} className="px-6 py-4 text-center">
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
