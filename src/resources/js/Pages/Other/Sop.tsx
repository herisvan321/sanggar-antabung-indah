import { getOtherLayout } from '../../Layouts/OtherLayouts';

const sopData = [
  {
    title: 'SOP Latihan Rutin',
    icon: 'fa-user-clock',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    rules: [
      'Setiap anggota wajib hadir 10 menit sebelum jam latihan dimulai.',
      'Wajib mengenakan celana latihan longgar (Galembong) dan kaos sanggar hitam.',
      'Melakukan sambah penghormatan (menangkupkan tangan) kepada Maestro senior sebelum dan sesudah latihan.',
      'Menjaga ketenangan gelanggang dan fokus penuh selama arahan gerak fisik Silek.'
    ]
  },
  {
    title: 'SOP Pementasan & Panggung',
    icon: 'fa-masks-theater',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    rules: [
      'Wajib mengikuti gladi bersih (rehearsal) penuh minimal 2 jam sebelum tirai dibuka.',
      'Dilarang membawa perangkat komunikasi/handphone ke area belakang panggung (backstage) selama pementasan.',
      'Penyusunan kostum adat (tengkuluk, salempang, songket) harus mengikuti aturan kerapian protokol adat Minang.',
      'Menjaga sikap diam mutlak di belakang layar saat pertunjukan sedang berlangsung.'
    ]
  },
  {
    title: 'SOP Keanggotaan & Administrasi',
    icon: 'fa-users-gear',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    rules: [
      'Persentase kehadiran latihan minimal 75% sebagai syarat keikutsertaan pentas bulanan.',
      'Izin ketidakhadiran wajib diajukan melalui WhatsApp Pengurus maksimal 24 jam sebelumnya.',
      'Menjaga nama baik gelanggang di dalam maupun di luar lingkungan sanggar.',
      'Aktif berpartisipasi dalam program kerja bakti sosial pelestarian cagar budaya lokal.'
    ]
  },
  {
    title: 'SOP Pemeliharaan Inventaris',
    icon: 'fa-music',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    rules: [
      'Instrumen musik (Talempong, Rabab, Saluang) wajib dibersihkan dan disimpan kembali ke kotak penyimpanan kering setelah digunakan.',
      'Kostum adat berlapis benang emas (Songket) tidak boleh dicuci dengan mesin, melainkan hanya diangin-anginkan.',
      'Melaporkan segala bentuk kerusakan alat inventaris kepada penanggung jawab logistik maksimal 1x24 jam.',
      'Penggunaan gelanggang untuk keperluan luar sanggar wajib mendapatkan izin tertulis dari Ketua Pengurus.'
    ]
  }
];

export default function Sop() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-[#e11d48]/10 text-[#e11d48] text-sm font-bold uppercase tracking-wider rounded-full">Prosedur Standar</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-black">Standard Operating Procedure</h2>
        <p className="text-slate-600 dark:text-white/60 font-light text-base">Panduan kedisiplinan dan tata tertib dalam melestarikan marwah kesenian tradisional Minangkabau di Gelanggang Sanggar.</p>
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
              <span>Ditetapkan secara musyawarah mufakat demi marwah kesenian adat.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Alert Box */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400 leading-relaxed font-light max-w-4xl mx-auto flex gap-4 items-start">
        <i className="fas fa-triangle-exclamation text-2xl shrink-0 mt-0.5"></i>
        <div>
          <h4 className="font-bold mb-1 text-base">Sanksi Pelanggaran Tertib</h4>
          <p>Pelanggaran terhadap SOP di atas secara berturut-turut tanpa alasan yang sah dapat dikenakan sanksi mulai dari teguran lisan, skorsing keikutsertaan pentas, hingga pencabutan status keanggotaan gelanggang sanggar oleh Majelis Adat Sanggar.</p>
        </div>
      </div>
    </div>
  );
}

Sop.layout = getOtherLayout;
