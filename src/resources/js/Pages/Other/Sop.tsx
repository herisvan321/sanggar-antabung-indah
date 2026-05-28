import { getOtherLayout } from '../../Layouts/OtherLayouts';

const sopData = [
  {
    title: 'SOP Latihan Gelanggang',
    icon: 'fa-user-clock',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    rules: [
      'Setiap anak sasian wajib hadir 10 menit sebelum jam latihan dimulai.',
      'Wajib menggunakan celana latihan longgar (Galembong) hitam khas randai.',
      'Melakukan sambah penghormatan kepada Guru Gadang Silek sebelum naik gelanggang.',
      'Menjaga ketertiban gelanggang di Balai Adat Kenagarian Sisawah.'
    ]
  },
  {
    title: 'SOP Pementasan Wisata',
    icon: 'fa-masks-theater',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    rules: [
      'Gladi bersih pementasan wajib dilakukan 1 jam sebelum penyambutan wisatawan.',
      'Dilarang merusak keindahan karst atau membuang sampah sembarangan di sekitar Ngalau Antabuang.',
      'Busana adat (sarung, songket Sijunjung) harus dipasang rapi sesuai ketentuan Bundo Kanduang.',
      'Menjaga tutur kata dan adab sopan santun selama berinteraksi dengan wisatawan.'
    ]
  }
];

export default function Sop() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Prosedur Standar</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Standard Operating Procedure</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Panduan kedisiplinan dan sopan santun adat dalam menjaga kelestarian kesenian di Kenagarian Sisawah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {sopData.map((section, idx) => (
          <div 
            key={idx} 
            className="p-8 rounded-[32px] bg-white dark:bg-[#141417]/80 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none flex flex-col justify-between hover:border-[#e11d48]/30 transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg border ${section.color}`}>
                  <i className={`fas ${section.icon}`}></i>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">{section.title}</h3>
              </div>

              <div className="space-y-4">
                {section.rules.map((rule, ruleIdx) => (
                  <div key={ruleIdx} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                      {ruleIdx + 1}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed font-light">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-white/40 flex items-center gap-2">
              <i className="fas fa-shield-halved text-emerald-500"></i>
              <span>Disepakati bersama pemuka adat demi kehormatan nagari.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Sop.layout = getOtherLayout;
