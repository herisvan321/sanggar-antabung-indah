import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const eventsData = [
  { date: '12 Sep 2026', title: 'Pementasan Randai Kolosal di Pelataran Ngalau Antabuang', place: 'Desa Wisata Sisawah' },
  { date: '28 Okt 2026', title: 'Prosesi Budaya Bakaua Adat Nagari Sisawah', place: 'Gelanggang Balai Adat' },
  { date: '15 Des 2026', title: 'Festival Budaya Lansek Manih Sijunjung', place: 'Muaro Sijunjung' }
];

const services = [
  { title: 'Pendidikan Randai Anak Nagari', desc: 'Pelatihan rutin gerakan silek (silat) dan teater tutur bagi generasi muda Sisawah.', icon: 'fa-users', border: 'hover:border-[#e11d48]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Konservasi Sastra Kaba', desc: 'Perpustakaan naskah digital cerita rakyat Minang, seperti Cindua Mato dan Nan Tongga.', icon: 'fa-book-open', border: 'hover:border-[#fbbf24]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Kelas Talempong Ungah & Canang', desc: 'Eksplorasi permainan alat musik perkusi etnis khas Sijunjung.', icon: 'fa-music', border: 'hover:border-[#10b981]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Ekowisata Seni Ngalau Antabuang', desc: 'Paket pertunjukan seni menyatu dengan petualangan alam menyusuri gua karst.', icon: 'fa-mountain-sun', border: 'hover:border-purple-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' }
];

export default function Home() {
  const { showToast } = useOtherTheme();

  useEffect(() => {
    showToast("Selamat datang di Sanggar Antabung Indah Nagari Sisawah!");
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Hero Content Card */}
        <div className="lg:col-span-7 p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[500px]">
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
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-7.5xl font-black leading-none tracking-tight">
              Seni Randai <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] via-[#fbbf24] to-[#10b981]">Lembah Sisawah.</span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Selamat datang di portal resmi Sanggar Antabung Indah. Menjaga denyut nadi kesenian tradisional Randai, musik Talempong Ungah, dan warisan budaya adat Kenagarian Sisawah, Sumpur Kudus, Sijunjung.
            </p>
          </div>

          {/* Custom CTA Row */}
          <div className="flex flex-wrap items-center gap-4 relative z-10 mt-8 pt-6 border-t border-slate-800/60">
            <Link href="/join" className="px-7 py-4.5 bg-[#e11d48] text-white text-sm font-bold rounded-2xl hover:brightness-110 hover:shadow-xl hover:shadow-[#e11d48]/20 active:scale-95 transition-all duration-300 flex items-center gap-2">
              Gabung Gelanggang <i className="fas fa-chevron-right text-xs"></i>
            </Link>
            <Link href="/booking" className="px-7 py-4.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold rounded-2xl active:scale-95 transition-all duration-300 flex items-center gap-2">
              Booking Pementasan <i className="fas fa-calendar-alt text-xs text-[#fbbf24]"></i>
            </Link>
          </div>
        </div>

        {/* Cinematic Embedded YouTube Video Column */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-6 rounded-[36px] bg-slate-950 text-white border border-slate-900 overflow-hidden shadow-2xl min-h-[500px] group transition-all duration-500 hover:border-[#e11d48]/30">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#e11d48]/20 via-[#fbbf24]/10 to-transparent blur-[100px] pointer-events-none"></div>
          
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5 col-span-3">
                <span className="inline-block px-3 py-1 bg-[#fbbf24] text-black text-xs font-black uppercase rounded-lg shadow-md tracking-wider">PEMENTASAN KABA</span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">Randai Anak Nagari Sisawah</h4>
              </div>
              <span className="text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-full border border-white/5 font-semibold shrink-0">
                <i className="fas fa-play-circle text-red-500 mr-1 animate-pulse"></i> LIVE DOCUMENTARY
              </span>
            </div>

            {/* YouTube Responsive Wrapper */}
            <div className="w-full relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5 my-4">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/R9Z_Gf21y18"
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
                Dokumentasi pertunjukan teater kolosal Randai Minangkabau. Nikmati keselarasan langkah silat gelanggang yang diwariskan turun-temurun di Sijunjung.
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
            <h3 className="font-serif text-2xl font-black text-slate-800 dark:text-white">Gelanggang Sanggar</h3>
            
            <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"><i className="fas fa-check-double text-xs"></i></span>
                <span>Terdaftar di Dinas Pendidikan & Kebudayaan Sijunjung</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center shrink-0"><i className="fas fa-stamp text-xs"></i></span>
                <span>SK Pendirian Nomor: 430/128/Disparpora-SJJ/2012</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0"><i className="fas fa-map-pin text-xs"></i></span>
                <span>Jorong Tarok, Nagari Sisawah, Sijunjung</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-white/5 text-xs sm:text-sm italic text-slate-400 dark:text-white/30 leading-relaxed">
            "Alam Takambang Jadi Guru — Seni Menjaga Adat Salingka Nagari."
          </div>
        </div>

        {/* Card 2: Agenda Terdekat */}
        <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div>
            <span className="inline-block px-3 py-1 bg-[#fbbf24]/20 text-[#d97706] dark:text-[#fbbf24] text-xs font-bold uppercase tracking-wider rounded-full mb-3">Agenda Panggung</span>
            <h3 className="font-serif text-2xl font-bold mb-4 text-slate-800 dark:text-white">Jadwal Terdekat</h3>
            <div id="home-events-container" className="space-y-3">
              {eventsData.map((ev, i) => (
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
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Metrik Kesenian</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-[#e11d48]">120+</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Anak Sasian</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-[#d97706] dark:text-[#fbbf24]">15+</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Mitra Wisata</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-[#10b981]">80+</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Pementasan</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-purple-500">14 Th</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Mengabdi</span>
              </div>
            </div>
          </div>
          <Link href="/profil" className="text-slate-500 dark:text-white/40 hover:text-[#e11d48] text-sm font-semibold flex items-center gap-2 transition-colors duration-300 w-fit">
            Pelajari Struktur Tim <i className="fas fa-users-cog"></i>
          </Link>
        </div>
      </div>

      {/* Grid Extra: Layanan Unggulan */}
      <div className="space-y-6">
        <h3 className="font-serif text-3xl font-bold text-slate-800 dark:text-white">Layanan & Atraksi Budaya</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm dark:shadow-none ${s.border}`}>
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#d97706] dark:text-[#fbbf24] mb-4 text-base">
                <i className={`fas ${s.icon}`}></i>
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
