import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { OtherThemeProvider, useOtherTheme } from './OtherThemeContext';
import Swal from 'sweetalert2';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  userName?: string;
  userEmail?: string;
}

function AdminLayoutContent({ children, title, userName, userEmail }: AdminLayoutProps) {
  const { props, url } = usePage<any>();
  const { flash } = props;
  const { theme, toggleTheme, isDark } = useOtherTheme();
  const [isRbacOpen, setIsRbacOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const rbacRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Use props from Inertia if not passed directly (useful for persistent layout)
  const displayTitle = title || props.title;
  const displayUserName = userName || props.userName;
  const displayUserEmail = userEmail || props.userEmail;
  const userPermissions = props.permissions || [];
  
  // Use local state to handle flash messages so we can clear them after showing
  const [activeFlash, setActiveFlash] = useState<any>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rbacRef.current && !rbacRef.current.contains(event.target as Node)) {
        setIsRbacOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync local flash when props.flash changes
  useEffect(() => {
    if (flash?.success || flash?.error) {
      setActiveFlash(flash);
    }
  }, [flash]);

  useEffect(() => {
    if (!activeFlash) return;

    if (activeFlash.success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: activeFlash.success,
        timer: 3000,
        showConfirmButton: false,
        background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: isDark ? '#fff' : '#1e293b',
        backdrop: `rgba(0,0,0,0.4) backdrop-filter: blur(4px)`,
        customClass: {
          popup: 'premium-swal-popup',
        },
        didClose: () => setActiveFlash(null)
      });
    } else if (activeFlash.error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: activeFlash.error,
        background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: isDark ? '#fff' : '#1e293b',
        backdrop: `rgba(0,0,0,0.4) backdrop-filter: blur(4px)`,
        customClass: {
          popup: 'premium-swal-popup',
        },
        didClose: () => setActiveFlash(null)
      });
    }
  }, [activeFlash, isDark]);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan keluar dari sesi ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal',
      background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      color: isDark ? '#fff' : '#1e293b',
      backdrop: `rgba(0,0,0,0.4) backdrop-filter: blur(4px)`,
      customClass: {
        popup: 'premium-swal-popup',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.post('/logout');
      }
    });
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: 'fa-chart-line', permission: 'view_dashboard' },
  ];

  const rbacLinks = [
    { name: 'Kelola Pengguna', href: '/dashboard/users', icon: 'fa-users', permission: 'manage_users' },
    { name: 'Role & Permission', href: '/dashboard/rbac', icon: 'fa-shield-halved', permission: 'manage_roles' },
    { name: 'Matriks Hak Akses', href: '/dashboard/matrix', icon: 'fa-table-cells', permission: 'manage_permissions' },
  ];

  // Filter links based on permissions
  const filteredNavLinks = navLinks.filter(link => 
    !link.permission || userPermissions.includes(link.permission)
  );

  const filteredRbacLinks = rbacLinks.filter(link => 
    !link.permission || userPermissions.includes(link.permission)
  );

  const currentPath = url.split('?')[0];
  const isRbacActive = filteredRbacLinks.some(link => currentPath === link.href);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 flex flex-col">

      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0a0a0c]/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-serif text-lg font-black text-[#e11d48]">
              <i className="fas fa-drum text-lg"></i>
              <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fbbf24]">ANTABUNG.DASH</span>
            </Link>
            <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-500 dark:text-slate-400">
              Admin Area
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                    currentPath === link.href
                      ? 'bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <i className={`fas ${link.icon} text-sm`}></i>
                  {link.name}
                </Link>
              ))}

              {/* RBAC Dropdown Menu */}
              {filteredRbacLinks.length > 0 && (
                <div className="relative" ref={rbacRef}>
                  <button
                    onClick={() => setIsRbacOpen(!isRbacOpen)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 flex items-center gap-2 ${
                      isRbacActive
                        ? 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <i className="fas fa-user-shield text-sm"></i>
                    Manajemen Akses
                    <i className={`fas fa-chevron-down text-[10px] transition-transform duration-300 ${isRbacOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isRbacOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#111114] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-2 flex flex-col gap-1">
                        {filteredRbacLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsRbacOpen(false)}
                            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all ${
                              currentPath === link.href
                                ? 'bg-[#fbbf24] text-white shadow-lg shadow-[#fbbf24]/20'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <i className={`fas ${link.icon} w-4 text-center`}></i>
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/80 transition-all duration-300 border border-slate-200 dark:border-white/5"
                title={isDark ? "Mode Terang" : "Mode Gelap"}
              >
                <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i>
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-left"
                >
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                      {displayUserName || 'Administrator'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-tighter">
                      {displayUserEmail || 'admin@antabung.com'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {displayUserName ? displayUserName.charAt(0).toUpperCase() : 'A'}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111114] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-2 flex flex-col gap-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all ${
                          currentPath === '/dashboard/profile'
                            ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <i className="fas fa-user-gear w-4 text-center"></i>
                        Profil Saya
                      </Link>
                      <button
                        onClick={(e) => {
                          setIsUserMenuOpen(false);
                          handleLogout(e);
                        }}
                        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 w-full text-left"
                      >
                        <i className="fas fa-right-from-bracket w-4 text-center"></i>
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation (Bottom) */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-1 shadow-2xl">
        {filteredNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-3 rounded-xl transition-colors duration-200 ${
              currentPath === link.href
                ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
            title={link.name}
          >
            <i className={`fas ${link.icon} text-lg`}></i>
          </Link>
        ))}
        {/* Mobile Profile Link */}
        <Link
          href="/dashboard/profile"
          className={`p-3 rounded-xl transition-colors duration-200 ${
            currentPath === '/dashboard/profile'
              ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
          title="Profil Saya"
        >
          <i className="fas fa-user-gear text-lg"></i>
        </Link>
        {/* Mobile Logout Button */}
        <button
          onClick={handleLogout}
          className="p-3 rounded-xl text-rose-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Keluar"
        >
          <i className="fas fa-right-from-bracket text-lg"></i>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="w-full mx-auto px-6 py-10 flex-grow flex flex-col gap-8 pb-24 lg:pb-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mx-auto px-6 py-8 w-full border-t border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          &copy; 2026 SANGGAR ANTABUNG INDAH &bull; ADMIN PANEL v1.0
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#e11d48] dark:text-slate-600 dark:hover:text-[#e11d48] transition-colors uppercase tracking-widest">Dokumentasi</a>
          <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#e11d48] dark:text-slate-600 dark:hover:text-[#e11d48] transition-colors uppercase tracking-widest">Bantuan</a>
        </div>
      </footer>
    </div>
  );
}

export default function AdminLayout({ children, title, userName, userEmail }: AdminLayoutProps) {
  return (
    <OtherThemeProvider>
      <AdminLayoutContent title={title} userName={userName} userEmail={userEmail}>{children}</AdminLayoutContent>
    </OtherThemeProvider>
  );
}
