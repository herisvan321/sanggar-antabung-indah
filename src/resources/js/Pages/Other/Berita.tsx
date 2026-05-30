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

interface ArticleItem {
  id?: number;
  title: string;
  slug: string;
  content: string;
  media_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface BeritaProps {
  sections?: PageSection[];
  articles?: ArticleItem[];
}

const defaultArticles: ArticleItem[] = [
  { id: 1, title: "Sukses Gelar Randai Kolosal di Festival Lansek Manih", slug: "sukses-gelar-randai-kolosal-di-festival-lansek-manih", content: "Sanggar Antabung Indah tampil memukau ratusan penonton di Muaro Sijunjung dengan pementasan teater kolosal Randai Minangkabau...", media_url: null, created_at: "2026-05-15 00:00:00" },
  { id: 2, title: "Digitalisasi Sastra Lisan Kaba Minang", slug: "digitalisasi-sastra-lisan-kaba-minang", content: "Kolaborasi bersama akademisi mendokumentasikan kaba kuno Sisawah secara digital...", media_url: null, created_at: "2026-04-10 00:00:00" }
];

export default function Berita({ sections, articles }: BeritaProps) {
  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Parse Sections
  const headerSec = getSection('header');
  const headerTitle = headerSec?.title || "Kabar & Warta Budaya";
  const headerSub = headerSec?.subtitle || "Ikuti berita terhangat seputar pementasan adat, atraksi wisata, serta tulisan kebudayaan Minangkabau di Sijunjung.";

  const articleList = (articles && articles.length > 0) ? articles : defaultArticles;

  return (
    <>
      <Head>
        <title>Kabar & Warta Budaya - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="Kabar & Warta Budaya - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Media Informasi</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-black whitespace-pre-line text-slate-800 dark:text-white">
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articleList.map((n, idx) => {
            const dateStr = n.created_at ? n.created_at.split(' ')[0] : 'Baru';
            const plainText = stripHtml(n.content);
            const summary = plainText.length > 120 ? plainText.substring(0, 120) + "..." : plainText;

            return (
              <div key={n.id || idx} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:border-[#e11d48]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  {n.media_url && (
                    <Link href={`/berita/${n.slug}`} className="block w-full h-48 overflow-hidden rounded-2xl mb-4 border border-slate-100 dark:border-white/5">
                      <img 
                        src={n.media_url} 
                        alt={n.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  )}
                  <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase rounded-lg mb-4">{dateStr}</span>
                  <h3 className="font-serif text-xl font-bold mb-3 text-slate-800 dark:text-white hover:text-[#fbbf24] transition-colors duration-300 leading-snug">
                    <Link href={`/berita/${n.slug}`}>
                      {n.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">{summary}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs sm:text-sm text-slate-400 dark:text-white/40">
                  <span><i className="fas fa-clock mr-1"></i> Warta Sanggar</span>
                  <Link 
                    href={`/berita/${n.slug}`} 
                    className="text-[#e11d48] hover:text-[#be123c] font-bold"
                  >
                    Baca &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

Berita.layout = getOtherLayout;
