import { getOtherLayout } from '../../Layouts/OtherLayouts';

const contacts = [
  { label: 'Layanan WhatsApp Pengurus', value: '+62 823 8912 3456', icon: 'fa-whatsapp', color: 'text-green-500' },
  { label: 'Surel Korespondensi Resmi', value: 'admin@antabung.art', icon: 'fa-envelope', color: 'text-rose-500' },
  { label: 'Instagram Galeri Utama', value: '@sanggar_antabung_indah', icon: 'fa-instagram', color: 'text-pink-500' },
  { label: 'YouTube Saluran Dokumenter', value: 'Sanggar Antabung Indah TV', icon: 'fa-youtube', color: 'text-red-500' }
];

export default function Kontak() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-sm font-bold uppercase tracking-wider rounded-full">Gerbang Hubungan</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Hubungi Kami</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Pintu komunikasi Sanggar Antabung Indah terbuka lebar untuk kerja sama pementasan, riset akademis, maupun kunjungan ekowisata.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Channels */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Saluran Komunikasi</h3>
          <div className="space-y-3">
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#10b981]/30 transition-all duration-300 shadow-sm dark:shadow-none">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 ${c.color}`}>
                  <i className={`fab ${c.icon} text-lg`}></i>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 dark:text-white/40 uppercase font-bold leading-none">{c.label}</span>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-white/90 leading-normal mt-1">{c.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Maps Info */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-slate-800 dark:text-white">Lokasi Balai Sanggar</h3>
            <div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-cover bg-center filter opacity-40 blur-[1px] group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="relative z-10 text-center space-y-2 p-4">
                <i className="fas fa-map-marked-alt text-3xl text-[#e11d48] animate-bounce"></i>
                <h4 className="font-serif text-lg font-bold text-white">Gelanggang Utama Antabung Indah</h4>
                <p className="text-sm text-white/80 max-w-md mx-auto">Jorong Tarok, Kenagarian Sisawah, Kecamatan Sumpur Kudus, Kabupaten Sijunjung, Sumatera Barat, Indonesia</p>
                <a href="https://maps.google.com/?q=Sisawah+Sumpur+Kudus+Sijunjung" target="_blank" rel="noreferrer" className="inline-block mt-2 px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-xs font-bold uppercase rounded-lg text-white transition-colors duration-300">Buka Google Maps <i className="fas fa-external-link-alt ml-1"></i></a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">
            <p><i className="fas fa-info-circle text-[#fbbf24] mr-2"></i> Info Kunjungan: Sangat disarankan untuk membuat janji temu terlebih dahulu dengan pengurus nagari Sisawah sebelum berkunjung.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Kontak.layout = getOtherLayout;
