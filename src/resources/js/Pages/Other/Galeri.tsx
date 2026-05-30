import { useState } from 'react';
import { Head } from '@inertiajs/react';
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

interface GaleriProps {
  sections?: PageSection[];
  galleries?: any[];
}

const defaultImages = [
  { category: 'pementasan', title: 'Randai di Tebing Karst', cap: 'Pertunjukan randai kolosal di pelataran Ngalau Antabuang, Sisawah.', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600' },
  { category: 'alam', title: 'Pesona Ngalau Antabuang', cap: 'Mulut gua karst eksotis yang menjadi inspirasi nama Sanggar Seni kita.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Latihan Kuda-Kuda Silek', cap: 'Anak sasian berlatih gerak silek tradisi di gelanggang balai adat.', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600' },
  { category: 'adat', title: 'Tradisi Bakaua Adat', cap: 'Prosesi syukuran panen padi melimpah oleh masyarakat Kenagarian Sisawah.', img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600' },
  { category: 'pementasan', title: 'Talempong Pacik Sisawah', cap: 'Alunan talempong mengiringi langkah melingkar para penari randai.', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600' },
  { category: 'alam', title: 'Jembatan Gantung Ikonik', cap: 'Jembatan gantung penyeberangan sungai Batang Sinamar yang asri.', img: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Penyelarasan Dendang Kaba', cap: 'Latihan olah vokal tutur (dendang) oleh bundo kanduang sanggar.', img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600' },
  { category: 'adat', title: 'Arak-Arakan Jamba', cap: 'Ibu-ibu menjunjung dulang makanan saat perayaan Bakaua Adat.', img: 'https://images.unsplash.com/photo-1531058020387-3be344559767?auto=format&fit=crop&w=600' }
];

export default function Galeri({ sections, galleries }: GaleriProps) {
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'pementasan' | 'latihan' | 'adat' | 'alam' | string>('all');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxCaption, setLightboxCaption] = useState('');

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  // Parse Header
  const headerSec = getSection('header');
  const headerTitle = headerSec?.title || "Galeri Keindahan Sisawah";
  const headerSub = headerSec?.subtitle || "Dokumentasi momen pementasan seni randai, proses latihan, keelokan alam perbukitan karst, dan adat istiadat Nagari Sisawah.";

  const galleryList = (galleries && galleries.length > 0)
    ? galleries.map(g => ({ category: g.category.toLowerCase(), title: g.title, cap: g.description || '', img: g.media_url }))
    : defaultImages;

  return (
    <>
      <Head>
        <title>Galeri Dokumentasi & Foto Kegiatan - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="Galeri Dokumentasi & Foto Kegiatan - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in text-slate-800 dark:text-white">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-sm font-bold uppercase tracking-wider rounded-full">Koleksi Visual</span>
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

      {/* Gallery Filter Controls */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: 'all', label: 'Semua Dokumentasi' },
          { id: 'pementasan', label: 'Pementasan' },
          { id: 'latihan', label: 'Latihan' },
          { id: 'adat', label: 'Upacara Adat' },
          { id: 'alam', label: 'Bentang Alam' }
        ].map(btn => (
          <button 
            key={btn.id}
            onClick={() => setGalleryFilter(btn.id as any)} 
            className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 ${
              galleryFilter === btn.id 
                ? 'bg-[#e11d48] text-white' 
                : 'bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryList
          .filter(img => galleryFilter === 'all' || img.category === galleryFilter)
          .map((img, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setLightboxImage(img.img);
                setLightboxCaption(`${img.title}: ${img.cap}`);
                setLightboxOpen(true);
              }}
              className="gallery-item overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 group relative h-64 shadow-sm dark:shadow-none cursor-pointer"
            >
              <img 
                src={img.img} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x400/141417/ffffff?text=${img.category}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent p-4 flex flex-col justify-end">
                <span className="inline-block px-2.5 py-1 bg-[#e11d48] text-white text-xs font-bold uppercase rounded-md mb-2 w-fit">{img.category}</span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#fbbf24] transition-colors duration-300">{img.title}</h4>
                <p className="text-xs text-white/75 leading-tight mt-1 max-h-0 overflow-hidden group-hover:max-h-12 transition-all duration-300 font-light">{img.cap}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setLightboxOpen(false)} 
            className="absolute top-6 right-6 text-white hover:text-[#e11d48] text-2xl transition-colors duration-300 w-12 h-12 flex items-center justify-center bg-white/5 rounded-full"
          >
            <i className="fas fa-times"></i>
          </button>
          <img src={lightboxImage || undefined} alt="Detail Dokumentasi" className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl" />
          <p className="text-white/80 font-light mt-6 text-base max-w-xl text-center">{lightboxCaption}</p>
        </div>
      )}
    </div>
    </>
  );
}

Galeri.layout = getOtherLayout;
