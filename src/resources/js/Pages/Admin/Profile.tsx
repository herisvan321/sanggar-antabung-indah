import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Swal from 'sweetalert2';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ProfileProps {
  user: User;
  userName?: string;
  userEmail?: string;
}

export default function Profile({ user, userName, userEmail }: ProfileProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/profile', formData, {
      onSuccess: () => {
        setFormData(prev => ({ ...prev, password: '' }));
      }
    });
  };

  return (
    <>
      <div className="p-4">
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#e11d48]/20">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Pengaturan Profil</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Update informasi akun Anda</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Alamat Email</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Ganti Password <span className="text-slate-400 lowercase font-normal">(kosongkan jika tidak ingin diubah)</span>
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-[#e11d48]/20 flex items-center justify-center gap-2"
            >
              <i className="fas fa-save"></i> Simpan Perubahan
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
            <i className="fas fa-shield-halved"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-1">Keamanan Akun</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pastikan Anda menggunakan password yang kuat dan unik. Kami merekomendasikan kombinasi huruf besar, kecil, angka, dan simbol untuk keamanan maksimal.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
