import { useState, useEffect, FormEvent } from 'react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const packages = [
  { name: 'Paket Penyambutan Tamu Adat', details: 'Tari Pasambahan khas Sijunjung, 5 penari, iringan talempong pacik.' },
  { name: 'Paket Randai Kolosal Ngalau', details: 'Pertunjukan randai kolosal durasi 40 menit di tebing Ngalau Antabuang, 20 personel lengkap.' },
  { name: 'Paket Pernikahan Adat Sijunjung', details: 'Tari piring pijak galeh, sambah hormat ninik mamak, musik talempong ungah sepanjang acara.' },
  { name: 'Paket Edukasi Budaya (Workshop)', details: 'Kelas kilat belajar langkah silat randai dan pukulan talempong ungah untuk grup wisata.' }
];

export default function Booking() {
  const { showToast } = useOtherTheme();

  // Calculator State
  const [calcScale, setCalcScale] = useState(3);
  const [calcDuration, setCalcDuration] = useState(15);
  const [estimatedPrice, setEstimatedPrice] = useState('IDR 2,000,000');

  // Calculator logic in React
  useEffect(() => {
    const baseRate = 800000;
    const totalEstimate = baseRate + (calcScale * 300000) + (calcDuration * 2000);
    const formattedPrice = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(totalEstimate);
    setEstimatedPrice(formattedPrice);
  }, [calcScale, calcDuration]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast('Permintaan Terkirim! Proposal & estimasi biaya pementasan dikirim ke WhatsApp Anda.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Kemitraan Acara</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Undang Pementasan Seni</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Hadirkan sakralnya tari pasambahan dan kemeriahan atraksi silat Randai Kenagarian Sisawah di panggung acara Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          {/* Calculator */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#d97706] dark:text-[#fbbf24]"><i className="fas fa-calculator mr-2"></i> Simulasi Estimasi Biaya</h3>
            <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">Estimasi anggaran pementasan adat di wilayah Kabupaten Sijunjung.</p>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/40 font-bold uppercase">Pilih Skala Acara</label>
                <select 
                  value={calcScale} 
                  onChange={(e) => setCalcScale(parseInt(e.target.value))} 
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-700 dark:text-white/80 text-sm focus:outline-none focus:border-[#fbbf24]"
                >
                  <option value="3" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Penyambutan Tamu (Skala Kecil)</option>
                  <option value="7" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pernikahan Adat (Skala Menengah)</option>
                  <option value="15" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Randai Kolosal (Skala Besar)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/40 font-bold uppercase">Durasi Pementasan (Menit)</label>
                <select 
                  value={calcDuration} 
                  onChange={(e) => setCalcDuration(parseInt(e.target.value))} 
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-700 dark:text-white/80 text-sm focus:outline-none focus:border-[#fbbf24]"
                >
                  <option value="15" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">15 Menit (Tari Pembuka)</option>
                  <option value="30" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">30 Menit (Randai Singkat)</option>
                  <option value="60" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">60 Menit (Randai Kaba Lengkap)</option>
                </select>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <span className="block text-xs text-slate-500 dark:text-white/50 uppercase font-medium">Estimasi Investasi Mulai Dari</span>
                <span className="text-3xl font-black text-[#d97706] dark:text-[#fbbf24] tracking-wide">{estimatedPrice}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Katalog Panggung Seni</h3>
            <div className="space-y-3">
              {packages.map((pkg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white/95">{idx + 1}. {pkg.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-white/40 font-light leading-tight mt-1">{pkg.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Permintaan Sewa Pementasan</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Nama Instansi / Penyelenggara</label>
              <input type="text" required placeholder="Contoh: Panitia Festival Sijunjung" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Email Kontak Utama</label>
                <input type="email" required placeholder="kontak@instansi.com" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Nomor WhatsApp</label>
                <input type="tel" required placeholder="08XXXXXXXXXX" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Rencana Tanggal Acara</label>
                <input type="date" required className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Tipe Pementasan</label>
                <select className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-600 dark:text-white/70 focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300">
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Penyambutan Tamu / Pasambahan</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pernikahan Kultural Adat</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pertunjukan Randai Kolosal</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Detail Kebutuhan Acara</label>
              <textarea rows={4} placeholder="Sebutkan lokasi spesifik pementasan di Sijunjung..." className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300"></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#fbbf24] to-[#10b981] text-black text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#fbbf24]/20">
              Ajukan Sewa Pementasan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

Booking.layout = getOtherLayout;
