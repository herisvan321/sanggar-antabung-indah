import { getOtherLayout } from '../../Layouts/OtherLayouts';

const roles = [
  { name: 'Dr. Syahril Sutan Alam', role: 'Pembina Sanggar / Maestro Seni', icon: 'fa-user-tie' },
  { name: 'Andi Saputra M.Sn', role: 'Ketua Pengurus & Kurator Seni', icon: 'fa-users-cog' },
  { name: 'Rina Permata Sari', role: 'Sekretaris & Hubungan Luar', icon: 'fa-file-signature' },
  { name: 'Doni Aliansyah', role: 'Bendahara & Manajemen Aset', icon: 'fa-file-invoice-dollar' },
  { name: 'Sutan Mangkuto', role: 'Koreografer Utama (Silek)', icon: 'fa-shoe-prints' },
  { name: 'Novianti M.Pd', role: 'Pelatih Teater & Sastra Lisan', icon: 'fa-feather-alt' },
  { name: 'Ilham Rahmadani', role: 'Komposer Orkestra Talempong', icon: 'fa-music' },
  { name: 'Agung Gunawan', role: 'Logistik & Manajemen Panggung', icon: 'fa-tools' },
  { name: 'Sarah Maulida', role: 'Dokumentasi & Desain Kreatif', icon: 'fa-camera-retro' },
  { name: 'Heru Pratama', role: 'Keamanan Gelanggang Latihan', icon: 'fa-shield-alt' },
  { name: 'Putri Ramadhani', role: 'Humas & Koordinator Tiket', icon: 'fa-bullhorn' },
  { name: 'Zulkifli Malin', role: 'Penasihat Adat & Budayawan', icon: 'fa-user-check' }
];

export default function Profil() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Tentang Kami</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Akar yang Menguat, <br />Visi yang Melangit.</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Didirikan di jantung dataran tinggi Minangkabau, kami mendedikasikan diri untuk melestarikan nilai-nilai filosofis adat melalui ekspresi seni pertunjukan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <span className="text-[#fbbf24] text-base font-bold uppercase tracking-widest block"><i className="fas fa-history mr-2"></i> Sejarah Pendirian</span>
          <h3 className="font-serif text-3xl font-extrabold text-slate-800 dark:text-white">Sejak 1985 Menjaga Warisan Kaba</h3>
          <p className="text-slate-600 dark:text-white/70 text-base leading-relaxed font-light">
            Berawal dari perkumpulan pemuda surau di pinggiran Bukittinggi, Sanggar Randai tumbuh menjadi entitas kesenian profesional yang diakui secara nasional. Menjembatani gerakan fisik beladiri Silek tradisional dengan narasi teater kontemporer yang relevan untuk setiap dekade peradaban.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-sm text-slate-500 dark:text-white/50 leading-relaxed italic">
            "Adat basandi syarak, syarak basandi kitabullah. Seni adalah wadah penyampaian pesan luhur moralitas kehidupan."
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <span className="text-[#10b981] text-base font-bold uppercase tracking-widest block"><i className="fas fa-bullseye mr-2"></i> Visi & Misi Kami</span>
          <h3 className="font-serif text-3xl font-extrabold text-slate-800 dark:text-white">Digitalisasi Seni Tradisi Tanpa Batas</h3>
          <ul className="space-y-4 text-base font-light text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-1"><i className="fas fa-check text-sm"></i></span>
              <span>Membangkitkan minat generasi muda terhadap sastra lisan Minangkabau melalui format digital yang interaktif.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-1"><i className="fas fa-check text-sm"></i></span>
              <span>Mengembangkan kurikulum latihan Randai yang adaptif untuk dinikmati oleh berbagai kalangan global.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-1"><i className="fas fa-check text-sm"></i></span>
              <span>Mendirikan panggung representatif baik secara fisik maupun virtual untuk memfasilitasi kreativitas seniman muda.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-serif text-3xl font-extrabold text-center text-slate-800 dark:text-white">Struktur Kepengurusan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {roles.map((r, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none text-center flex flex-col items-center justify-center hover:border-[#e11d48]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-white/40 mb-3 text-lg">
                <i className={`fas ${r.icon}`}></i>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white/95 leading-tight mb-1">{r.name}</h4>
              <span className="text-xs text-slate-500 dark:text-white/40 font-light block">{r.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Profil.layout = getOtherLayout;
