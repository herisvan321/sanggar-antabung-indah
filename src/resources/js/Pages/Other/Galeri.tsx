import { useState } from 'react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

const images = [
  { category: 'pementasan', title: 'Pertunjukan Nan Tongga', cap: 'Pementasan kolosal dihadiri oleh 1.000 penonton di Bukittinggi.', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Latihan Rutin Silek Kurator', cap: 'Anggota senior melatih pola kuda-kuda kokoh.', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600' },
  { category: 'sosial', title: 'Randai Masuk Sekolah', cap: 'Edukasi kesenian ke sekolah-sekolah dasar pelosok.', img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600' },
  { category: 'pementasan', title: 'Gala Internasional Jakarta', cap: 'Penampilan istimewa di Festival Budaya Indonesia Baru.', img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Harmoni Bunyi Gamelan', cap: 'Latihan instrumen musik perkusi talempong.', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600' },
  { category: 'sosial', title: 'Penggalangan Dana Bencana', cap: 'Kolaborasi pentas amal untuk korban banjir lahar dingin.', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600' },
  { category: 'pementasan', title: 'Teater Kaba Anggun Nan Tongga', cap: 'Adegan penuh ketegangan perebutan gelar kesaktian.', img: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Teknik Suara Dendang', cap: 'Penyelarasan vokal merdu mengikuti tempo gamelan.', img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600' },
  { category: 'sosial', title: 'Pembersihan Cagar Budaya', cap: 'Aksi sosial melestarikan kebersihan rumah gadang tua.', img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600' },
  { category: 'pementasan', title: 'Pentas Festival Danau Singkarak', cap: 'Pertunjukan spektakuler di pinggiran danau nan asri.', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Kelas Terbuka Anak-Anak', cap: 'Menanamkan benih cinta budaya sejak dini.', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600' },
  { category: 'sosial', title: 'Pemberdayaan Tenun Tradisional', cap: 'Kerja sama pelestarian motif songket kostum Randai.', img: 'https://images.unsplash.com/photo-1513829096999-4978602297a7?auto=format&fit=crop&w=600' },
  { category: 'pementasan', title: 'Randai di Istana Kepresidenan', cap: 'Penghormatan tertinggi pementasan di hadapan tamu negara.', img: 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=600' },
  { category: 'latihan', title: 'Fokus Gerak Refleks', cap: 'Latihan kecepatan menghindar dari pukulan lawan.', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600' },
  { category: 'sosial', title: 'Peringatan Hari Lahir Seni', cap: 'Syukuran tumpeng budaya bersama pemuka adat.', img: 'https://images.unsplash.com/photo-1531058020387-3be344559767?auto=format&fit=crop&w=600' }
];

export default function Galeri() {
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'pementasan' | 'latihan' | 'sosial'>('all');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxCaption, setLightboxCaption] = useState('');

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-sm font-bold uppercase tracking-wider rounded-full">Koleksi Visual</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Dokumentasi Estetis</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Rekam jejak ekspresi emosional, pementasan kolosal, dan proses transformasi latihan para talenta berdarah seni tinggi.</p>
      </div>

      {/* Gallery Filter Controls */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: 'all', label: 'Semua Dokumentasi' },
          { id: 'pementasan', label: 'Pementasan' },
          { id: 'latihan', label: 'Latihan' },
          { id: 'sosial', label: 'Kegiatan Sosial' }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images
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
  );
}

Galeri.layout = getOtherLayout;
