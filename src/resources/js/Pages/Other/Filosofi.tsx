import { useEffect, useState } from 'react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

interface FilosofiProps {
  sections?: PageSection[];
  philosophical_values?: any[];
}

const defaultFilosofi = [
  { title: 'Galuang (Lingkaran)', desc: 'Gerak melingkar melambangkan kebulatan tekad mufakat di Minangkabau. Gelanggang randai yang bulat melambangkan kesetaraan derajat seluruh anak nagari.', icon: 'fa-dot-circle', tag: 'Gerak Gelanggang' },
  { title: 'Silek Sisawah (Bela Diri)', desc: 'Pondasi fisik utama randai. Gerakan silat tradisional khas Sumpur Kudus yang defensif, mengajarkan kerendahan hati dan kepatuhan hukum adat.', icon: 'fa-fist-raised', tag: 'Silek Tradisional' },
  { title: 'Bakaba Kuno (Sastra Lisan)', desc: 'Penyampaian cerita moral (kaba) oleh Tukang Kaba. Menjaga tuturan sejarah pahlawan dan silsilah suku di Sijunjung agar tidak punah.', icon: 'fa-book-open', tag: 'Teater Tutur' },
  { title: 'Talempong Ungah (Irama)', desc: 'Tabuhan instrumen khas daerah Sijunjung yang rancak. Denting logamnya melambangkan semangat kerja sama bergotong-royong.', icon: 'fa-music', tag: 'Ritme Nagari' }
];

export default function Filosofi({ sections, philosophical_values }: FilosofiProps) {
  const { isDark } = useOtherTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  const skeletonBaseColor = isDark ? '#1e293b' : '#e2e8f0';
  const skeletonHighlightColor = isDark ? '#334155' : '#f1f5f9';

  if (isLoading || !sections) {
    return (
      <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
        <div className="space-y-12 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Skeleton height={20} width="20%" className="mx-auto" />
            <Skeleton height={40} width="60%" className="mx-auto" />
            <Skeleton height={24} width="85%" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 space-y-4">
                <Skeleton height={20} width="30%" />
                <Skeleton height={24} width="70%" />
                <Skeleton count={3} />
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  // Parse Sections
  const headerSec = getSection('header');

  const headerTitle = headerSec?.title || "Makna Langkah \n& Kaba Nagari.";
  const headerSub = headerSec?.subtitle || "Di Sanggar Antabung Indah, seni Randai bukan sekadar gerakan fisik, melainkan jembatan penyampaian pesan luhur adat salingka nagari Sisawah.";

  const nilaiList = (philosophical_values && philosophical_values.length > 0)
    ? philosophical_values.map(v => ({ title: v.title, desc: v.description, icon: v.icon, tag: v.tag }))
    : defaultFilosofi;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Filosofi Seni</span>
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

      {/* Grid Falsafah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nilaiList.map((f, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:border-[#fbbf24]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              {f.tag && (
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 text-xs font-bold uppercase rounded-lg mb-4">{f.tag}</span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <i className={`fas ${f.icon || 'fa-star'} text-[#d97706] dark:text-[#fbbf24] text-lg`}></i>
                <h4 className="font-serif text-lg font-bold text-slate-800 dark:text-white leading-tight">{f.title}</h4>
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
