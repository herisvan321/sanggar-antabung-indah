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

interface ContactInfoItem {
  id?: number;
  icon: string;
  label: string;
  value: string;
}

interface KontakProps {
  sections?: PageSection[];
  contact_infos?: ContactInfoItem[];
}

const defaultInfo = [
  { icon: "fa-envelope", label: "Email Kami", val: "info@antabung.art" },
  { icon: "fa-phone", label: "Telepon / WA", val: "+62 823-8899-7711" },
  { icon: "fa-map-marker-alt", label: "Alamat Fisik", val: "Jorong Tarok, Nagari Sisawah, Sijunjung, Sumatera Barat" }
];

export default function Kontak({ sections, contact_infos }: KontakProps) {
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
              <Skeleton height={28} width="40%" />
              <Skeleton height={45} count={4} />
            </div>
            <div className="p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 space-y-4">
              <Skeleton height={28} width="40%" />
              <Skeleton height={200} borderRadius={16} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  // Parse Sections
  const headerSec = getSection('header');
  const infoSec = getSection('info');
  const petaSec = getSection('peta');

  const headerTitle = headerSec?.title || "Hubungi Gelanggang \nKami.";
  const headerSub = headerSec?.subtitle || "Pintu komunikasi Sanggar Antabung Indah terbuka lebar untuk kerja sama pementasan, riset akademis, maupun kunjungan ekowisata.";

  const infoList = (contact_infos && contact_infos.length > 0)
    ? contact_infos.map(c => ({ icon: c.icon, label: c.label, val: c.value }))
    : defaultInfo;

  // Fallback map embed URL
  const mapEmbedUrl = petaSec?.title || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.020580971032!2d100.865!3d-0.455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e2b34a6!2sSisawah!5e0!3m2!1sid!2sid!4v1700000000000";

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-sm font-bold uppercase tracking-wider rounded-full">Gerbang Hubungan</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Channels */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">{infoSec?.title || "Saluran Komunikasi"}</h3>
          <div className="space-y-3">
            {infoList.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#10b981]/30 transition-all duration-300 shadow-sm dark:shadow-none">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 text-[#10b981]">
                  <i className={`fas ${c.icon || 'fa-phone-alt'} text-base`}></i>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 dark:text-white/40 uppercase font-bold leading-none">{c.label}</span>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-white/90 leading-normal mt-1">{c.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Maps Embed iframe */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-slate-800 dark:text-white">{petaSec?.title || "Lokasi Balai Sanggar"}</h3>
            <div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden flex items-center justify-center group shadow-md">
              <iframe
                src={mapEmbedUrl}
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs sm:text-sm text-slate-400 dark:text-white/40 leading-relaxed font-light">
            <p><i className="fas fa-info-circle text-[#fbbf24] mr-2"></i> Info Kunjungan: Sangat disarankan untuk membuat janji temu terlebih dahulu dengan pengurus sebelum berkunjung.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Kontak.layout = getOtherLayout;
