import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface Settings {
  id: number;
  app_name: string;
  app_logo_name: string;
  meta_title: string;
  meta_description: string;
  footer_description: string;
  footer_copyright: string;
}

interface SettingsProps {
  settings: Settings | null;
  userName?: string;
  userEmail?: string;
  errors?: Record<string, string>;
}

export default function Settings({ settings, errors }: SettingsProps) {
  const [formData, setFormData] = useState({
    app_name: settings?.app_name || '',
    app_logo_name: settings?.app_logo_name || '',
    meta_title: settings?.meta_title || '',
    meta_description: settings?.meta_description || '',
    footer_description: settings?.footer_description || '',
    footer_copyright: settings?.footer_copyright || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/dashboard/settings', formData);
  };

  return (
    <div className="p-4">
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-6 bg-gradient-to-r from-slate-50 to-white dark:from-black/10 dark:to-transparent">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#e11d48]/20">
            <i className="fas fa-sliders"></i>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Pengaturan Identitas & Tampilan</h3>
            <p className="text-xs text-slate-505 mt-1 uppercase tracking-widest font-bold">Sesuaikan identitas, metadata SEO, dan footer website</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section: Identitas Umum */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-[#e11d48] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-2">Identitas Umum</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Aplikasi</label>
                <div className="relative">
                  <i className="fas fa-heading absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={formData.app_name}
                    onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="Contoh: Sanggar Antabung Indah"
                    required
                  />
                </div>
                {errors?.app_name && <span className="text-xs text-rose-500 mt-1 block">{errors.app_name}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identitas Logo (Navbar)</label>
                <div className="relative">
                  <i className="fas fa-drum absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={formData.app_logo_name}
                    onChange={(e) => setFormData({ ...formData, app_logo_name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#e11d48]/50 transition-all dark:text-white"
                    placeholder="Contoh: ANTABUNG.ART"
                    required
                  />
                </div>
                {errors?.app_logo_name && <span className="text-xs text-rose-500 mt-1 block">{errors.app_logo_name}</span>}
              </div>
            </div>
          </div>

          {/* Section: Metadata & SEO */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-2">Optimasi Metadata (SEO)</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Meta Title</label>
                <div className="relative">
                  <i className="fas fa-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#fbbf24]/50 transition-all dark:text-white"
                    placeholder="Judul halaman untuk search engine"
                    required
                  />
                </div>
                {errors?.meta_title && <span className="text-xs text-rose-500 mt-1 block">{errors.meta_title}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Meta Description</label>
                <div className="relative">
                  <i className="fas fa-align-left absolute left-4 top-6 text-slate-400"></i>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#fbbf24]/50 transition-all dark:text-white"
                    placeholder="Deskripsi singkat website untuk search engine"
                    required
                  />
                </div>
                {errors?.meta_description && <span className="text-xs text-rose-500 mt-1 block">{errors.meta_description}</span>}
              </div>
            </div>
          </div>

          {/* Section: Footer Settings */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-2">Konten & Tampilan Footer</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Footer Description</label>
                <div className="relative">
                  <i className="fas fa-info-circle absolute left-4 top-6 text-slate-400"></i>
                  <textarea
                    value={formData.footer_description}
                    onChange={(e) => setFormData({ ...formData, footer_description: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all dark:text-white"
                    placeholder="Deskripsi instansi/organisasi yang ditampilkan di footer"
                    required
                  />
                </div>
                {errors?.footer_description && <span className="text-xs text-rose-500 mt-1 block">{errors.footer_description}</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Footer Copyright</label>
                <div className="relative">
                  <i className="fas fa-copyright absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    value={formData.footer_copyright}
                    onChange={(e) => setFormData({ ...formData, footer_copyright: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all dark:text-white"
                    placeholder="Contoh: 2026 SANGGAR ANTABUNG INDAH"
                    required
                  />
                </div>
                {errors?.footer_copyright && <span className="text-xs text-rose-500 mt-1 block">{errors.footer_copyright}</span>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="submit"
              className="w-full py-4 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-[#e11d48]/20 flex items-center justify-center gap-2"
            >
              <i className="fas fa-cloud-arrow-up text-sm"></i> Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
