import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const eventsData = [
  { date: '12 Sep 2026', title: 'Pagelaran Kolosal Nan Tongga', place: 'Bukittinggi' },
  { date: '28 Okt 2026', title: 'Simposium Randai Sedunia', place: 'Padang' },
  { date: '15 Des 2026', title: 'Pementasan Teater di Jakarta', place: 'Taman Ismail Marzuki' }
];

const services = [
  { title: 'Inkubasi Bakat Digital', desc: 'Kelas pelatihan daring dengan kurikulum berbasis multimedia modern.', icon: 'fa-laptop-code', border: 'hover:border-[#e11d48]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Arsip Sastra Kaba', desc: 'Perpustakaan digital berisi puluhan transkrip cerita rakyat asli Minang.', icon: 'fa-folder-open', border: 'hover:border-[#fbbf24]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Dramaturgi Lanjutan', desc: 'Pendampingan khusus penulisan naskah drama tradisional.', icon: 'fa-feather-alt', border: 'hover:border-[#10b981]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Sewa Kostum Tradisi', desc: 'Penyediaan busana adat & perlengkapan penari Randai otentik.', icon: 'fa-vest', border: 'hover:border-purple-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Laboratorium Musik', desc: 'Eksperimen gabungan alat musik etnis dengan aransemen orkestra.', icon: 'fa-music', border: 'hover:border-blue-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Sertifikasi Keahlian', desc: 'Sertifikat resmi kelayakan penari & pelatih dari dinas kebudayaan.', icon: 'fa-award', border: 'hover:border-pink-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Panggung Terbuka', desc: 'Fasilitas apresiasi seni bulanan gratis untuk seniman pemula.', icon: 'fa-masks-theater', border: 'hover:border-yellow-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Kemitraan Komunitas', desc: 'Jejaring kolaborasi dengan ratusan universitas lokal & global.', icon: 'fa-handshake', border: 'hover:border-teal-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Workshop Koreografi', desc: 'Pelatihan pengembangan gerak Silek menjadi tarian teatrikal.', icon: 'fa-shoe-prints', border: 'hover:border-indigo-500/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' },
  { title: 'Virtual Reality Randai', desc: 'Eksplorasi pengalaman menonton pertunjukan 3D interaktif.', icon: 'fa-vr-cardboard', border: 'hover:border-[#e11d48]/40 border-slate-200 dark:border-white/5 bg-white dark:bg-[#141417]/80' }
];

