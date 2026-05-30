import { FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';

interface PageSection {
  id: number;
  page_key: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  media_url: string | null;
  video_url: string | null;
}

interface JoinStepItem {
  id?: number;
  step?: string | null;
  title?: string | null;
  description: string;
  category: string;
}

interface JoinProps {
  sections?: PageSection[];
  join_steps?: JoinStepItem[];
}

const defaultSyarat: JoinStepItem[] = [
  { id: 1, description: "Terbuka untuk anak nagari Sisawah maupun umum usia 7 - 25 tahun", category: "syarat" },
  { id: 2, description: "Memiliki komitmen tinggi untuk mengikuti latihan rutin secara disiplin", category: "syarat" },
  { id: 3, description: "Mendapatkan izin tertulis dari orang tua bagi yang berusia di bawah 17 tahun", category: "syarat" }
];

const defaultPendaftaran: JoinStepItem[] = [
  { id: 4, step: "1", title: "Isi Formulir", description: "Kunjungi gelanggang utama Jorong Tarok setiap hari latihan untuk mengambil formulir.", category: "pendaftaran" },
  { id: 5, step: "2", title: "Seleksi Fisik & Wawancara", description: "Wawancara pengenalan minat bakat bersama guru gadang sanggar.", category: "pendaftaran" },
  { id: 6, step: "3", title: "Pengukuhan Sasian", description: "Prosesi adat pengukuhan murid baru gelanggang (sasasian).", category: "pendaftaran" }
];

export default function Join({ sections, join_steps }: JoinProps) {
  const { showToast } = useOtherTheme();

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast('Pendaftaran Berhasil! Pengurus Sanggar akan menghubungi Anda via WhatsApp.');
    (e.target as HTMLFormElement).reset();
  };

  // Parse Sections
  const headerSec = getSection('header');
  const syaratSec = getSection('syarat');
  const pendaftaranSec = getSection('pendaftaran');

  const headerTitle = headerSec?.title || "Gabung Sasian \nSanggar Antabung.";
  const headerSub = headerSec?.subtitle || "Kami menyambut hangat anak-anak nagari maupun pencinta seni budaya yang ingin melestarikan Randai dan bela diri silat Minangkabau.";

  const rawSyarat = join_steps?.filter(j => j.category === 'syarat') || [];
  const syaratList = rawSyarat.length > 0 ? rawSyarat : defaultSyarat;

  const rawPendaftaran = join_steps?.filter(j => j.category === 'pendaftaran') || [];
  const pendaftaranList = rawPendaftaran.length > 0 ? rawPendaftaran : defaultPendaftaran;

  return (
    <>
      <Head>
        <title>Pendaftaran Sasian (Anggota Baru) - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="Pendaftaran Sasian (Anggota Baru) - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-sm font-bold uppercase tracking-wider rounded-full">Penerimaan Anggota</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-black whitespace-pre-line">
            {headerTitle.includes('\n') ? (
              <>
                {headerTitle.split('\n')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fbbf24]">{headerTitle.split('\n')[1]}</span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fbbf24]">{headerTitle}</span>
            )}
          </h2>
          <p className="text-slate-600 dark:text-white/60 font-light text-base">{headerSub}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Registration Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">{pendaftaranSec?.title || "Formulir Pendaftaran Online"}</h3>
            
            {/* Steps description */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {pendaftaranList.map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-none rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider">Langkah {item.step || idx+1}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{item.title || "Langkah Baru"}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-white/40 leading-tight font-light">{item.description}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Nama Lengkap</label>
                  <input type="text" required placeholder="Contoh: Rajo Diwangso" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Asal Daerah (Kecamatan/Nagari)</label>
                  <input type="text" required placeholder="Contoh: Sisawah, Sumpur Kudus" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Nomor WhatsApp</label>
                  <input type="tel" required placeholder="0812XXXXXXXX" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Kategori Kelas Utama</label>
                  <select className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-650 dark:text-white/70 focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300">
                    <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pemain Randai / Aktor</option>
                    <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Silek Tradisional Minang</option>
                    <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pemusik (Talempong/Rabab)</option>
                    <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Tari Pijak Galeh (Piring)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Motivasi Bergabung</label>
                <textarea rows={3} placeholder="Ceritakan ketertarikan Anda bersama kami..." className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#e11d48] text-sm transition-colors duration-300"></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#e11d48] to-[#fbbf24] text-white text-sm font-bold rounded-xl hover:brightness-115 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#e11d48]/20">
                Kirim Berkas Pendaftaran
              </button>
            </form>
          </div>

          {/* Requirements Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">{syaratSec?.title || "Persyaratan Anggota"}</h3>
            <div className="space-y-3">
              {syaratList.map((b, idx) => (
                <div key={b.id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 text-sm font-bold">{idx + 1}</span>
                  <span className="text-sm text-slate-600 dark:text-white/70 font-light leading-relaxed">{b.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Join.layout = getOtherLayout;
