import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const newsData = [
  { tag: 'Kunjungan Wisata', title: 'Pementasan Seni Menyambut Tim Penilai Desa Wisata Nasional di Sisawah', summary: 'Sanggar Seni Antabung Indah menyajikan randai kolosal menyambut tim penilai Desa Wisata Kemenparekraf di Lembah Sisawah.', rtime: '5 Menit Baca' },
  { tag: 'Tradisi Nagari', title: 'Kemeriahan Prosesi Bakaua Adat Nagari Sisawah Tahun Ini', summary: 'Liputan khusus pelaksanaan Bakaua Adat Sisawah sebagai perwujudan syukur atas panen padi melimpah yang diiringi pawai seni.', rtime: '8 Menit Baca' },
  { tag: 'Warta Sanggar', title: 'Penerimaan Anak Sasian Baru Gelanggang Latihan', summary: 'Sebanyak 35 pemuda-pemudi Nagari Sisawah resmi bergabung untuk berlatih randai, silek, dan talempong ungah.', rtime: '3 Menit Baca' },
  { tag: 'Pelestarian Budaya', title: 'Mengenal Talempong Ungah, Musik Khas Kebanggaan Sijunjung', summary: 'Artikel mendalam mengupas teknik bermain talempong ungah yang dinamis dan enerjik serta upaya sanggar melestarikannya.', rtime: '4 Menit Baca' }
];

export default function Berita() {
  const { showToast } = useOtherTheme();

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Media Informasi</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Kabar & Warta Budaya</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Ikuti berita terhangat seputar pementasan adat, atraksi wisata, serta tulisan kebudayaan Minangkabau di Sijunjung.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {newsData.map((n, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:border-[#e11d48]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase rounded-lg mb-4">{n.tag}</span>
              <h3 onClick={() => showToast('Artikel lengkap akan segera tersedia!')} className="font-serif text-xl font-bold mb-3 text-slate-800 dark:text-white hover:text-[#fbbf24] transition-colors duration-300 leading-snug cursor-pointer">{n.title}</h3>
              <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">{n.summary}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs sm:text-sm text-slate-400 dark:text-white/40">
              <span><i className="fas fa-clock mr-1"></i> {n.rtime}</span>
              <a href="#" onClick={(e) => { e.preventDefault(); showToast('Artikel lengkap akan segera tersedia!'); }} className="text-[#e11d48] hover:text-[#be123c] font-bold">Baca &rarr;</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Berita.layout = getOtherLayout;
