import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { OtherThemeProvider, useOtherTheme } from '../../Layouts/OtherThemeContext';
import Toast from '../../Components/Toast';
import AlertBanner from '../../Components/AlertBanner';
import FormInput from '../../Components/FormInput';

function LoginContent() {
  const { flash } = usePage<any>().props;
  const { theme, toggleTheme, isDark } = useOtherTheme();
  
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
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
            Silakan masuk untuk mengelola keanggotaan gelanggang latihan, data pementasan, serta reservasi paket pertunjukan tradisional Sanggar Seni Antabung Indah.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sanggar Antabung Indah. Hak Cipta Dilindungi.</p>
        </div>
      </div>

      {/* Right Column: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 min-h-[500px] md:min-h-screen relative">
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
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-white/50 text-sm font-light">Masukkan surel dan sandi Anda untuk mengakses akun gelanggang.</p>
          </div>

          {flash?.success && <AlertBanner type="success" message={flash.success} />}
          {flash?.error && <AlertBanner type="error" message={flash.error} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Email Address"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              error={errors.email}
              placeholder="nama@email.com"
              required
            />

            <div className="space-y-1">
              <FormInput
                label="Password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4.5 h-4.5 rounded-lg border-slate-300 dark:border-white/5 text-[#e11d48] focus:ring-0 cursor-pointer"
                />
                <span>Ingat Saya</span>
              </label>
              <Link href="/forgot-password" className="text-[#e11d48] hover:text-[#fbbf24] font-bold transition-colors duration-300">
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-[#e11d48] text-white text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#e11d48]/25"
            >
              {processing ? 'MEMROSES...' : 'MASUK KE GELANGGANG'}
            </button>
          </form>

          {/* Registration is commented/disabled in routes, let's keep a polite back-link */}
          <div className="text-center">
            <Link href="/" className="text-xs text-slate-400 dark:text-white/30 hover:text-[#e11d48] font-bold transition-colors duration-300">
              &larr; Kembali Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <OtherThemeProvider>
      <LoginContent />
    </OtherThemeProvider>
  );
}

Login.layout = (page: React.ReactNode) => <>{page}</>;

