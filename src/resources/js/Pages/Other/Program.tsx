import { Link } from '@inertiajs/react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const programs = [
  { title: 'Kuda-Kuda & Keseimbangan', level: 'Dasar', dur: '1 Bulan / 8 Sesi', col: 'border-rose-500/30 dark:border-rose-500/30' },
  { title: 'Gerak Kembangan Silek', level: 'Dasar', dur: '2 Bulan / 16 Sesi', col: 'border-yellow-500/30 dark:border-yellow-500/30' },
  { title: 'Tepukan Ritme Galembong', level: 'Dasar', dur: '1 Bulan / 8 Sesi', col: 'border-green-500/30 dark:border-green-500/30' },
  { title: 'Olah Vokal Dendang', level: 'Menengah', dur: '3 Bulan / 24 Sesi', col: 'border-purple-500/30 dark:border-purple-500/30' },
  { title: 'Penjiwaan Karakter Kaba', level: 'Menengah', dur: '3 Bulan / 24 Sesi', col: 'border-blue-500/30 dark:border-blue-500/30' },
  { title: 'Langkah Segitiga (Maju/Mundur)', level: 'Menengah', dur: '2 Bulan / 16 Sesi', col: 'border-pink-500/30 dark:border-pink-500/30' },
  { title: 'Aransemen Gamelan Etnis', level: 'Lanjutan', dur: '4 Bulan / 32 Sesi', col: 'border-teal-500/30 dark:border-teal-500/30' },
  { title: 'Sutradara Teater Kontemporer', level: 'Lanjutan', dur: '4 Bulan / 32 Sesi', col: 'border-indigo-500/30 dark:border-indigo-500/30' },
  { title: 'Manajemen Pementasan Digital', level: 'Lanjutan', dur: '2 Bulan / 16 Sesi', col: 'border-orange-500/30 dark:border-orange-500/30' },
  { title: 'Koreografi Eksperimental', level: 'Profesional', dur: '6 Bulan / 48 Sesi', col: 'border-red-500/30 dark:border-red-500/30' }
];

export default function Program() {
  const { showToast } = useOtherTheme();

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Pusat Pembinaan</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Program Latihan Terstruktur</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Mulai dari teknik dasar pertahanan Silek Minangkabau hingga pemahaman literatur sastra lisan purba.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p, i) => (
          <div key={i} className={`p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border shadow-sm dark:shadow-none ${p.col} flex flex-col justify-between`}>
            <div>
              <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 text-xs font-bold rounded-full mb-3">{p.level}</span>
              <h4 className="font-serif text-xl font-bold mb-2 leading-tight text-slate-800 dark:text-white">{p.title}</h4>
              <span className="block text-sm text-slate-500 dark:text-white/40"><i className="fas fa-calendar-alt mr-2"></i> {p.dur}</span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2">
              <Link href="/join" className="px-3.5 py-2.5 bg-[#fbbf24] hover:bg-[#d97706] text-black text-xs font-bold rounded-lg transition-colors duration-300 uppercase tracking-wider">Ikut Kelas</Link>
              <button onClick={() => showToast('Silabus terunduh di perangkat Anda!')} className="px-3.5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70 text-xs font-bold rounded-lg transition-colors duration-300"><i className="fas fa-download"></i> Silabus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Program.layout = getOtherLayout;
