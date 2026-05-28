import { useState, useEffect, FormEvent } from 'react';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const packages = [
  { name: 'Paket Adat Pernikahan', details: 'Teatrikal Sambah Hormat, 4 penari Silek, Musik pengiring langsung.' },
  { name: 'Paket Corporate Gathering', details: 'Pertunjukan durasi 20 menit, 10 penari karismatik, Alat musik modern-etnis.' },
  { name: 'Paket Festival Kolosal', details: 'Full Teatrikal Kaba, 30 personel lengkap, Orkestra Talempong-Rabab.' },
  { name: 'Paket Workshop Eksklusif', details: 'Edukasi sejarah & praktek interaktif dasar gerak untuk tamu asing.' },
  { name: 'Paket Pembukaan Seminar', details: 'Tari Sambah Pembuka sakral 10 menit, 5 personel bertalenta tinggi.' },
  { name: 'Paket Video Konten Khusus', details: 'Penyediaan penari & lisensi koreografi untuk kebutuhan syuting promosi.' },
  { name: 'Paket Gala Dinner Kenegaraan', details: 'Pertunjukan berkelas tinggi dengan protokol kerapian busana sutra adat.' },
  { name: 'Paket Teater Keliling Sekolah', details: 'Pertunjukan edukasi moral berorientasi karakter budi pekerti anak.' },
  { name: 'Paket Musikalisasi Puisi Etnik', details: 'Penggabungan sastra modern dengan alunan saluang ratapan romantis.' },
  { name: 'Paket Kustomisasi Penuh', details: 'Konsultasikan langsung dengan koreografer untuk konsep tidak terbatas.' }
];

export default function Booking() {
  const { showToast } = useOtherTheme();

  // Calculator State
  const [calcScale, setCalcScale] = useState(3);
  const [calcDuration, setCalcDuration] = useState(15);
  const [estimatedPrice, setEstimatedPrice] = useState('IDR 3,500,000');

  // Calculator logic in React
  useEffect(() => {
    const baseRate = 1200000;
    const totalEstimate = baseRate + (calcScale * 400000) + (calcDuration * 2500);
    const formattedPrice = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(totalEstimate);
    setEstimatedPrice(formattedPrice);
  }, [calcScale, calcDuration]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast('Penawaran Berhasil! Proposal & estimasi biaya resmi terkirim ke alamat email Anda.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Kemitraan Acara</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Sewa Jasa Pertunjukan</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Hadirkan nuansa sakral, pementasan interaktif, dan kemegahan orkestra tradisi Minang di acara spesial Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          {/* Calculator */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-4">
             <h3 className="font-serif text-xl font-bold text-[#d97706] dark:text-[#fbbf24]"><i className="fas fa-calculator mr-2"></i> Simulasi Estimasi Biaya</h3>
            <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">Hitung perkiraan anggaran yang sesuai dengan kebutuhan kustomisasi acara Anda.</p>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/40 font-bold uppercase">Pilih Skala Acara</label>
                <select 
                  value={calcScale} 
                  onChange={(e) => setCalcScale(parseInt(e.target.value))} 
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-700 dark:text-white/80 text-sm focus:outline-none focus:border-[#fbbf24]"
                >
                  <option value="3" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Kecil / Privat (Pernikahan, Jamuan)</option>
                  <option value="7" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Menengah (Pertemuan Korporasi, Pameran)</option>
                  <option value="15" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Besar / Kolosal (Festival Nasional, Gala)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/40 font-bold uppercase">Durasi Tampil (Menit)</label>
                <select 
                  value={calcDuration} 
                  onChange={(e) => setCalcDuration(parseInt(e.target.value))} 
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-700 dark:text-white/80 text-sm focus:outline-none focus:border-[#fbbf24]"
                >
                  <option value="15" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">15 Menit (Pertunjukan Pembuka)</option>
                  <option value="30" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">30 Menit (Teatrikal Singkat)</option>
                  <option value="60" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">60 Menit (Kaba Cerita Lengkap)</option>
                </select>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <span className="block text-xs text-slate-500 dark:text-white/50 uppercase font-medium">Estimasi Investasi Mulai Dari</span>
                <span className="text-3xl font-black text-[#d97706] dark:text-[#fbbf24] tracking-wide">{estimatedPrice}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Katalog Layanan Panggung</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {packages.map((pkg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:border-[#fbbf24]/40 transition-all duration-300">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white/95">{idx + 1}. {pkg.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-white/40 font-light leading-tight mt-1">{pkg.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
          <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Kirim Permintaan Booking Resmi</h3>
           <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Nama Instansi / Penyelenggara</label>
              <input type="text" required placeholder="Contoh: Kementerian Kebudayaan" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Email Kontak Utama</label>
                <input type="email" required placeholder="kontak@instansi.com" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Nomor Telepon / WA</label>
                <input type="tel" required placeholder="08XXXXXXXXXX" className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Rencana Tanggal Acara</label>
                <input type="date" required className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Tipe Acara</label>
                <select className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-600 dark:text-white/70 focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300">
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Upacara Adat Tradisional</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Resepsi Pernikahan Kultural</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Corporate Gathering & Anniversary</option>
                  <option className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Festival Seni Internasional / Pemerintah</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase">Detail Kebutuhan Pertunjukan</label>
              <textarea rows={4} placeholder="Sebutkan lokasi pasti, perkiraan kapasitas penonton, dan apakah membutuhkan alat musik lengkap..." className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300"></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#fbbf24] to-[#10b981] text-black text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#fbbf24]/20">
              Ajukan Proposal & Tarif
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

Booking.layout = getOtherLayout;
