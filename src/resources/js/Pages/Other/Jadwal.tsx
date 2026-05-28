import { Link } from '@inertiajs/react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function Jadwal() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Agenda Seni</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Kalender Kegiatan & Event</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Amankan kursi pementasan Anda. Kami menyelenggarakan pementasan teatrikal Randai rutin berkala dan festival kolaborasi terbuka.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((m, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:border-[#10b981]/40 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-serif text-[#d97706] dark:text-[#fbbf24]">{m} 2026</span>
              <span className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-xs font-bold rounded-full">Aktif</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1 border border-slate-100 dark:border-none">
                <span className="block text-sm font-bold text-slate-800 dark:text-white/90">Pentas Bulanan Gelanggang</span>
                <span className="block text-xs text-slate-500 dark:text-white/40"><i className="fas fa-clock mr-1"></i> 20:00 WIB</span>
                <span className="block text-xs text-slate-500 dark:text-white/40"><i className="fas fa-map-marker-alt mr-1"></i> Gelanggang Bukittinggi</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1 border border-slate-100 dark:border-none">
                <span className="block text-sm font-bold text-slate-800 dark:text-white/90">Workshop Budaya Terbuka</span>
                <span className="block text-xs text-slate-500 dark:text-white/40"><i className="fas fa-clock mr-1"></i> 09:00 WIB</span>
                <span className="block text-xs text-slate-500 dark:text-white/40"><i className="fas fa-map-marker-alt mr-1"></i> Aula Kota Padang</span>
              </div>
            </div>

            <Link href="/booking" className="block text-center w-full py-2 bg-slate-100 dark:bg-white/5 hover:bg-[#10b981] dark:hover:bg-[#10b981] text-slate-700 dark:text-white/70 hover:text-white text-xs font-bold rounded-lg transition-all duration-300 uppercase tracking-wider">
              Daftar Reservasi Kursi
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

Jadwal.layout = getOtherLayout;
