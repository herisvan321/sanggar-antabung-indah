import { FormEvent } from 'react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const benefits = [
  'Akses latihan berkala di Balai Adat Kenagarian Sisawah',
  'Pendampingan intensif bersama Guru Gadang Silek Sisawah',
  'Sertifikat keanggotaan resmi berstandar Dinas Pendidikan & Kebudayaan Sijunjung',
  'Kesempatan tampil dalam event pariwisata Desa Wisata Sisawah',
  'Fasilitas penggunaan busana adat & alat musik tradisi sanggar secara gratis',
  'Akses gratis menonton seluruh pementasan teater kolosal berbayar sanggar'
];

export default function Join() {
  const { showToast } = useOtherTheme();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast('Pendaftaran Berhasil! Pengurus Sanggar akan menghubungi Anda via WhatsApp.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-sm font-bold uppercase tracking-wider rounded-full">Penerimaan Anggota</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Bergabung Dengan Gelanggang</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Kami menyambut hangat anak-anak nagari maupun pencinta seni budaya yang ingin melestarikan Randai dan bela diri silat Minangkabau.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form Card */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Formulir Pendaftaran Online</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Nama Lengkap</label>
                <input type="text" required placeholder="Contoh: Rajo Diwangso" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Asal Daerah (Kecamatan/Nagari)</label>
                <input type="text" required placeholder="Contoh: Sisawah, Sumpur Kudus" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Nomor WhatsApp</label>
                <input type="tel" required placeholder="0812XXXXXXXX" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Kategori Kelas Utama</label>
                <select className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-600 dark:text-white/70 focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300">
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pemain Randai / Aktor</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Silek Tradisional Minang</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pemusik (Talempong Ungah/Rabab/Saluang)</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Tari Pijak Galeh (Piring)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Motivasi Bergabung</label>
              <textarea rows={4} placeholder="Ceritakan ketertarikan Anda bersama kami..." className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300"></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#e11d48] to-[#fbbf24] text-white text-sm font-bold rounded-xl hover:brightness-115 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#e11d48]/20">
              Kirim Berkas Pendaftaran
            </button>
          </form>
        </div>

        {/* Benefits Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Benefit Keanggotaan</h3>
          <div className="space-y-3">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <span className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 text-sm font-bold">{idx + 1}</span>
                <span className="text-sm text-slate-600 dark:text-white/70 font-light leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Join.layout = getOtherLayout;
