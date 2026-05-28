import { Link, router } from '@inertiajs/react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Swal from 'sweetalert2';
import { useOtherTheme } from '../Layouts/OtherThemeContext';

DataTable.use(DT);

interface ActivityChartPoint {
  label: string;
  count: number;
}

interface ActivityDonutPoint {
  label: string;
  count: number;
}

interface ActivityLogRow {
  id: number;
  logName: string;
  description: string;
  subject: string;
  causer: string;
  status?: number | null;
  durationMs?: number | null;
  properties?: Record<string, unknown>;
  createdAt: string;
}

interface DashboardProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  totalUsers?: number;
  totalActivityLogs?: number;
  activityPeriod?: string;
  activityChart?: ActivityChartPoint[];
  activityDonut?: ActivityDonutPoint[];
  activityLogs?: ActivityLogRow[];
}

const periodLabels: Record<string, string> = {
  today: 'Hari Ini',
  week: 'Minggu Ini',
  month: 'Bulan Ini',
  year: 'Tahun Ini',
};

const donutColors = ['#e11d48', '#f59e0b', '#10b981', '#38bdf8', '#8b5cf6', '#f97316'];

function formatDateTime(value: string) {
  if (!value) return '-';

  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function statusClass(status?: number | null) {
  if (!status) return 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300';
  if (status >= 500) return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
  if (status >= 400) return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
  return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
}


function escapeHtml(value: unknown) {
  return String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const getBezierPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 3;
    const cp1y = p0.y;
    const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
    const cp2y = p1.y;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return path;
};

export default function Dashboard({
  title,
  userName,
  totalUsers,
  totalActivityLogs,
  activityPeriod = 'today',
  activityChart = [],
  activityDonut = [],
  activityLogs = [],
}: DashboardProps) {
  const { isDark } = useOtherTheme();
  const maxActivity = Math.max(1, ...activityChart.map((point) => point.count));
  const donutTotal = activityDonut.reduce((total, point) => total + point.count, 0);
  const selectedPeriod = periodLabels[activityPeriod] ? activityPeriod : 'today';

  // Line Chart Coordinates & Path Calculations
  const lineMax = Math.max(1, ...activityChart.map((point) => point.count));
  const linePointsCount = activityChart.length;
  const svgWidth = 1000;
  const svgHeight = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const linePoints = activityChart.map((p, i) => {
    const x = paddingLeft + (linePointsCount > 1 ? (i * chartWidth) / (linePointsCount - 1) : chartWidth / 2);
    const y = paddingTop + chartHeight - (p.count / lineMax) * chartHeight;
    return { x, y, label: p.label, count: p.count };
  });

  const curvePath = getBezierPath(linePoints);
  const areaPath = linePoints.length > 0
    ? `${curvePath} L ${linePoints[linePoints.length - 1].x} ${paddingTop + chartHeight} L ${linePoints[0].x} ${paddingTop + chartHeight} Z`
    : '';
  let donutCursor = 0;
  const donutBackground = donutTotal > 0
    ? `conic-gradient(${activityDonut.map((point, index) => {
        const start = donutCursor;
        const end = donutCursor + (point.count / donutTotal) * 100;
        donutCursor = end;
        return `${donutColors[index % donutColors.length]} ${start}% ${end}%`;
      }).join(', ')})`
    : 'conic-gradient(#334155 0% 100%)';

  const changePeriod = (period: string) => {
    router.get('/dashboard', { period }, {
      preserveScroll: true,
      preserveState: false,
    });
  };

  const showActivityDetail = (log: ActivityLogRow) => {
    const properties = JSON.stringify(log.properties || {}, null, 2);

    Swal.fire({
      title: 'Detail Activity Log',
      html: `
        <div class="text-left space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3">
              <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Waktu</div>
              <div class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(formatDateTime(log.createdAt))}</div>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3">
              <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Log Name</div>
              <div class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(log.logName)}</div>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3">
              <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Causer</div>
              <div class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(log.causer)}</div>
            </div>
            <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3">
              <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</div>
              <div class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(log.subject)}</div>
            </div>
          </div>
          <div class="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3">
            <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi</div>
            <div class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">${escapeHtml(log.description)}</div>
          </div>
          <div class="rounded-xl bg-slate-950 text-slate-100 p-4 max-h-64 overflow-auto">
            <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Properties</div>
            <pre class="m-0 text-xs leading-relaxed whitespace-pre-wrap">${escapeHtml(properties)}</pre>
          </div>
        </div>
      `,
      width: 760,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#e11d48',
      background: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.98)',
      color: isDark ? '#fff' : '#1e293b',
      customClass: {
        popup: 'premium-swal-popup',
      },
    });
  };

  const periodSelect = (
    <select
      value={selectedPeriod}
      onChange={(event) => changePeriod(event.target.value)}
      className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-200 outline-none focus:border-[#e11d48]/50 transition-all"
      aria-label="Filter periode activity log"
    >
      <option value="today">Hari Ini</option>
      <option value="week">Minggu Ini</option>
      <option value="month">Bulan Ini</option>
      <option value="year">Tahun Ini</option>
    </select>
  );

  return (
    <>
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div>
          <h1 className="font-serif text-3xl font-black tracking-tight text-slate-850 dark:text-white">
            {title || 'Dashboard'}
          </h1>
          <p className="text-slate-500 dark:text-slate-450 text-sm mt-1 font-light">
            Selamat datang kembali, <span className="font-semibold text-slate-800 dark:text-white">{userName || 'Administrator'}</span>. Kelola dan pantau aktivitas gelanggang dengan mudah.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit self-start md:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          Sistem Aktif
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/85 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#e11d48]/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#e11d48]/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Total Anggota</span>
            <span className="font-serif text-5xl font-black text-[#e11d48]">{totalUsers || 0}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Pengguna terdaftar di database gelanggang.</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/85 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Response Time</span>
            <span className="font-serif text-5xl font-black text-amber-500">24<span className="text-xl font-normal text-slate-400">ms</span></span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Rata-rata kecepatan pemrosesan server.</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/85 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Activity Log</span>
            <span className="font-serif text-5xl font-black text-emerald-500">{totalActivityLogs || 0}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Riwayat aktivitas yang tercatat otomatis dan manual.</p>
        </div>
      </div>

 {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <i className="fas fa-bolt text-[#fbbf24]"></i>
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/users" className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#e11d48]/50 transition-all duration-300 group">
              <i className="fas fa-user-plus text-[#e11d48] mb-2 text-xl"></i>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Tambah User</p>
            </Link>
            <Link href="/dashboard/rbac" className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-all duration-300 group">
              <i className="fas fa-key text-amber-500 mb-2 text-xl"></i>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Kelola Role</p>
            </Link>
          </div>
        </div>
      </div>
      {/* Activity Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm h-fit">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fas fa-chart-column text-[#e11d48]"></i>
              Grafik Activity Log
            </h3>
            {periodSelect}
          </div>
          <div className="">
             <div className=" relative pr-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = paddingTop + chartHeight - ratio * chartHeight;
                const value = Math.round(ratio * lineMax);
                return (
                  <g key={index}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200/50 dark:text-white/5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500 tabular-nums"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* Area Under the Path */}
              {linePoints.length > 0 && (
                <path
                  d={areaPath}
                  fill="url(#chartAreaGradient)"
                />
              )}

              {/* Smooth Bezier Line Path */}
              {linePoints.length > 0 && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke="url(#chartLineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_4px_12px_rgba(225,29,72,0.15)]"
                />
              )}

              {/* Data Points (Circles and Hover effects) */}
              {linePoints.map((p, i) => (
                <g key={i} className="group/point">
                  {/* Hover ring */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="#e11d48"
                    fillOpacity="0.1"
                    className="opacity-0 group-hover/point:opacity-100 transition-all duration-200 cursor-pointer"
                  />
                  {/* Point core */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill={isDark ? '#0f1012' : '#ffffff'}
                    stroke="#e11d48"
                    strokeWidth="3"
                    className="transition-all duration-200 group-hover/point:r-6 cursor-pointer"
                  />
                  {/* Data value label */}
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 tabular-nums transition-all duration-200"
                  >
                    {p.count}
                  </text>
                </g>
              ))}

              {/* X-Axis Labels */}
              {linePoints.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500"
                >
                  {p.label}
                </text>
              ))}
            </svg>
          </div>
          <br/><br/><br/>
            <div className="h-56 flex items-end gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              {activityChart.map((point) => {
                const height = point.count === 0 ? 5 : Math.max(12, Math.round((point.count / maxActivity) * 100));

                return (
                  <div key={point.label} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-200 tabular-nums">{point.count}</span>
                    <div className="w-full h-full flex items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#e11d48] to-amber-400 shadow-sm transition-all duration-300"
                        style={{ height: `${height}%` }}
                        title={`${point.count} aktivitas pada ${point.label}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 truncate w-full text-center">{point.label}</span>
                  </div>
                );
              })}
              {activityChart.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                  Belum ada data activity log.
                </div>
              )}
            </div>
            <br/><br/><br/>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4">
              <div
                className="relative h-64 w-64 rounded-full"
                style={{ background: donutBackground }}
                title={`${donutTotal} aktivitas`}
              >
                <div className="absolute inset-5 rounded-full bg-white dark:bg-[#0f1012] flex flex-col items-center justify-center border border-slate-200 dark:border-white/10">
                  <span className="text-3xl font-black font-serif text-slate-800 dark:text-white">{donutTotal}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                {activityDonut.map((point, index) => (
                  <div key={point.label} className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 min-w-0 text-slate-500 dark:text-slate-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: donutColors[index % donutColors.length] }}
                      />
                      <span className="truncate">{point.label}</span>
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-100">{point.count}</span>
                  </div>
                ))}
                {activityDonut.length === 0 && (
                  <p className="text-center text-xs text-slate-400">Belum ada komposisi log.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <i className="fas fa-table-list text-slate-400"></i>
                Tabel Activity Log
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activityLogs.length} data pada {periodLabels[selectedPeriod].toLowerCase()}.
              </p>
            </div>
            {periodSelect}
          </div>
          <div className="p-6 pt-2 overflow-x-auto">
            <DataTable
              key={`${selectedPeriod}-${activityLogs.length}`}
              className="w-full text-left display"
              options={{ order: [] }}
            >
              <thead>
                <tr className="border-y border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03]">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Waktu</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Log Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject (Model)</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Causer (User)</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Durasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {activityLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => showActivityDetail(log)}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap" data-order={log.createdAt}>{formatDateTime(log.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                        {log.logName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{log.description}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {log.subject && log.subject !== '-' ? (
                        <span className="font-mono bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5 text-[10px]">
                          {log.subject}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {log.causer && log.causer !== '-' ? (
                        <span className="font-mono bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5 text-[10px]">
                          {log.causer}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex min-w-12 justify-center rounded-full px-2 py-1 text-[10px] font-bold ${statusClass(log.status)}`}>
                        {log.status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {typeof log.durationMs === 'number' ? `${log.durationMs}ms` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </div>
      </div>

     
    </>
  );
}
