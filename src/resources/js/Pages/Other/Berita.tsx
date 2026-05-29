import { useEffect, useState } from 'react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';
import { useOtherTheme } from '../../Layouts/OtherThemeContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
  const { isDark } = useOtherTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const skeletonBaseColor = isDark ? '#1e293b' : '#e2e8f0';
  const skeletonHighlightColor = isDark ? '#334155' : '#f1f5f9';

  if (isLoading || !sections) {
    return (
      <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
        <div className="space-y-12 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Skeleton height={20} width="20%" className="mx-auto" />
            <Skeleton height={40} width="60%" className="mx-auto" />
            <Skeleton height={24} width="85%" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(idx => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 space-y-4">
                <Skeleton height={20} width="30%" />
                <Skeleton height={28} width="80%" />
                <Skeleton count={2} />
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  // Parse Sections
  const headerSec = getSection('header');
  const headerTitle = headerSec?.title || "Kabar & Warta Budaya";
  const headerSub = headerSec?.subtitle || "Ikuti berita terhangat seputar pementasan adat, atraksi wisata, serta tulisan kebudayaan Minangkabau di Sijunjung.";

  const articleList = (articles && articles.length > 0) ? articles : defaultArticles;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Media Informasi</span>
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
                  <div className="w-full h-48 overflow-hidden rounded-2xl mb-4 border border-slate-100 dark:border-white/5">
                    <img 
                      src={n.media_url} 
                      alt={n.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase rounded-lg mb-4">{dateStr}</span>
                <h3 
                  onClick={() => setSelectedArticle(n)} 
                  className="font-serif text-xl font-bold mb-3 text-slate-800 dark:text-white hover:text-[#fbbf24] transition-colors duration-300 leading-snug cursor-pointer"
                >
                  {n.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed font-light">{summary}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs sm:text-sm text-slate-400 dark:text-white/40">
                <span><i className="fas fa-clock mr-1"></i> Warta Sanggar</span>
                <button 
                  onClick={() => setSelectedArticle(n)} 
                  className="text-[#e11d48] hover:text-[#be123c] font-bold"
                >
                  Baca &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#141417] border border-slate-200 dark:border-white/5 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg bg-slate-100 dark:bg-white/5 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
            >
              &times;
            </button>
            
            {selectedArticle.media_url && (
              <img 
                src={selectedArticle.media_url} 
                alt={selectedArticle.title} 
                className="w-full h-64 object-cover rounded-2xl border border-slate-200 dark:border-white/5"
              />
            )}
            
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase rounded-lg">
                {selectedArticle.created_at ? selectedArticle.created_at.split(' ')[0] : 'Baru'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                {selectedArticle.title}
              </h3>
            </div>
            
            <div 
              className="text-sm text-slate-605 dark:text-white/80 leading-relaxed font-light space-y-4 quill-content border-t border-slate-100 dark:border-white/5 pt-4"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

Berita.layout = getOtherLayout;
