import { Link, Head } from '@inertiajs/react';
import { getOtherLayout } from '../../Layouts/OtherLayouts';

interface ArticleItem {
  id?: number;
  title: string;
  slug: string;
  content: string;
  media_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface BeritaDetailProps {
  article: ArticleItem;
}

export default function BeritaDetail({ article }: BeritaDetailProps) {
  const dateStr = article.created_at ? article.created_at.split(' ')[0] : 'Baru';

  // Generate safe plain text excerpt for SEO
  const getExcerpt = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > 160 ? text.substring(0, 155) + "..." : text;
  };

  const seoDescription = getExcerpt(article.content);

  return (
    <>
      <Head>
        <title>{`${article.title} - Sanggar Antabung Indah`}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={`${article.title} - Sanggar Antabung Indah`} />
        <meta property="og:description" content={seoDescription} />
        {article.media_url && <meta property="og:image" content={article.media_url} />}
      </Head>

      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pt-4">
        {/* Back Button */}
        <div>
          <Link 
            href="/berita" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#e11d48]/55 text-slate-600 dark:text-white/80 hover:text-[#e11d48] text-sm font-semibold transition-all duration-300 shadow-sm"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Kembali ke Berita</span>
          </Link>
        </div>

        {/* Article Layout */}
        <article className="bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-10 space-y-6">
          
          {/* Cover Image */}
          {article.media_url && (
            <div className="w-full h-[350px] overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5">
              <img 
                src={article.media_url} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Metadata & Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 dark:text-white/40">
              <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-xs font-bold uppercase rounded-lg">
                {dateStr}
              </span>
              <span>•</span>
              <span><i className="fas fa-clock mr-1"></i> Warta Sanggar</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Formatted Content */}
          <div 
            className="text-slate-600 dark:text-white/80 leading-relaxed font-light text-base sm:text-lg border-t border-slate-100 dark:border-white/5 pt-8 space-y-6 quill-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

        </article>
      </div>
    </>
  );
}

BeritaDetail.layout = getOtherLayout;
