import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface HomeSection {
  id: number;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  media_url: string | null;
  video_url: string | null;
}

interface HomeProps {
  sections?: HomeSection[];
  metrics?: any[];
  programs?: any[];
  schedules?: any[];
}

const defaultEvents = [
  { date: '12 Sep 2026', title: 'Pementasan Randai Kolosal di Pelataran Ngalau Antabuang', place: 'Desa Wisata Sisawah' },
  { date: '28 Okt 2026', title: 'Prosesi Budaya Bakaua Adat Nagari Sisawah', place: 'Gelanggang Balai Adat' },
  { date: '15 Des 2026', title: 'Festival Budaya Lansek Manih Sijunjung', place: 'Muaro Sijunjung' }
];

const defaultServices = [
  { title: 'Pendidikan Randai Anak Nagari', desc: 'Pelatihan rutin gerakan silek (silat) dan teater tutur bagi generasi muda Sisawah.', icon: 'fa-users', border: 'hover:border-[#e11d48]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Konservasi Sastra Kaba', desc: 'Perpustakaan naskah digital cerita rakyat Minang, seperti Cindua Mato dan Nan Tongga.', icon: 'fa-book-open', border: 'hover:border-[#fbbf24]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Kelas Talempong Ungah & Canang', desc: 'Eksplorasi permainan alat musik perkusi etnis khas Sijunjung.', icon: 'fa-music', border: 'hover:border-[#10b981]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Ekowisata Seni Ngalau Antabuang', desc: 'Paket pertunjukan seni menyatu dengan petualangan alam menyusuri gua karst.', icon: 'fa-mountain-sun', border: 'hover:border-purple-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' }
];

