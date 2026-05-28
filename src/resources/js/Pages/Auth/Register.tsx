import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { OtherThemeProvider, useOtherTheme } from '../../Layouts/OtherThemeContext';
import Toast from '../../Components/Toast';
import AlertBanner from '../../Components/AlertBanner';
import FormInput from '../../Components/FormInput';

function RegisterContent() {
  const { flash } = usePage<any>().props;
  const { theme, toggleTheme, isDark } = useOtherTheme();
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-500 font-sans bg-slate-50 dark:bg-[#0a0a0c]">
      <Toast flash={flash} />

      {/* Left Column: Visual Showcase */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-r border-slate-800 text-white relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 min-h-[350px] md:min-h-screen">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#e11d48]/15 blur-[120px] pointer-events-none rounded-full"></div>
        
        {/* Top brand */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 font-serif text-xl sm:text-2xl font-black text-[#e11d48] w-fit">
            <i className="fas fa-drum text-xl sm:text-2xl text-[#e11d48]"></i>
            <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] to-[#fbbf24]">ANTABUNG.ART</span>
          </Link>
        </div>

        {/* Center message */}
        <div className="relative z-10 my-auto py-8">
          <span className="inline-block px-3 py-1 bg-[#e11d48]/20 border border-[#e11d48]/30 rounded-full text-xs font-bold uppercase tracking-widest text-[#fbbf24] mb-4">
            Nagari Sisawah, Sijunjung
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-4">
            Gelanggang Seni <br />
            & Adat Pusako.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-md font-light leading-relaxed">
            Daftarkan diri Anda untuk bergabung ke dalam jaringan keanggotaan seni tradisional Sanggar Antabung Indah Nagari Sisawah. Mari lestarikan kebudayaan Minangkabau bersama.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sanggar Antabung Indah. Hak Cipta Dilindungi.</p>
        </div>
      </div>

      {/* Right Column: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 min-h-[550px] md:min-h-screen relative">
        {/* Floating Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 transition-all duration-300 shadow-sm"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i>
          </button>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">Daftar Akun Baru</h2>
            <p className="text-slate-500 dark:text-white/50 text-sm font-light">Mulai perjalanan pelestarian seni tradisional dengan membuat akun.</p>
          </div>

          {flash?.success && <AlertBanner type="success" message={flash.success} />}
          {flash?.error && <AlertBanner type="error" message={flash.error} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Nama Lengkap"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              error={errors.name}
              placeholder="Nama Lengkap Anda"
              required
              autoFocus
            />

            <FormInput
              label="Email Address"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              error={errors.email}
              placeholder="nama@email.com"
              required
            />

            <FormInput
              label="Password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              error={errors.password}
              placeholder="Min. 8 karakter"
              required
            />

            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-[#e11d48] text-white text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#e11d48]/25"
            >
              {processing ? 'MENDAFTAR...' : 'BUAT AKUN SEKARANG'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-white/40">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="text-[#e11d48] hover:text-[#fbbf24] font-bold transition-colors duration-300">
                Masuk Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <OtherThemeProvider>
      <RegisterContent />
    </OtherThemeProvider>
  );
}

Register.layout = (page: React.ReactNode) => <>{page}</>;
