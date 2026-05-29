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

interface ProfilProps {
  sections?: PageSection[];
  structures?: any[];
}

const defaultStruktur = [
  { name: 'Datuak Bagindo Rajo', role: 'Penasihat Adat / Ninik Mamak', icon: 'fa-user-tie' },
  { name: 'Andi Saputra M.Sn', role: 'Ketua Pengurus & Kurator Seni', icon: 'fa-users-cog' },
  { name: 'Rina Permata Sari', role: 'Sekretaris & Hubungan Wisata', icon: 'fa-file-signature' },
  { name: 'Doni Aliansyah', role: 'Bendahara & Manajemen Alat', icon: 'fa-file-invoice-dollar' },
  { name: 'Sutan Mangkuto', role: 'Guru Gadang Silek (Silat)', icon: 'fa-shoe-prints' },
  { name: 'Novianti M.Pd', role: 'Pelatih Randai & Sastra Tutur', icon: 'fa-feather-alt' },
  { name: 'Ilham Rahmadani', role: 'Pemain Talempong Ungah', icon: 'fa-music' },
  { name: 'Agung Gunawan', role: 'Koordinator Gelanggang Latihan', icon: 'fa-tools' },
  { name: 'Bundo Kanduang Sisawah', role: 'Pelestari Busana Adat', icon: 'fa-female' }
];

export default function Profil({ sections, structures }: ProfilProps) {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 space-y-4">
              <Skeleton height={24} width="40%" />
              <Skeleton height={32} width="80%" />
              <Skeleton count={4} />
            </div>
            <div className="p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 space-y-4">
              <Skeleton height={24} width="40%" />
              <Skeleton height={32} width="80%" />
              <Skeleton count={4} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  // Parse Sections
  const headerSec = getSection('header');
  const sejarahSec = getSection('sejarah');
  const visiSec = getSection('visi_misi');
  const strukturSec = getSection('struktur');

  // 1. Header
  const headerTitle = headerSec?.title || "Adat Pusako, \nKreativitas Tanpa Batas.";
  const headerSub = headerSec?.subtitle || "Didirikan di Kenagarian Sisawah, Sijunjung, kami berdedikasi menjaga warisan leluhur melalui teater Randai dan kesenian tradisional Minangkabau.";

  // 2. Sejarah
  const sejarahTitle = sejarahSec?.title || "Terinspirasi Keindahan Ngalau Antabuang";
  const sejarahText = sejarahSec?.subtitle || "Sanggar Antabung Indah didirikan oleh para pemuda dan pemuka adat Nagari Sisawah. Nama \"Antabung\" diambil dari objek wisata gua alam termahsyur di Sisawah, yaitu Ngalau Antabuang. Sanggar ini dibentuk sebagai wadah anak nagari untuk berlatih silat (silek) dan randai setelah pulang dari sawah, guna melestarikan adat salingka nagari di tengah derasnya arus modernisasi.";
  let sejarahQuote = "Kesenian Randai di Sisawah bukan sekadar hiburan, melainkan sarana musyawarah adat dan penyampaian petuah moral kehidupan.";
  if (sejarahSec?.content) {
    try { sejarahQuote = JSON.parse(sejarahSec.content); } catch (_) { sejarahQuote = sejarahSec.content; }
  }

  // 3. Visi Misi
  const visiTitle = visiSec?.title || "Pilar Kebudayaan Nagari Sisawah";
  let visiItems = [
    { text: "Melestarikan randai, musik Talempong Ungah, dan seni tari tradisi di kalangan anak sasian (generasi muda)." },
    { text: "Mengintegrasikan pementasan seni tradisi sebagai daya tarik pariwisata unggulan Desa Wisata Nagari Sisawah." },
    { text: "Memanfaatkan media digital untuk mengenalkan keelokan budaya Sijunjung ke mata dunia internasional." }
  ];
  if (visiSec?.content) {
    try { visiItems = JSON.parse(visiSec.content); } catch (_) {}
  }

  // 4. Struktur
  const strukturTitle = strukturSec?.title || "Struktur Pengurus & Tokoh Adat";
  const strukturList = (structures && structures.length > 0) ? structures : defaultStruktur;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Tentang Kami</span>
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

      {/* Sejarah & Visi Misi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <span className="text-[#fbbf24] text-base font-bold uppercase tracking-widest block"><i className="fas fa-history mr-2"></i> Sejarah Pendirian</span>
          <h3 className="font-serif text-3xl font-extrabold text-slate-800 dark:text-white">{sejarahTitle}</h3>
          <p className="text-slate-600 dark:text-white/77 text-base leading-relaxed font-light">{sejarahText}</p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-sm text-slate-500 dark:text-white/50 leading-relaxed italic">
            "{sejarahQuote}"
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <span className="text-[#10b981] text-base font-bold uppercase tracking-widest block"><i className="fas fa-bullseye mr-2"></i> Visi & Misi Kami</span>
          <h3 className="font-serif text-3xl font-extrabold text-slate-800 dark:text-white">{visiTitle}</h3>
          <ul className="space-y-4 text-base font-light text-slate-600 dark:text-slate-300">
            {visiItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center shrink-0 mt-1"><i className="fas fa-check text-sm"></i></span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pengurus */}
      <div className="space-y-6">
        <h3 className="font-serif text-3xl font-extrabold text-center text-slate-800 dark:text-white">{strukturTitle}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {strukturList.map((r, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none text-center flex flex-col items-center justify-center hover:border-[#e11d48]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-white/40 mb-3 text-lg">
                <i className={`fas ${r.icon || 'fa-user'}`}></i>
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