export default function Home({ sections, metrics, programs, schedules }: HomeProps) {
  const { showToast, isDark } = useOtherTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    showToast("Selamat datang di Sanggar Antabung Indah Nagari Sisawah!");
    // Simulate initial loading to showcase skeleton loaders
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  // Skeleton Colors based on dark/light mode
  const skeletonBaseColor = isDark ? '#1e293b' : '#e2e8f0';
  const skeletonHighlightColor = isDark ? '#334155' : '#f1f5f9';

  if (isLoading || !sections) {
    return (
      <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
        <div className="space-y-12 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 p-8 sm:p-12 rounded-[36px] bg-slate-900 border border-slate-800 text-white min-h-[500px] flex flex-col justify-between">
              <div className="space-y-6">
                <Skeleton height={50} width="60%" />
                <Skeleton height={30} width="85%" />
                <Skeleton count={3} />
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Skeleton height={48} width={180} borderRadius={12} />
                <Skeleton height={48} width={180} borderRadius={12} />
              </div>
            </div>
            <div className="lg:col-span-5 p-6 rounded-[36px] bg-slate-950 border border-slate-900 min-h-[500px] flex flex-col justify-between">
              <Skeleton height={28} width="40%" />
              <div className="my-4">
                <Skeleton height={220} borderRadius={16} />
              </div>
              <Skeleton height={40} borderRadius={12} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 min-h-[220px]"><Skeleton count={4} /></div>
            <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 min-h-[220px]"><Skeleton count={4} /></div>
            <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 min-h-[220px]"><Skeleton count={4} /></div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  // Parse Section: Hero
  const heroSec = getSection('hero');
  const heroTitle = heroSec?.title || "Seni Randai \nLembah Sisawah.";
  const heroSubtitle = heroSec?.subtitle || "Selamat datang di portal resmi Sanggar Antabung Indah. Menjaga denyut nadi kesenian tradisional Randai, musik Talempong Ungah, dan warisan budaya adat Kenagarian Sisawah, Sumpur Kudus, Sijunjung.";
  let heroButtons = [
    { text: "Gabung Gelanggang", link: "/join" },
    { text: "Booking Pementasan", link: "/booking" }
  ];
  if (heroSec?.content) {
    try { heroButtons = JSON.parse(heroSec.content); } catch (_) {}
  }

  // Parse Section: Video
  const videoSec = getSection('video');
  const videoTitle = videoSec?.title || "Randai Anak Nagari Sisawah";
  const videoSubtitle = videoSec?.subtitle || "Dokumentasi pertunjukan teater kolosal Randai Minangkabau. Nikmati keselarasan langkah silat gelanggang yang diwariskan turun-temurun di Sijunjung.";
  const videoUrl = videoSec?.video_url || "https://www.youtube.com/embed/R9Z_Gf21y18";
  let videoMeta = { badge: "PEMENTASAN KABA", status: "LIVE DOCUMENTARY" };
  if (videoSec?.content) {
    try { videoMeta = JSON.parse(videoSec.content); } catch (_) {}
  }

  // Parse Section: Legalitas
  const legalSec = getSection('legalitas');
  const legalTitle = legalSec?.title || "Gelanggang Sanggar";
  const legalSubtitle = legalSec?.subtitle || "Alam Takambang Jadi Guru — Seni Menjaga Adat Salingka Nagari.";
  let legalItems = [
    { icon: "fa-check-double", text: "Terdaftar di Dinas Pendidikan & Kebudayaan Sijunjung" },
    { icon: "fa-stamp", text: "SK Pendirian Nomor: 430/128/Disparpora-SJJ/2012" },
    { icon: "fa-map-pin", text: "Jorong Tarok, Nagari Sisawah, Sijunjung" }
  ];
  if (legalSec?.content) {
    try { legalItems = JSON.parse(legalSec.content); } catch (_) {}
  }

  // Parse Section: Agenda
  const agendaSec = getSection('agenda');
  const agendaTitle = agendaSec?.title || "Jadwal Terdekat";
  const agendaEvents = (schedules && schedules.length > 0) ? schedules : defaultEvents;

  // Parse Section: Metrik
  const metrikSec = getSection('metrik');
  const metrikTitle = metrikSec?.title || "Metrik Kesenian";
  const metrikItems = (metrics && metrics.length > 0) ? metrics : [
    { value: "120+", label: "Anak Sasian" },
    { value: "15+", label: "Mitra Wisata" },
    { value: "80+", label: "Pementasan" },
    { value: "14 Th", label: "Mengabdi" }
  ];

  // Parse Section: Services
  const servicesSec = getSection('services');
  const servicesTitle = servicesSec?.title || "Layanan & Atraksi Budaya";
  const servicesItems = (programs && programs.length > 0)
    ? programs.map(p => ({ title: p.title, desc: p.description, icon: p.icon }))
    : defaultServices;

  const borderColors = [
    'hover:border-[#e11d48]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80',
    'hover:border-[#fbbf24]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80',
    'hover:border-[#10b981]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80',
    'hover:border-purple-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80'
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Hero Content Card */}
        <div className="lg:col-span-7 p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[500px]">
          {/* Background Image if uploaded */}
          {heroSec?.media_url && (
            <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${heroSec.media_url})` }}></div>
          )}
          
          {/* Background Ornament */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#e11d48]">
              <polygon points="50,0 100,100 0,100" />
              <polygon points="50,15 90,95 10,95" fill="#fbbf24" opacity="0.5"/>
            </svg>
          </div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e11d48_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#e11d48]/15 blur-[120px] pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 space-y-6">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-7.5xl font-black leading-none tracking-tight whitespace-pre-line">
              {heroTitle.includes('\n') ? (
                <>
                  {heroTitle.split('\n')[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] via-[#fbbf24] to-[#10b981]">{heroTitle.split('\n')[1]}</span>
                </>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] via-[#fbbf24] to-[#10b981]">{heroTitle}</span>
              )}
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              {heroSubtitle}
            </p>
          </div>

          {/* Custom CTA Row */}
          <div className="flex flex-wrap items-center gap-4 relative z-10 mt-8 pt-6 border-t border-slate-800/60">
            {heroButtons[0] && (
              <Link href={heroButtons[0].link} className="px-7 py-4.5 bg-[#e11d48] text-white text-sm font-bold rounded-2xl hover:brightness-110 hover:shadow-xl hover:shadow-[#e11d48]/20 active:scale-95 transition-all duration-300 flex items-center gap-2">
                {heroButtons[0].text} <i className="fas fa-chevron-right text-xs"></i>
              </Link>
            )}
            {heroButtons[1] && (
              <Link href={heroButtons[1].link} className="px-7 py-4.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold rounded-2xl active:scale-95 transition-all duration-300 flex items-center gap-2">
                {heroButtons[1].text} <i className="fas fa-calendar-alt text-xs text-[#fbbf24]"></i>
              </Link>
            )}
          </div>
        </div>

        {/* Cinematic Embedded YouTube Video Column */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-6 rounded-[36px] bg-slate-950 text-white border border-slate-900 overflow-hidden shadow-2xl min-h-[500px] group transition-all duration-500 hover:border-[#e11d48]/30">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#e11d48]/20 via-[#fbbf24]/10 to-transparent blur-[100px] pointer-events-none"></div>
          
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5 col-span-3">
                <span className="inline-block px-3 py-1 bg-[#fbbf24] text-black text-xs font-black uppercase rounded-lg shadow-md tracking-wider">{videoMeta.badge}</span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">{videoTitle}</h4>
              </div>
              <span className="text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-full border border-white/5 font-semibold shrink-0">
                <i className="fas fa-play-circle text-red-500 mr-1 animate-pulse"></i> {videoMeta.status}
              </span>
            </div>

            {/* YouTube Responsive Wrapper */}
            <div className="w-full relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5 my-4">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            <div className="space-y-2.5 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                <i className="fa-solid fa-circle-info text-[#fbbf24] mr-1.5"></i>
                {videoSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY DASHBOARD ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Card 1: Identitas Resmi Kultural */}
        <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase tracking-wider rounded-full">Legalitas Resmi</span>
            <h3 className="font-serif text-2xl font-black text-slate-800 dark:text-white">{legalTitle}</h3>
            
            <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
              {legalItems.map((item, idx) => {
                const colorMap: Record<number, string> = {
                  0: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                  1: 'bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24]',
                  2: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                };
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colorMap[idx % 3]}`}>
                      <i className={`fas ${item.icon || 'fa-check'} text-xs`}></i>
                    </span>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-white/5 text-xs sm:text-sm italic text-slate-400 dark:text-white/30 leading-relaxed">
            "{legalSubtitle}"
          </div>
        </div>

        {/* Card 2: Agenda Terdekat */}
        <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div>
            <span className="inline-block px-3 py-1 bg-[#fbbf24]/20 text-[#d97706] dark:text-[#fbbf24] text-xs font-bold uppercase tracking-wider rounded-full mb-3">Agenda Panggung</span>
            <h3 className="font-serif text-2xl font-bold mb-4 text-slate-800 dark:text-white">{agendaTitle}</h3>
            <div id="home-events-container" className="space-y-3">
              {agendaEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-[#fbbf24]/30 transition-all duration-300">
                  <div className="text-center p-2 rounded-lg bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] shrink-0">
                    <span className="block text-sm font-bold leading-none">{ev.date.split(' ')[0]}</span>
                    <span className="text-[11px] uppercase font-semibold leading-none">{ev.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white/90 leading-tight">{ev.title}</h4>
                    <span className="text-xs text-slate-500 dark:text-white/40"><i className="fas fa-map-marker-alt mr-1"></i> {ev.place}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/jadwal" className="mt-4 text-[#e11d48] dark:text-[#fbbf24] hover:text-[#be123c] dark:hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors duration-300 w-fit">
            Buka Kalender Event <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* Card 3: Statistik Vital & Kolaborasi */}
        <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/20 text-[#10b981] text-xs font-bold uppercase tracking-wider rounded-full">Rekam Jejak</span>
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">{metrikTitle}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {metrikItems.map((metric, idx) => {
                const colorsMap: Record<number, string> = {
                  0: 'text-[#e11d48]',
                  1: 'text-[#d97706] dark:text-[#fbbf24]',
                  2: 'text-[#10b981]',
                  3: 'text-purple-500'
                };
                return (
                  <div key={idx} className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                    <span className={`block text-3xl font-black ${colorsMap[idx % 4]}`}>{metric.value}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">{metric.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Link href="/profil" className="text-slate-500 dark:text-white/40 hover:text-[#e11d48] text-sm font-semibold flex items-center gap-2 transition-colors duration-300 w-fit">
            Pelajari Struktur Tim <i className="fas fa-users-cog"></i>
          </Link>
        </div>
      </div>

      {/* Grid Extra: Layanan Unggulan */}
      <div className="space-y-6">
        <h3 className="font-serif text-3xl font-bold text-slate-800 dark:text-white">{servicesTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesItems.map((s, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm dark:shadow-none ${borderColors[idx % 4]}`}>
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#d97706] dark:text-[#fbbf24] mb-4 text-base">
                <i className={`fas ${s.icon || 'fa-users'}`}></i>
              </div>
              <h4 className="text-sm sm:text-base font-bold mb-2 text-slate-800 dark:text-white">{idx + 1}. {s.title}</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Home.layout = getOtherLayout;