export default function Home() {
  const { showToast } = useOtherTheme();

  // Video State
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoTimeCur, setVideoTimeCur] = useState('0:00');
  
  const videoIntervalRef = useRef<number | null>(null);
  const canvasAnimationIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Synth Tone Generator (Traditional Talempong Ring)
  const playPerformanceTone = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 High pitch gong
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 Harmony ring
      
      gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.3);
      osc2.stop(ctx.currentTime + 1.3);
    } catch(e) {
      console.error("Audio Context API failed: ", e);
    }
  };

  // Video progress & Canvas wave animation setup
  useEffect(() => {
    if (videoPlaying) {
      showToast("Memutar audio instrumen tradisional Talempong!");
      playPerformanceTone();

      // Video Progress Bar Simulation
      let currentProgress = videoProgress;
      videoIntervalRef.current = window.setInterval(() => {
        currentProgress += 0.5;
        if (currentProgress >= 100) {
          currentProgress = 0;
          setVideoPlaying(false);
        }
        setVideoProgress(currentProgress);

        const totalSeconds = 525; // 8 mins 45 secs total
        const curSeconds = Math.floor((currentProgress / 100) * totalSeconds);
        const minutes = Math.floor(curSeconds / 60);
        const seconds = curSeconds % 60;
        setVideoTimeCur(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }, 500);

      // Start Canvas Draw loop
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
          
          let frame = 0;
          const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = Math.min(canvas.width, canvas.height) * 0.35;
            
            frame++;
            const waveIntensity = Math.abs(Math.sin(frame * 0.05)) * 25 + 10;
            
            ctx.strokeStyle = `rgba(225, 29, 72, ${0.1 + (waveIntensity / 100)})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius + waveIntensity, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = `rgba(251, 191, 36, 0.2)`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius - 20 + (waveIntensity * 0.5), 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.5;
            const points = 10;
            ctx.beginPath();
            for (let i = 0; i < points; i++) {
              const angle = (i * Math.PI * 2 / points) + (frame * 0.005);
              const x = centerX + Math.cos(angle) * (maxRadius + (i % 2 === 0 ? waveIntensity * 0.4 : -waveIntensity * 0.2));
              const y = centerY + Math.sin(angle) * (maxRadius + (i % 2 === 0 ? waveIntensity * 0.4 : -waveIntensity * 0.2));
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = '#e11d48';
            ctx.beginPath();
            ctx.arc(centerX + Math.sin(frame * 0.08) * 15, centerY + Math.cos(frame * 0.05) * 10, 8, 0, Math.PI * 2);
            ctx.fill();

            canvasAnimationIdRef.current = requestAnimationFrame(draw);
          };
          draw();
        }
      }
    } else {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
      if (canvasAnimationIdRef.current) {
        cancelAnimationFrame(canvasAnimationIdRef.current);
      }
    }

    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
      if (canvasAnimationIdRef.current) cancelAnimationFrame(canvasAnimationIdRef.current);
    };
  }, [videoPlaying]);

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
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e11d48]/20 border border-[#e11d48]/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-ping"></span>
              <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">Platform Seni Masa Depan</span>
            </div> */}
            
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-7.5xl font-black leading-none tracking-tight">
              Mahakarya Kaba <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] via-[#fbbf24] to-[#10b981]">Di Era Virtual.</span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Meleburkan batasan waktu. Kami menghadirkan teater tradisional teater tutur (Kaba) Minangkabau dalam ekosistem digital interaktif tanpa merusak nilai kesakralan adat.
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

        {/* Cinematic Embedded Stage Video Column */}
        <div className="lg:col-span-5 relative flex flex-col justify-between p-6 rounded-[36px] bg-slate-950 text-white border border-slate-900 overflow-hidden shadow-2xl min-h-[500px] group transition-all duration-500 hover:border-[#e11d48]/30">
          
          {/* Dynamic Backlight Glow Effect */}
          <div 
            id="video-ambilight" 
            className={`absolute inset-0 transition-all duration-1000 -z-10 pointer-events-none ${
              videoPlaying 
                ? 'bg-gradient-to-tr from-[#e11d48]/40 via-[#fbbf24]/20 to-transparent blur-[100px] animate-pulse-slow' 
                : 'bg-[#e11d48]/0 blur-[80px]'
            }`}
          ></div>
          
          <div className="absolute inset-0 bg-cover bg-center filter opacity-25 group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          {/* Audio Reactive Waveform Overlay Canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-0">
            <canvas ref={canvasRef} id="mock-video-canvas" className="w-full h-full max-h-[350px]"></canvas>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 bg-[#fbbf24] text-black text-xs sm:text-sm font-black uppercase rounded-lg shadow-md tracking-wider">TEATER DIGITAL</span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">Kaba Cindua Mato (Live Stage)</h4>
            </div>
            <span className="text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-full border border-white/5 font-semibold">
              <i className="fas fa-video text-red-500 mr-1 animate-pulse"></i> HD 1080p
            </span>
          </div>

          {/* Video Center Playback Control Anchor */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 my-12">
            <button 
              id="video-control-btn" 
              onClick={() => setVideoPlaying(!videoPlaying)} 
              className="w-20 h-20 bg-gradient-to-r from-[#e11d48] to-red-500 text-white rounded-full flex items-center justify-center text-2xl hover:scale-110 shadow-2xl shadow-[#e11d48]/40 hover:shadow-red-500/60 active:scale-90 transition-all duration-300"
            >
              <i id="video-btn-icon" className={`fas ${videoPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
            </button>
            <span id="video-status-txt" className="text-xs sm:text-sm text-white/80 font-medium bg-black/50 px-5 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-sm text-center">
              {videoPlaying ? 'Sekarang memutar pagelaran & membunyikan talempong...' : 'Mulai Pemutaran Teater & Musik Talempong'}
            </span>
          </div>

          {/* Video Progress Deck */}
          <div className="relative z-10 space-y-2.5 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div id="video-progress-bar" className="h-full bg-gradient-to-r from-[#e11d48] to-[#fbbf24] transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold font-mono">
              <span id="video-time-cur">{videoTimeCur}</span>
              <div className="flex items-center gap-1.5 text-[#fbbf24]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Audio Synth Aktif</span>
              </div>
              <span id="video-time-tot">8:45</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY DASHBOARD ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Card 1: Identitas Resmi Kultural */}
        <div className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase tracking-wider rounded-full">Legalitas Budaya</span>
            <h3 className="font-serif text-2xl font-black text-slate-800 dark:text-white">Gelanggang Sanggar Resmi</h3>
            
            <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"><i className="fas fa-check-double text-xs"></i></span>
                <span>Akreditasi Seni Budaya Tingkat Nasional (A)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center shrink-0"><i className="fas fa-stamp text-xs"></i></span>
                <span>No SK. Kemenkumham: AHU-009.432.BKT-1985</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0"><i className="fas fa-map-pin text-xs"></i></span>
                <span>Cagar Budaya Tarok Dipo, Bukittinggi</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-white/5 text-xs sm:text-sm italic text-slate-400 dark:text-white/30 leading-relaxed">
            "Seni adalah cerminan adat luhur Minangkabau."
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
            <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/20 text-[#10b981] text-xs font-bold uppercase tracking-wider rounded-full">Seni Berkelanjutan</span>
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Metrik Kebudayaan</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-[#e11d48]">1.4k+</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Anggota</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-[#d97706] dark:text-[#fbbf24]">45+</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Mitra</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-[#10b981]">280+</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Konser</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-none">
                <span className="block text-3xl font-black text-purple-500">37 Th</span>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Tradisi</span>
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
        <h3 className="font-serif text-3xl font-bold text-slate-800 dark:text-white">Layanan Unggulan Digital</h3>
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
