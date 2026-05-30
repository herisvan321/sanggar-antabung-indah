import { Link, Head } from '@inertiajs/react';
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

interface ProgramItem {
  id?: number;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface ProgramProps {
  sections?: PageSection[];
  programs?: ProgramItem[];
}

const defaultReguler: ProgramItem[] = [
  { id: 1, title: "Kelas Silek Tradisi", description: "Pelatihan bela diri silat Minang aliran Sisawah untuk melatih fisik.", icon: "fa-shoe-prints", category: "reguler" },
  { id: 2, title: "Teater tutur Randai", description: "Kelas akting teater rakyat, vokal dendang, dan tepukan celana galembong.", icon: "fa-users", category: "reguler" }
];

const defaultEkowisata: ProgramItem[] = [
  { id: 3, title: "Pentas Budaya Gua", description: "Menyaksikan randai di mulut Gua Ngalau Antabuang yang eksotis.", icon: "fa-mountain-sun", category: "ekowisata" },
  { id: 4, title: "Jelajah Wisata Adat", description: "Tur keliling nagari mengenal sejarah adat dan prosesi pertanian tradisional.", icon: "fa-leaf", category: "ekowisata" }
];

export default function Program({ sections, programs }: ProgramProps) {
  const { showToast } = useOtherTheme();

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  // Parse Sections
  const headerSec = getSection('header');
  const regulerSec = getSection('reguler');
  const ekowisataSec = getSection('ekowisata');

  const headerTitle = headerSec?.title || "Program Pelestarian \nSeni Tradisi.";
  const headerSub = headerSec?.subtitle || "Kami menyelenggarakan berbagai program berkelanjutan untuk menjaga warisan adat budaya tetap hidup.";

  const rawReguler = programs?.filter(p => p.category === 'reguler') || [];
  const regulerList = rawReguler.length > 0 ? rawReguler : defaultReguler;

  const rawEkowisata = programs?.filter(p => p.category === 'ekowisata') || [];
  const ekowisataList = rawEkowisata.length > 0 ? rawEkowisata : defaultEkowisata;

  return (
    <>
      <Head>
        <title>Program Kegiatan & Ekowisata - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="Program Kegiatan & Ekowisata - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Pusat Latihan</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kelas Seni Reguler Card */}
          <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <span className="text-[#10b981] text-base font-bold uppercase tracking-widest block">
              <i className="fas fa-school mr-2"></i> {regulerSec?.title || "Kelas Seni & Budaya Reguler"}
            </span>
            <div className="space-y-4">
              {regulerList.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0">
                    <i className={`fas ${item.icon || 'fa-graduation-cap'}`}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed mt-1 font-light">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ekowisata Seni Card */}
          <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <span className="text-[#fbbf24] text-base font-bold uppercase tracking-widest block">
              <i className="fas fa-route mr-2"></i> {ekowisataSec?.title || "Ekowisata Seni Sisawah"}
            </span>
            <div className="space-y-4">
              {ekowisataList.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/15 text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center shrink-0">
                    <i className={`fas ${item.icon || 'fa-hiking'}`}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed mt-1 font-light">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Link href="/join" className="flex-1 text-center py-4.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest">
                Daftar Murid
              </Link>
              <button onClick={() => showToast('Mengunduh katalog ekowisata...')} className="px-5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70 rounded-xl transition-all">
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

Program.layout = getOtherLayout;
