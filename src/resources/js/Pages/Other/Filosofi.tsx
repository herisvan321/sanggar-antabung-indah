import { getOtherLayout } from '../../Layouts/OtherLayouts';

const filosofiData = [
  { title: 'Galuang (Lingkaran)', desc: 'Gerak melingkar melambangkan kebulatan tekad mufakat di Minangkabau.', icon: 'fa-dot-circle', tag: 'Gerak Utama' },
  { title: 'Silek (Seni Bela Diri)', desc: 'Teknik bertahan yang lembut namun mematikan, landasan kekuatan fisik penari.', icon: 'fa-fist-raised', tag: 'Kekuatan fisik' },
  { title: 'Bakaba (Seni Bercerita)', desc: 'Penyampaian hikayat rakyat (Kaba) sebagai jembatan sejarah moral keluarga.', icon: 'fa-book-open', tag: 'Sastra Lisan' },
  { title: 'Dendang (Vokal Tradisi)', desc: 'Nyanyian syahdu menceritakan perjalanan hidup manusia dan alam.', icon: 'fa-microphone-alt', tag: 'Suara Jiwa' },
  { title: 'Saluang (Seruling Tiup)', desc: 'Suara saluang mengalun membawa pesan kerinduan mendalam akan tanah leluhur.', icon: 'fa-wind', tag: 'Instrumentasi' },
  { title: 'Tepukan Celana (Galembong)', desc: 'Hentakan celana khusus menciptakan ritme perkusi alami yang bertenaga.', icon: 'fa-drum', tag: 'Komunikasi Ritme' },
  { title: 'Langkah Duo (Pola Kaki)', desc: 'Pola langkah kaki sejajar merefleksikan kehati-hatian dalam mengambil keputusan.', icon: 'fa-shoe-prints', tag: 'Pedoman Langkah' },
  { title: 'Sambah Kurator (Hormat)', desc: 'Sikap menangkupkan tangan sebagai wujud penghormatan tinggi kepada hadirin.', icon: 'fa-hands', tag: 'Etika Sosial' },
  { title: 'Pituluik (Keseimbangan)', desc: 'Keseimbangan dalam meniti batas kehidupan antara kebenaran dan kebatilan.', icon: 'fa-balance-scale', tag: 'Sikap Budi' },
  { title: 'Gurindam Alam (Petatah)', desc: 'Belajar langsung dari alam semesta. Alam takambang jadi guru.', icon: 'fa-leaf', tag: 'Belajar Hidup' }
];

export default function Filosofi() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Pusat Edukasi</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Filosofi Gerak & Makna</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Mempelajari Randai bukan hanya tentang seni gerak, melainkan memahami keselarasan budi, kata, langkah, dan kepedulian sosial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filosofiData.map((f, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:border-[#fbbf24]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 text-xs font-bold uppercase rounded-lg mb-4">{f.tag}</span>
              <div className="flex items-center gap-3 mb-3">
                <i className={`fas ${f.icon} text-[#d97706] dark:text-[#fbbf24] text-lg`}></i>
                <h4 className="font-serif text-lg font-bold text-slate-800 dark:text-white">{f.title}</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-white/60 font-light leading-relaxed">{f.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-white/30 italic">Pilar Keadilan Tradisi</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Filosofi.layout = getOtherLayout;
