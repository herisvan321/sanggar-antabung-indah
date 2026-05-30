import { ReactNode, useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { OtherThemeProvider, useOtherTheme } from './OtherThemeContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface OtherLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: OtherLayoutProps) {
  const { theme, toggleTheme, isFullscreen, toggleFullscreen, toastOpen, toastMessage } = useOtherTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { props, url } = usePage<any>();
  const { settings, is_logged_in, permissions = [] } = props;
  const [isLoading, setIsLoading] = useState(true);

  // Trigger loading skeleton on page changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [url]);

  const isPageVisible = (tab: string) => {
    if (activePages[tab] === false) return false;
    if (is_logged_in) {
      const requiredPermission = `halaman_${tab}`;
      if (!permissions.includes(requiredPermission)) {
        return false;
      }
    }
    return true;
  };

  const settingsData = settings || {
    app_name: "Sanggar Antabung Indah",
    app_logo_name: "ANTABUNG.ART",
    meta_title: "Sanggar Antabung Indah | Nagari Sisawah Sijunjung",
    meta_description: "Sanggar Antabung Indah - Digitalisasi Kesenian Randai, Tari Pijak Galeh, dan Musik Talempong Ungah khas Kenagarian Sisawah, Sumpur Kudus, Sijunjung.",
    footer_description: "Pusat Pelestarian Kesenian Tradisional Randai & Kaba khas Nagari Wisata Sisawah, Kecamatan Sumpur Kudus, Kabupaten Sijunjung, Sumatera Barat.",
    footer_copyright: "2026 SANGGAR ANTABUNG INDAH"
  };

  const activePages = (() => {
    try {
      if (settingsData.active_pages) {
        return JSON.parse(settingsData.active_pages);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      home: true,
      profil: true,
      filosofi: true,
      galeri: true,
      jadwal: true,
      program: true,
      join: true,
      berita: true,
      booking: true,
      kontak: true,
      sop: true
    };
  })();

  const path = url.split('?')[0];
  let activeTab: 'home' | 'profil' | 'filosofi' | 'galeri' | 'jadwal' | 'program' | 'join' | 'berita' | 'booking' | 'kontak' | 'sop' = 'home';
  if (path.includes('/profil')) activeTab = 'profil';
  else if (path.includes('/filosofi')) activeTab = 'filosofi';
  else if (path.includes('/galeri')) activeTab = 'galeri';
  else if (path.includes('/jadwal')) activeTab = 'jadwal';
  else if (path.includes('/program')) activeTab = 'program';
  else if (path.includes('/join')) activeTab = 'join';
  else if (path.includes('/berita')) activeTab = 'berita';
  else if (path.includes('/booking')) activeTab = 'booking';
  else if (path.includes('/kontak')) activeTab = 'kontak';
  else if (path.includes('/sop')) activeTab = 'sop';

  // Parallax MouseMove Hover Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('.svg-3d-container') as HTMLElement;
      if (container) {
        const moveX = (e.clientX - window.innerWidth / 2) / 60;
        const moveY = (e.clientY - window.innerHeight / 2) / 60;
        container.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const baseColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const highlightColor = theme === 'dark' ? '#334155' : '#f1f5f9';

  // SKELETON HEADER RENDERER
  const renderSkeletonHeader = () => (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300" style={{ width: '95%' }}>
      <nav className="bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl px-6 py-4 sm:px-8 flex items-center justify-between shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-3">
          <Skeleton circle width={32} height={32} baseColor={baseColor} highlightColor={highlightColor} />
          <Skeleton width={120} height={24} borderRadius={8} baseColor={baseColor} highlightColor={highlightColor} />
        </div>
        <div className="hidden lg:flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} width={75} height={22} borderRadius={8} className="mx-1" baseColor={baseColor} highlightColor={highlightColor} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={38} borderRadius={12} className="hidden sm:block" baseColor={baseColor} highlightColor={highlightColor} />
          <Skeleton width={44} height={44} borderRadius={12} baseColor={baseColor} highlightColor={highlightColor} />
          <Skeleton width={44} height={44} borderRadius={12} baseColor={baseColor} highlightColor={highlightColor} />
        </div>
      </nav>
    </header>
  );

  // SKELETON FOOTER RENDERER
  const renderSkeletonFooter = () => (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md py-12 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton circle width={28} height={28} baseColor={baseColor} highlightColor={highlightColor} />
            <Skeleton width={150} height={24} borderRadius={8} baseColor={baseColor} highlightColor={highlightColor} />
          </div>
          <Skeleton count={3} baseColor={baseColor} highlightColor={highlightColor} />
        </div>
        <div className="md:col-span-4 space-y-3">
          <Skeleton width={120} height={20} borderRadius={6} baseColor={baseColor} highlightColor={highlightColor} />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} width={90} height={16} borderRadius={4} baseColor={baseColor} highlightColor={highlightColor} />
            ))}
          </div>
        </div>
        <div className="md:col-span-3 space-y-3">
          <Skeleton width={100} height={20} borderRadius={6} baseColor={baseColor} highlightColor={highlightColor} />
          <Skeleton width={130} height={16} borderRadius={4} baseColor={baseColor} highlightColor={highlightColor} />
          <Skeleton width={110} height={14} borderRadius={4} baseColor={baseColor} highlightColor={highlightColor} />
        </div>
      </div>
    </footer>
  );

  // SKELETON CONTENT RENDERER
  const renderSkeletonContent = () => (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="space-y-12 max-w-[1700px] mx-auto animate-pulse pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Skeleton height={20} width={120} className="mx-auto" borderRadius={20} />
          <Skeleton height={42} width="80%" className="mx-auto" borderRadius={12} />
          <Skeleton height={24} width="95%" className="mx-auto" borderRadius={8} />
        </div>

        {activeTab === 'home' && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/10 space-y-4">
                  <Skeleton circle width={48} height={48} />
                  <Skeleton height={24} width="60%" borderRadius={8} />
                  <Skeleton count={2} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Skeleton height={350} borderRadius={24} />
              <div className="space-y-6">
                <Skeleton height={32} width="80%" borderRadius={8} />
                <Skeleton count={4} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Skeleton height={320} borderRadius={24} />
              <div className="space-y-4">
                <Skeleton height={28} width="70%" borderRadius={8} />
                <Skeleton count={4} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="text-center space-y-3">
                  <Skeleton circle width={100} height={100} className="mx-auto" />
                  <Skeleton height={18} width="60%" className="mx-auto" borderRadius={6} />
                  <Skeleton height={14} width="40%" className="mx-auto" borderRadius={4} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'filosofi' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 rounded-3xl bg-white/40 dark:bg-black/10 border border-slate-250 dark:border-white/5 space-y-4">
                <Skeleton height={150} borderRadius={16} />
                <Skeleton height={22} width="80%" borderRadius={6} />
                <Skeleton count={3} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'galeri' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} height={180} borderRadius={16} />
            ))}
          </div>
        )}

        {(activeTab === 'jadwal' || activeTab === 'sop') && (
          <div className="space-y-6">
            <Skeleton height={48} borderRadius={12} />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} height={54} borderRadius={12} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'program' || activeTab === 'berita') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-6 rounded-3xl bg-white/50 dark:bg-black/10 border border-slate-200 dark:border-white/5 space-y-4">
                <Skeleton height={180} borderRadius={16} />
                <Skeleton height={24} width="85%" borderRadius={8} />
                <Skeleton count={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'join' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 bg-white/50 dark:bg-black/10 border border-slate-200 dark:border-white/5 rounded-2xl">
                <Skeleton circle width={40} height={40} className="flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Skeleton height={20} width="40%" borderRadius={6} />
                  <Skeleton count={2} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 rounded-3xl bg-white/50 dark:bg-black/10 border border-slate-200 dark:border-white/5 space-y-4 text-center">
                <Skeleton height={24} width="60%" className="mx-auto" borderRadius={6} />
                <Skeleton height={36} width="40%" className="mx-auto" borderRadius={6} />
                <Skeleton count={4} />
                <Skeleton height={40} borderRadius={12} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'kontak' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton height={32} width="60%" borderRadius={8} />
              <Skeleton count={3} />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} height={45} borderRadius={12} />
                ))}
              </div>
            </div>
            <Skeleton height={350} borderRadius={24} />
          </div>
        )}
      </div>
    </SkeletonTheme>
  );

  return (
    <div 
      id="body-root" 
      className="bg-[#f8fafc] dark:bg-[#0a0a0c] text-[#0f172a] dark:text-white transition-colors duration-500 font-sans overflow-x-hidden min-h-screen pb-24 lg:pb-16 relative flex flex-col"
    >
      {/* Background Animation Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-25 dark:opacity-20 transition-opacity duration-500">
        {/* 3D Vector Geometry Sphere & Octahedron */}
        <svg className="svg-3d-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] animate-spin-slow" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#e11d48', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 0.8 }} />
            </linearGradient>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: '#e11d48', stopOpacity: 0.15 }} />
              <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="85" fill="none" stroke="url(#glowGrad)" strokeWidth="0.7" strokeDasharray="4 2" />
          <path d="M100 15 L175 100 L100 185 L25 100 Z" fill="none" stroke="url(#glowGrad)" strokeWidth="1" />
          <path d="M100 15 L100 185 M25 100 L175 100" fill="none" stroke="url(#glowGrad)" strokeWidth="0.5" strokeDasharray="1 1" />
          <polygon points="100,45 115,85 155,100 115,115 100,155 85,115 45,100 85,85" fill="none" stroke="#fbbf24" strokeWidth="0.7" />
          <circle cx="100" cy="100" r="10" fill="url(#glowGrad)" className="animate-pulse" />
        </svg>
        <div className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(0,0,0,0) 70%)' }}></div>
      </div>

      {/* Header (Desktop Navigation) */}
      {isLoading ? (
        renderSkeletonHeader()
      ) : (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300" style={{ width: '95%' }}>
          <nav className="bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl px-6 py-4 sm:px-8 flex items-center justify-between shadow-lg dark:shadow-2xl">
            <Link href="/" className="flex items-center gap-3 font-serif text-xl sm:text-2xl font-black text-[#e11d48] hover:scale-105 transition-transform duration-300">
              <i className="fas fa-drum text-xl sm:text-2xl text-[#e11d48]"></i>
              <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fbbf24]">{settingsData.app_logo_name}</span>
            </Link>
            
            {/* Desktop Menu Links */}
            <ul className="hidden lg:flex items-center gap-1">
              {(['home', 'profil', 'filosofi', 'galeri', 'jadwal', 'program', 'join', 'berita', 'booking', 'sop', 'kontak'] as const).filter(isPageVisible).map(tab => {
                const href = tab === 'home' ? '/' : `/${tab}`;
                return (
                  <li key={tab}>
                    <Link 
                      href={href} 
                      className={`px-3.5 py-2 text-base sm:text-[17px] font-semibold rounded-xl transition-all duration-300 ${
                        activeTab === tab 
                          ? 'bg-[#e11d48]/10 text-[#e11d48]' 
                          : 'text-slate-600 dark:text-white/70 hover:text-[#e11d48] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {tab === 'join' ? 'Daftar' : tab === 'sop' ? 'SOP' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {is_logged_in ? (
                <Link 
                  href="/dashboard" 
                  className="hidden sm:flex px-4.5 py-2.5 bg-gradient-to-r from-[#e11d48] to-[#fbbf24] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="hidden sm:flex px-4.5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-[#e11d48] dark:hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border border-slate-250 dark:border-white/5"
                >
                  Masuk
                </Link>
              )}
              <button 
                onClick={toggleTheme} 
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-[#e11d48] dark:hover:text-white text-lg transition-all duration-300" 
                title="Ubah Tema"
              >
                <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
              </button>
              <button 
                onClick={toggleFullscreen} 
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-[#e11d48] dark:hover:text-white text-lg transition-all duration-300" 
                title="Layar Penuh"
              >
                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
              </button>
              {/* Burger button */}
              <button 
                onClick={() => setMobileMenuOpen(prev => !prev)} 
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 text-lg transition-all duration-300"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </nav>
          
          {/* Mobile Navigation Drawer */}
          <div 
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:hidden mt-2 bg-white/95 dark:bg-black/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl flex-col gap-2`}
          >
            {is_logged_in ? (
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-center rounded-xl bg-gradient-to-r from-[#e11d48] to-[#fbbf24] text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-center rounded-xl bg-slate-150 dark:bg-white/5 text-slate-800 dark:text-white/80 text-xs font-bold uppercase tracking-wider border border-slate-250 dark:border-white/10"
              >
                Masuk
              </Link>
            )}
            {(['home', 'profil', 'filosofi', 'galeri', 'jadwal', 'program', 'join', 'berita', 'booking', 'sop', 'kontak'] as const).filter(isPageVisible).map(tab => {
              const href = tab === 'home' ? '/' : `/${tab}`;
              return (
                <Link 
                  key={tab}
                  href={href} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold block ${
                    activeTab === tab ? 'bg-[#e11d48]/10 text-[#e11d48]' : 'text-slate-800 dark:text-white/80'
                  }`}
                >
                  {tab === 'join' ? 'Daftar' : tab === 'sop' ? 'SOP' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Link>
              );
            })}
          </div>
        </header>
      )}

      {/* MOBILE BOTTOM TAB BAR */}
      {!isLoading && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 dark:bg-[#141417]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-2 py-2.5 flex justify-around items-center">
          {(['home', 'profil', 'galeri', 'booking'] as const).filter(isPageVisible).map(tab => {
            const href = tab === 'home' ? '/' : `/${tab}`;
            return (
              <Link 
                key={tab}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 w-16 ${
                  activeTab === tab ? 'text-[#e11d48]' : 'text-slate-500 dark:text-white/60'
                }`}
              >
                <i className={`fas ${
                  tab === 'home' ? 'fa-home' : 
                  tab === 'profil' ? 'fa-users' : 
                  tab === 'galeri' ? 'fa-images' : 
                  'fa-file-signature'
                } text-base`}></i>
                <span className="text-[11px] sm:text-xs font-bold tracking-tight">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </Link>
            );
          })}
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)} 
            className="flex flex-col items-center justify-center gap-1 w-16 text-slate-500 dark:text-white/60"
          >
            <i className="fas fa-bars-staggered text-base"></i>
            <span className="text-[11px] sm:text-xs font-bold tracking-tight">Menu</span>
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="pt-28 pb-16 px-4 md:px-8 max-w-[1700px] mx-auto transition-all duration-500 flex-1 w-full">
        {isLoading ? renderSkeletonContent() : children}
      </main>

      {/* ===== FOOTER ===== */}
      {isLoading ? (
        renderSkeletonFooter()
      ) : (
        <footer className="border-t border-slate-200 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md py-12 px-6 md:px-12 transition-all duration-500 w-full mt-auto">
          <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="flex items-center gap-3 font-serif text-2xl font-black text-[#e11d48] w-fit">
                <i className="fas fa-drum text-2xl text-[#e11d48]"></i>
                <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fbbf24]">{settingsData.app_logo_name}</span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-white/50 max-w-sm font-light leading-relaxed">
                {settingsData.footer_description}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Layanan Cepat</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm font-light text-slate-600 dark:text-white/60">
                <li><Link href="/booking" className="hover:text-[#e11d48] transition-colors duration-300">Pernikahan Adat</Link></li>
                <li><Link href="/booking" className="hover:text-[#e11d48] transition-colors duration-300">Corporate Event</Link></li>
                <li><Link href="/booking" className="hover:text-[#e11d48] transition-colors duration-300">Festival Kolosal</Link></li>
                <li><Link href="/booking" className="hover:text-[#e11d48] transition-colors duration-300">Workshop Budaya</Link></li>
                <li><Link href="/join" className="hover:text-[#e11d48] transition-colors duration-300">Daftar Anggota</Link></li>
                <li><Link href="/sop" className="hover:text-[#e11d48] transition-colors duration-300">Protokol SOP</Link></li>
              </ul>
            </div>

            {/* Powered By Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Teknologi</h4>
              <div className="text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">
                <span className="block mb-1">Ditenagai oleh:</span>
                <a href="https://github.com/herisvan321/rustbasic" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-bold hover:text-[#e8520e] transition-colors duration-300">
                  <i className="fa-solid fa-bolt text-[#e8520e]"></i>
                  <span>rustbasic</span>
                </a>
                <span className="block mt-2 text-xs">Full-stack Rust Framework & React.js</span>
              </div>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="max-w-[1700px] mx-auto mt-8 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-white/30">
            <p>© {settingsData.footer_copyright}. Hak Cipta Dilindungi.</p>
            <div className="flex gap-4">
              <Link href="/sop" className="hover:text-slate-600 dark:hover:text-white transition-colors duration-300">SOP Adat</Link>
              <span>•</span>
              <Link href="/kontak" className="hover:text-slate-600 dark:hover:text-white transition-colors duration-300">Hubungi Kami</Link>
            </div>
          </div>
        </footer>
      )}

      {/* Toast Notification */}
      <div 
        id="toast" 
        className={`fixed bottom-20 lg:bottom-6 right-6 px-6 py-4 rounded-2xl bg-[#10b981] text-white font-semibold text-sm shadow-2xl flex items-center gap-3 z-[9999] transition-all duration-500 ${
          toastOpen ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <i className="fas fa-check-circle text-lg"></i>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

export default function OtherLayouts({ children }: OtherLayoutProps) {
  const { props } = usePage<any>();
  const { settings } = props;
  const settingsData = settings || {
    app_name: "Sanggar Antabung Indah",
    app_logo_name: "ANTABUNG.ART",
    meta_title: "Sanggar Antabung Indah | Nagari Sisawah Sijunjung",
    meta_description: "Sanggar Antabung Indah - Digitalisasi Kesenian Randai, Tari Pijak Galeh, dan Musik Talempong Ungah khas Kenagarian Sisawah, Sumpur Kudus, Sijunjung.",
    footer_description: "Pusat Pelestarian Kesenian Tradisional Randai & Kaba khas Nagari Wisata Sisawah, Kecamatan Sumpur Kudus, Kabupaten Sijunjung, Sumatera Barat.",
    footer_copyright: "2026 SANGGAR ANTABUNG INDAH"
  };

  return (
    <OtherThemeProvider>
      <Head>
        <title>{settingsData.meta_title}</title>
        <meta name="description" content={settingsData.meta_description} />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <LayoutContent>{children}</LayoutContent>
    </OtherThemeProvider>
  );
}

export const getOtherLayout = (page: React.ReactNode) => <OtherLayouts>{page}</OtherLayouts>;
