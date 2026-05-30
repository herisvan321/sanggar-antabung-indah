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

interface SopRuleItem {
  id?: number;
  icon: string;
  text: string;
  category: string;
}

interface SopProps {
  sections?: PageSection[];
  sop_rules?: SopRuleItem[];
}

const defaultAturan: SopRuleItem[] = [
  { id: 1, icon: "fa-user-clock", text: "Hadir di gelanggang 15 menit sebelum latihan dimulai", category: "aturan" },
  { id: 2, icon: "fa-pray", text: "Menjaga adab saling menghormati guru gadang dan teman sejawat", category: "aturan" },
  { id: 3, icon: "fa-tshirt", text: "Wajib mengenakan pakaian latihan hitam longgar (celana galembong) resmi", category: "aturan" }
];

export default function Sop({ sections, sop_rules }: SopProps) {
  const getSection = (key: string) => {
    return sections?.find(s => s.section_key === key);
  };

  const headerSec = getSection('header');
  const aturanSec = getSection('aturan');

  const headerTitle = headerSec?.title || "Aturan Gelanggang \n& SOP Sanggar.";
  const headerSub = headerSec?.subtitle || "Panduan etika perilaku (adab) bersilat dan berlatih bagi seluruh murid dan pengurus Sanggar.";

  const aturanTitle = aturanSec?.title || "Aturan Etika Gelanggang";
  
  const rawRules = sop_rules?.filter(r => r.category === 'aturan') || [];
  const aturanItems = rawRules.length > 0 ? rawRules : defaultAturan;

  return (
    <>
      <Head>
        <title>SOP & Aturan Adat - Sanggar Antabung Indah</title>
        <meta name="description" content={headerSub} />
        <meta property="og:title" content="SOP & Aturan Adat - Sanggar Antabung Indah" />
        <meta property="og:description" content={headerSub} />
      </Head>

      <div className="space-y-12 animate-fade-in text-slate-800 dark:text-white">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Prosedur Standar</span>
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

        <div className="max-w-3xl mx-auto">
          <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none space-y-8 hover:border-[#e11d48]/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg border text-rose-500 bg-rose-500/10 border-rose-500/20">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">{aturanTitle}</h3>
            </div>

            <div className="space-y-6">
              {aturanItems.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-[#e11d48]/20 transition-all duration-300">
                  <span className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 text-sm font-bold">
                    <i className={`fas ${item.icon || 'fa-check'}`}></i>
                  </span>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-white/80 leading-relaxed font-light mt-0.5">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 text-xs sm:text-sm text-slate-400 dark:text-white/40 flex items-center gap-2">
              <i className="fas fa-circle-info text-[#fbbf24]"></i>
              <span>Disepakati bersama pemuka adat demi menjaga kehormatan gelanggang Kenagarian Sisawah.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Sop.layout = getOtherLayout;
