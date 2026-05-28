import { getOtherLayout } from '../../Layouts/OtherLayouts';

const filosofiData = [
  { title: 'Galuang (Lingkaran)', desc: 'Gerak melingkar melambangkan kebulatan tekad mufakat di Minangkabau. Gelanggang randai yang bulat melambangkan kesetaraan derajat seluruh anak nagari.', icon: 'fa-dot-circle', tag: 'Gerak Gelanggang' },
  { title: 'Silek Sisawah (Bela Diri)', desc: 'Pondasi fisik utama randai. Gerakan silat tradisional khas Sumpur Kudus yang defensif, mengajarkan kerendahan hati dan kepatuhan hukum adat.', icon: 'fa-fist-raised', tag: 'Silek Tradisional' },
  { title: 'Bakaba Kuno (Sastra Lisan)', desc: 'Penyampaian cerita moral (kaba) oleh Tukang Kaba. Menjaga tuturan sejarah pahlawan dan silsilah suku di Sijunjung agar tidak punah.', icon: 'fa-book-open', tag: 'Teater Tutur' },
  { title: 'Talempong Ungah (Irama)', desc: 'Tabuhan instrumen khas daerah Sijunjung yang rancak. Denting logamnya melambangkan semangat kerja sama bergotong-royong.', icon: 'fa-music', tag: 'Ritme Nagari' },
  { title: 'Galembong (Perkusi Alami)', desc: 'Tepukan celana longgar galembong yang menghasilkan suara perkusi tegas. Mengiringi setiap hentakan kaki saat transisi babak pertunjukan.', icon: 'fa-drum', tag: 'Ritme Tubuh' },
  { title: 'Langkah Tigo (Pola Kaki)', desc: 'Pola langkah taktis dalam bersilat. Filosofi kehati-hatian melangkah dalam kehidupan bermasyarakat agar tidak menyinggung hak orang lain.', icon: 'fa-shoe-prints', tag: 'Langkah Adat' },
  { title: 'Sambah Pusako (Hormat)', desc: 'Penghormatan tertinggi kepada niniak mamak, bundo kanduang, dan penonton gelanggang sebelum pertunjukan dimulai.', icon: 'fa-hands', tag: 'Adab Gelanggang' },
  { title: 'Alam Takambang Jadi Guru', desc: 'Filosofi dasar berguru pada alam. Mengambil pelajaran dari bebatuan karst Ngalau Antabuang dan ketenangan aliran sungai Batang Sinamar.', icon: 'fa-leaf', tag: 'Pilar Utama' }
];

export default function Filosofi() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Filosofi Seni</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Makna Langkah <br />& Kaba Nagari.</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Di Sanggar Antabung Indah, seni Randai bukan sekadar gerakan fisik, melainkan jembatan penyampaian pesan luhur adat salingka nagari Sisawah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-white/30 italic">Falsafah Minang</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Filosofi.layout = getOtherLayout;
