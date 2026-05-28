import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const newsData = [
  { tag: 'Festival Internasional', title: 'Membawa Marwah Randai Ke Panggung Teater Paris', summary: 'Tim Sanggar terpilih mewakili diplomasi kebudayaan Indonesia di Prancis, menyajikan Kaba Cindua Mato.', rtime: '5 Menit Baca' },
  { tag: 'Akademis Budaya', title: 'Pentingnya Digitalisasi Gerak Silek Untuk Masa Depan', summary: 'Ulasan kritis dari tim kurasi mengenai pemanfaatan motion capture dalam mendokumentasikan sudut beladiri tradisional.', rtime: '8 Menit Baca' },
  { tag: 'Warta Sanggar', title: 'Penyambutan Anggota Baru Angkatan Ke-42', summary: 'Selamat datang bagi 120 talenta muda pilihan yang lolos tahap evaluasi fisik dan bakat tahunan.', rtime: '3 Menit Baca' },
  { tag: 'Kolaborasi Musik', title: 'Rilisan Album Musik Etnis Orkestra Di Platform Digital', summary: 'Kini Anda dapat mendengarkan alunan aransemen saluang dan perkusi talempong di berbagai pemutar digital.', rtime: '4 Menit Baca' },
  { tag: 'Fokus Cerita', title: 'Menggali Kebijaksanaan Moral Kaba Malin Kundang', summary: 'Bukan sekadar dongeng anak durhaka, mari mengupas filosofi tatanan keluarga adat Minangkabau.', rtime: '12 Menit Baca' },
  { tag: 'Apresiasi Tokoh', title: 'Pemberian Penghargaan Maestro Budaya Untuk Tokoh Sanggar', summary: 'Apresiasi tinggi dari Dinas Pariwisata Sumatra Barat atas dedikasi tiada henti melestarikan seni pertunjukan.', rtime: '6 Menit Baca' },
  { tag: 'Agenda Sosial', title: 'Randai Keliling Mengunjungi Kampung Adat Terpencil', summary: 'Laporan perjalanan misi budaya menyebarkan kebahagiaan teater tradisional di wilayah perbatasan.', rtime: '9 Menit Baca' },
  { tag: 'Review Pementasan', title: 'Sukses Besar Pagelaran Teater Kolosal Sabai Nan Aluih', summary: 'Ulasan kritikus teater nasional terhadap pementasan drama yang menonjolkan emansipasi wanita adat Minang.', rtime: '7 Menit Baca' },
  { tag: 'Inovasi Teknologi', title: 'Uji Coba Penggunaan Virtual Reality Pada Pertunjukan Randai', summary: 'Bagaimana penonton dapat menikmati sensasi berdiri tepat di tengah lingkaran (Galuang) pementasan.', rtime: '10 Menit Baca' },
  { tag: 'Tips & Panduan', title: 'Cara Praktis Bagi Pemula Mempelajari Tepukan Celana Randai', summary: 'Panduan visual mandiri bagi Anda yang baru pertama kali tertarik mencoba latihan ritme perkusi celana.', rtime: '4 Menit Baca' }
];

export default function Berita() {
  const { showToast } = useOtherTheme();

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Media Informasi</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Warta Budaya & Artikel</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Menampilkan catatan liputan panggung internasional sanggar serta ulasan akademis seputar peradaban Minangkabau.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
