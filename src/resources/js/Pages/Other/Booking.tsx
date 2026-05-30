import { useState, useEffect, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';

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

interface BookingPackageItem {
  id?: number;
  name: string;
  description: string;
}

interface BookingCategoryItem {
  id: number;
  name: string;
}

interface BookingProps {
  sections?: PageSection[];
  booking_packages?: BookingPackageItem[];
  booking_categories?: BookingCategoryItem[];
}

const defaultPackages: BookingPackageItem[] = [
  { id: 1, name: "Paket Randai Kolosal", description: "Pertunjukan randai lengkap 1-2 jam dengan 25+ pemusik dan pesilat gelanggang." },
  { id: 2, name: "Paket Musik Talempong", description: "Tabuhan instrumen Talempong Ungah penyambutan tamu resmi." }
];

export default function Booking({ sections, booking_packages, booking_categories }: BookingProps) {
  const { showToast } = useOtherTheme();

  // Form State
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    whatsapp: '',
    date: '',
    show_type: '',
    details: ''
  });

  // Set default show_type when categories load
  useEffect(() => {
    if (booking_categories && booking_categories.length > 0 && !data.show_type) {
      setData('show_type', booking_categories[0].name);
    }
  }, [booking_categories]);

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

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/booking/request', {
      onSuccess: () => {
        showToast('Permintaan Sewa Pementasan Berhasil Terkirim!');
        reset();
      },
      onError: () => {
        showToast('Gagal mengirim pementasan. Harap cek kembali isian Anda.');
      }
    });
  };

  // Parse Sections
  const headerSec = getSection('header');
  const paketSec = getSection('paket');
  const formSec = getSection('form');

  const headerTitle = headerSec?.title || "Undang Pementasan \nAdat & Festival.";
  const headerSub = headerSec?.subtitle || "Hadirkan sakralnya tari pasambahan dan kemeriahan atraksi silat Randai Kenagarian Sisawah di panggung acara Anda.";

  const paketList = (booking_packages && booking_packages.length > 0) ? booking_packages : defaultPackages;

  let formList = [
    { icon: "fa-phone-alt", text: "Hubungi kontak perwakilan pengurus minimal 14 hari sebelum acara." },
    { icon: "fa-file-signature", text: "Lengkapi surat izin kegiatan dari kepolisian/setempat." }
  ];
  if (formSec?.content) {
    try { formList = JSON.parse(formSec.content); } catch (_) {}
  }

  return (
    <>
      <Head>
        <title>Undang Pementasan (Booking) - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="Undang Pementasan (Booking) - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] text-sm font-bold uppercase tracking-wider rounded-full">Kemitraan Acara</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left column: Simulator & Catalog */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Cost Simulator */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#d97706] dark:text-[#fbbf24]"><i className="fas fa-calculator mr-2"></i> Simulasi Estimasi Biaya</h3>
              <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed font-light">Estimasi anggaran pementasan adat di wilayah Kabupaten Sijunjung.</p>
              
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase">Pilih Skala Acara</label>
                  <select 
                    value={calcScale} 
                    onChange={(e) => setCalcScale(parseInt(e.target.value))} 
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-750 dark:text-white/85 text-xs focus:outline-none focus:border-[#fbbf24] transition-colors"
                  >
                    <option value="3" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Penyambutan Tamu (Skala Kecil)</option>
                    <option value="7" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pernikahan Adat (Skala Menengah)</option>
                    <option value="15" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Randai Kolosal (Skala Besar)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase">Durasi Pementasan (Menit)</label>
                  <select 
                    value={calcDuration} 
                    onChange={(e) => setCalcDuration(parseInt(e.target.value))} 
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-750 dark:text-white/85 text-xs focus:outline-none focus:border-[#fbbf24] transition-colors"
                  >
                    <option value="15" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">15 Menit (Tari Pembuka)</option>
                    <option value="30" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">30 Menit (Randai Singkat)</option>
                    <option value="60" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">60 Menit (Randai Kaba Lengkap)</option>
                  </select>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                  <span className="block text-[10px] text-slate-500 dark:text-white/50 uppercase font-medium">Estimasi Investasi Mulai Dari</span>
                  <span className="text-3xl font-black text-[#d97706] dark:text-[#fbbf24] tracking-wide">{estimatedPrice}</span>
                </div>
              </div>
            </div>

            {/* Catalog */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-4">
              <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">{paketSec?.title || "Katalog Panggung Seni"}</h3>
              <div className="space-y-3">
                {paketList.map((pkg, idx) => (
                  <div key={pkg.id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white/95">{idx + 1}. {pkg.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-white/40 font-light leading-tight mt-1">{pkg.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Form and Reservation SOP */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">Permintaan Sewa Pementasan</h3>
            
            {/* SOP Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {formList.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/15 text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center shrink-0">
                    <i className={`fas ${item.icon || 'fa-info-circle'} text-xs`}></i>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-white/40 leading-relaxed font-light">{item.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Nama Instansi / Penyelenggara</label>
                <input 
                  type="text" 
                  required 
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Contoh: Panitia Festival Sijunjung" 
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" 
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Email Kontak Utama</label>
                  <input 
                    type="email" 
                    required 
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="kontak@instansi.com" 
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" 
                  />
                  {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Nomor WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    value={data.whatsapp}
                    onChange={(e) => setData('whatsapp', e.target.value)}
                    placeholder="08XXXXXXXXXX" 
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" 
                  />
                  {errors.whatsapp && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.whatsapp}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Rencana Tanggal Acara</label>
                  <input 
                    type="date" 
                    required 
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300" 
                  />
                  {errors.date && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.date}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Tipe Pementasan</label>
                  <select 
                    value={data.show_type}
                    onChange={(e) => setData('show_type', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-650 dark:text-white/70 focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300"
                  >
                    {booking_categories && booking_categories.length > 0 ? (
                      booking_categories.map((cat) => (
                        <option key={cat.id} value={cat.name} className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Penyambutan Tamu / Pasambahan" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Penyambutan Tamu / Pasambahan</option>
                        <option value="Pernikahan Kultural Adat" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pernikahan Kultural Adat</option>
                        <option value="Pertunjukan Randai Kolosal" className="bg-white dark:bg-[#141417] text-slate-800 dark:text-white">Pertunjukan Randai Kolosal</option>
                      </>
                    )}
                  </select>
                  {errors.show_type && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.show_type}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 dark:text-white/50 font-bold uppercase">Detail Kebutuhan Acara</label>
                <textarea 
                  rows={3} 
                  value={data.details}
                  onChange={(e) => setData('details', e.target.value)}
                  placeholder="Sebutkan lokasi spesifik pementasan di Sijunjung..." 
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#fbbf24] text-sm transition-colors duration-300"
                />
                {errors.details && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.details}</p>}
              </div>

              <button 
                type="submit" 
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-[#fbbf24] to-[#10b981] text-black text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest shadow-lg shadow-[#fbbf24]/20 disabled:opacity-50"
              >
                {processing ? 'Mengirim...' : 'Ajukan Sewa Pementasan'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

Booking.layout = getOtherLayout;
