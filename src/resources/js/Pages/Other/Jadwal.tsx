import { Link, Head } from '@inertiajs/react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

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

interface ScheduleItem {
  id?: number;
  date: string;
  title: string;
  place: string;
  time?: string;
  activity?: string;
  category: string;
}

interface JadwalProps {
  sections?: PageSection[];
  schedules?: ScheduleItem[];
}

const defaultLatihan: ScheduleItem[] = [
  { id: 1, date: "Selasa & Jumat", time: "20:00 - 23:00 WIB", activity: "Latihan Silek & Randai Terbuka", title: "Latihan Silek & Randai Terbuka", place: "Gelanggang Utama Jorong Tarok", category: "latihan" },
  { id: 2, date: "Sabtu", time: "14:00 - 17:00 WIB", activity: "Kelas Talempong Ungah & Canang Anak-Anak", title: "Kelas Talempong Ungah & Canang Anak-Anak", place: "Pendopo Sanggar", category: "latihan" }
];

const defaultPertunjukan: ScheduleItem[] = [
  { id: 3, date: "12 Sep 2026", title: "Pementasan Randai Kolosal di Pelataran Ngalau Antabuang", activity: "Pementasan Randai Kolosal di Pelataran Ngalau Antabuang", place: "Desa Wisata Sisawah", category: "pertunjukan" },
  { id: 4, date: "28 Okt 2026", title: "Prosesi Budaya Bakaua Adat Nagari Sisawah", activity: "Prosesi Budaya Bakaua Adat Nagari Sisawah", place: "Gelanggang Balai Adat", category: "pertunjukan" }
];

export default function Jadwal({ sections, schedules }: JadwalProps) {
  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  // Parse Sections
  const headerSec = getSection('header');
  const latihanSec = getSection('latihan');
  const pertunjukanSec = getSection('pertunjukan');

  const headerTitle = headerSec?.title || "Jadwal Gelanggang \n& Pentas Budaya.";
  const headerSub = headerSec?.subtitle || "Ikuti agenda latihan rutin anak sasian di gelanggang balai adat dan pementasan seni kolosal menyambut wisatawan Desa Wisata Sisawah.";

  const rawLatihan = schedules?.filter(s => s.category === 'latihan') || [];
  const latihanList = rawLatihan.length > 0 ? rawLatihan : defaultLatihan;

  const rawPertunjukan = schedules?.filter(s => s.category === 'pertunjukan') || [];
  const pertunjukanList = rawPertunjukan.length > 0 ? rawPertunjukan : defaultPertunjukan;

  return (
    <>
      <Head>
        <title>Jadwal Kegiatan & Latihan - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="Jadwal Kegiatan & Latihan - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Agenda Seni</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Latihan Card */}
          <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <span className="text-[#10b981] text-base font-bold uppercase tracking-widest block">
              <i className="fas fa-calendar-alt mr-2"></i> {latihanSec?.title || "Jadwal Latihan Mingguan"}
            </span>
            <div className="space-y-4">
              {latihanList.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-800 dark:text-white">{item.date}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded-md">{item.time || "N/A"}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#e11d48]">{item.activity || item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-white/40"><i className="fas fa-map-marker-alt mr-1"></i> {item.place}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pertunjukan Card */}
          <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-6">
            <span className="text-[#fbbf24] text-base font-bold uppercase tracking-widest block">
              <i className="fas fa-bullhorn mr-2"></i> {pertunjukanSec?.title || "Pementasan Besar Terdekat"}
            </span>
            <div className="space-y-4">
              {pertunjukanList.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-800 dark:text-white">{item.title}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#fbbf24]/10 text-[#d97706] dark:text-[#fbbf24] rounded-md">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/40"><i className="fas fa-map-marker-alt mr-1"></i> {item.place}</p>
                </div>
              ))}
            </div>
            <Link href="/booking" className="block text-center w-full py-4 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest">
              Booking Pentas / Hubungi Kami
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

Jadwal.layout = getOtherLayout;
