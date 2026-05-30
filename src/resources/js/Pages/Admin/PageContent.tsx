import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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

interface PageContentProps {
  sections: PageSection[];
  articles: any[];
  schedules: any[];
  programs: any[];
  metrics: any[];
  structures: any[];
  philosophical_values: any[];
  galleries: any[];
  join_steps: any[];
  booking_packages: any[];
  sop_rules: any[];
  contact_infos: any[];
  userName?: string;
  userEmail?: string;
  permissions: string[];
  errors?: Record<string, string>;
  settings?: any;
}

const PAGE_SECTIONS_MAP: Record<string, { label: string; sections: { key: string; label: string }[] }> = {
  home: {
    label: 'Home.tsx (Beranda)',
    sections: [
      { key: 'hero', label: 'Hero (Banner Utama)' },
      { key: 'video', label: 'Video (YouTube Dokumenter)' },
      { key: 'legalitas', label: 'Legalitas (Gelanggang Sanggar)' }
    ]
  },
  profil: {
    label: 'Profil.tsx (Profil Sanggar)',
    sections: [
      { key: 'header', label: 'Judul Halaman' },
      { key: 'sejarah', label: 'Sejarah Pendirian' }
    ]
  },
  filosofi: {
    label: 'Filosofi.tsx (Filosofi & Makna)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  },
  galeri: {
    label: 'Galeri.tsx (Galeri Foto)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  },
  jadwal: {
    label: 'Jadwal.tsx (Jadwal Kegiatan)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  },
  program: {
    label: 'Program.tsx (Program Kerja)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  },
  join: {
    label: 'Join.tsx (Gabung Anggota)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  },
  berita: {
    label: 'Berita.tsx (Berita / Warta)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  },
  booking: {
    label: 'Booking.tsx (Reservasi Pentas)',
    sections: [
      { key: 'header', label: 'Judul Halaman' },
      { key: 'form', label: 'Petunjuk Reservasi' }
    ]
  },
  kontak: {
    label: 'Kontak.tsx (Kontak & Peta)',
    sections: [
      { key: 'header', label: 'Judul Halaman' },
      { key: 'peta', label: 'Lokasi Map Embed' }
    ]
  },
  sop: {
    label: 'Sop.tsx (Standar Operasional)',
    sections: [
      { key: 'header', label: 'Judul Halaman' }
    ]
  }
};

const PAGES_METADATA = [
  { key: 'home', label: 'Beranda / Home', path: '/', icon: 'fa-home' },
  { key: 'profil', label: 'Profil Sanggar', path: '/profil', icon: 'fa-users' },
  { key: 'filosofi', label: 'Filosofi & Makna', path: '/filosofi', icon: 'fa-lightbulb' },
  { key: 'galeri', label: 'Galeri Foto', path: '/galeri', icon: 'fa-images' },
  { key: 'jadwal', label: 'Jadwal Kegiatan', path: '/jadwal', icon: 'fa-calendar-alt' },
  { key: 'program', label: 'Program & Layanan', path: '/program', icon: 'fa-rocket' },
  { key: 'join', label: 'Gabung Anggota', path: '/join', icon: 'fa-user-plus' },
  { key: 'berita', label: 'Berita / Warta', path: '/berita', icon: 'fa-newspaper' },
  { key: 'booking', label: 'Booking & Reservasi', path: '/booking', icon: 'fa-file-signature' },
  { key: 'sop', label: 'Standar Operasional (SOP)', path: '/sop', icon: 'fa-clipboard-list' },
  { key: 'kontak', label: 'Hubungi Kami', path: '/kontak', icon: 'fa-address-book' }
];

export default function PageContent({
  sections,
  articles,
  schedules,
  programs,
  metrics,
  structures,
  philosophical_values,
  galleries,
  join_steps,
  booking_packages,
  sop_rules,
  contact_infos,
  permissions = [],
  settings
}: PageContentProps) {
  
  const collectionPerms = [
    'halaman_berita', 'halaman_jadwal', 'halaman_program', 'halaman_home',
    'halaman_profil', 'halaman_filosofi', 'halaman_galeri',
    'halaman_join', 'halaman_booking', 'halaman_sop', 'halaman_kontak'
  ];
  const hasAnyCollectionPermission = collectionPerms.some(perm => permissions.includes(perm));

  const [activeTab, setActiveTab] = useState<'sections' | 'collections' | 'active_pages'>(
    permissions.includes('halaman_pages') ? 'sections' : 'collections'
  );
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedSection, setSelectedSection] = useState('hero');
  
  const [activePagesMap, setActivePagesMap] = useState<Record<string, boolean>>(() => {
    try {
      if (settings?.active_pages) {
        return JSON.parse(settings.active_pages);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      home: true,
      profil: true,
      filosofi: true,
      galeri: true,
      jadwal: true,
      program: true,
      join: true,
      berita: true,
      booking: true,
      kontak: true,
      sop: true
    };
  });

  const handleTogglePage = (pageKey: string) => {
    setActivePagesMap(prev => ({
      ...prev,
      [pageKey]: !prev[pageKey]
    }));
  };

  const handleActivePagesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/dashboard/pages/active-pages', {
      active_pages: JSON.stringify(activePagesMap)
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Status aktivasi halaman berhasil disimpan!', timer: 1500, showConfirmButton: false });
      },
      onError: (err) => {
        setIsSubmitting(false);
        Swal.fire('Gagal', err?.error || 'Gagal menyimpan status aktivasi', 'error');
      }
    });
  };

  // Find the first collection the user has permission to manage
  const getFirstAllowedCollection = () => {
    const list = [
      { key: 'articles', perm: 'halaman_berita' },
      { key: 'schedules', perm: 'halaman_jadwal' },
      { key: 'programs', perm: 'halaman_program' },
      { key: 'metrics', perm: 'halaman_home' },
      { key: 'structures', perm: 'halaman_profil' },
      { key: 'philosophical_values', perm: 'halaman_filosofi' },
      { key: 'galleries', perm: 'halaman_galeri' },
      { key: 'join_steps', perm: 'halaman_join' },
      { key: 'booking_packages', perm: 'halaman_booking' },
      { key: 'sop_rules', perm: 'halaman_sop' },
      { key: 'contact_infos', perm: 'halaman_kontak' }
    ];
    const allowed = list.find(col => permissions.includes(col.perm));
    return allowed ? allowed.key : 'articles';
  };

  const [activeCollection, setActiveCollection] = useState<string>(getFirstAllowedCollection());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Sections
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [sectionVideoUrl, setSectionVideoUrl] = useState('');
  const [sectionMediaUrl, setSectionMediaUrl] = useState('');
  const [sectionImageFile, setSectionImageFile] = useState<{ base64: string; name: string; mime: string } | null>(null);
  const [sectionImagePreview, setSectionImagePreview] = useState<string | null>(null);

  // Modal / Form state for collections
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Dynamic generic form fields for collections
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [imageFile, setImageFile] = useState<{ base64: string; name: string; mime: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Quill Editor references
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);



  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    const sectionsList = PAGE_SECTIONS_MAP[page]?.sections || [];
    if (sectionsList.length > 0) {
      setSelectedSection(sectionsList[0].key);
    }
  };

  // Sync section data
  useEffect(() => {
    const sec = sections.find(s => s.page_key === selectedPage && s.section_key === selectedSection);
    setSectionTitle(sec?.title || '');
    setSectionSubtitle(sec?.subtitle || '');
    setSectionVideoUrl(sec?.video_url || '');
    setSectionMediaUrl(sec?.media_url || '');
    setSectionImageFile(null);
    setSectionImagePreview(null);
  }, [selectedPage, selectedSection, sections]);

  // Init/destruct Quill Editor on Modal open
  useEffect(() => {
    if (showModal && activeCollection === 'articles' && editorRef.current) {
      if (!quillInstance.current) {
        quillInstance.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['clean']
            ]
          }
        });

        quillInstance.current.on('text-change', () => {
          if (quillInstance.current) {
            setFormData(prev => ({ ...prev, content: quillInstance.current!.root.innerHTML }));
          }
        });
      }
      
      // Seed content if editing
      if (formData.content) {
        quillInstance.current.root.innerHTML = formData.content;
      } else {
        quillInstance.current.root.innerHTML = '';
      }
    }

    return () => {
      // Keep quill instance alive or let it detach
    };
  }, [showModal, activeCollection, editId]);

  // Reset quill cached content when starting create
  const openCreateModal = () => {
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
    
    // Set default fields based on active collection
    let defaults: Record<string, any> = {};
    if (activeCollection === 'articles') defaults = { title: '', content: '' };
    else if (activeCollection === 'schedules') defaults = { date: '', title: '', place: '', time: '', activity: '', category: 'pertunjukan' };
    else if (activeCollection === 'programs') defaults = { title: '', description: '', icon: 'fa-star', category: 'reguler' };
    else if (activeCollection === 'metrics') defaults = { value: '', label: '' };
    else if (activeCollection === 'structures') defaults = { name: '', role: '', icon: 'fa-user' };
    else if (activeCollection === 'philosophical_values') defaults = { title: '', description: '', icon: 'fa-book', tag: '' };
    else if (activeCollection === 'galleries') defaults = { category: 'Latihan', title: '', description: '' };
    else if (activeCollection === 'join_steps') defaults = { step: '', title: '', description: '', category: 'pendaftaran' };
    else if (activeCollection === 'booking_packages') defaults = { name: '', description: '' };
    else if (activeCollection === 'sop_rules') defaults = { icon: 'fa-exclamation-circle', text: '', category: 'aturan' };
    else if (activeCollection === 'contact_infos') defaults = { icon: 'fa-phone', label: '', value: '' };
    
    setFormData(defaults);
    if (quillInstance.current) quillInstance.current.root.innerHTML = '';
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setImageFile(null);
    setImagePreview(item.media_url || null);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleBase64Upload = (e: React.ChangeEvent<HTMLInputElement>, target: 'section' | 'collection') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire('Ukuran File Terlalu Besar', 'Maksimal ukuran gambar adalah 10MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const fileObj = { base64, name: file.name, mime: file.type };
        if (target === 'section') {
          setSectionImageFile(fileObj);
          setSectionImagePreview(base64);
        } else {
          setImageFile(fileObj);
          setImagePreview(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit standard Page Sections
  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      page_key: selectedPage,
      section_key: selectedSection,
      title: sectionTitle || null,
      subtitle: sectionSubtitle || null,
      video_url: sectionVideoUrl || null,
      image_base64: sectionImageFile?.base64 || null,
      image_filename: sectionImageFile?.name || null,
      image_mime: sectionImageFile?.mime || null
    };

    router.post('/dashboard/pages', payload, {
      onSuccess: () => {
        setIsSubmitting(false);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Section halaman berhasil diperbarui!', timer: 1500, showConfirmButton: false });
      },
      onError: (err) => {
        setIsSubmitting(false);
        Swal.fire('Gagal', err?.error || 'Gagal menyimpan section', 'error');
      }
    });
  };

  // Submit Collections CRUD
  const handleCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      image_base64: imageFile?.base64 || null,
      image_filename: imageFile?.name || null,
      image_mime: imageFile?.mime || null
    };

    const url = editId 
      ? `/dashboard/${activeCollection}/${editId}` 
      : `/dashboard/${activeCollection}`;

    router.post(url, payload, {
      onSuccess: () => {
        setIsSubmitting(false);
        setShowModal(false);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data koleksi berhasil disimpan!', timer: 1500, showConfirmButton: false });
      },
      onError: (err) => {
        setIsSubmitting(false);
        Swal.fire('Gagal', Object.values(err).join('\n') || 'Gagal menyimpan data', 'error');
      }
    });
  };

  const handleCollectionDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus data?',
      text: 'Data yang terhapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(`/dashboard/${activeCollection}/${id}/delete`, {}, {
          onSuccess: () => {
            Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
          }
        });
      }
    });
  };

  // Helper check for permission
  const hasPermission = (perm: string) => permissions.includes(perm);

  const getCRUDPermissions = (collection: string) => {
    let base = '';
    switch (collection) {
      case 'articles': base = 'berita'; break;
      case 'schedules': base = 'jadwal'; break;
      case 'programs': base = 'program'; break;
      case 'metrics': base = 'home'; break;
      case 'structures': base = 'profil'; break;
      case 'philosophical_values': base = 'filosofi'; break;
      case 'galleries': base = 'galeri'; break;
      case 'join_steps': base = 'join'; break;
      case 'booking_packages': base = 'booking'; break;
      case 'sop_rules': base = 'sop'; break;
      case 'contact_infos': base = 'kontak'; break;
      default: base = collection; break;
    }
    return {
      create: `create_${base}`,
      update: `update_${base}`,
      delete: `delete_${base}`
    };
  };

  const { create: createPerm, update: updatePerm, delete: deletePerm } = getCRUDPermissions(activeCollection);
  const canCreate = hasPermission(createPerm);
  const canUpdate = hasPermission(updatePerm);
  const canDelete = hasPermission(deletePerm);

  // Fetch items list for active collection tab
  const getActiveCollectionData = () => {
    switch (activeCollection) {
      case 'articles': return articles;
      case 'schedules': return schedules;
      case 'programs': return programs;
      case 'metrics': return metrics;
      case 'structures': return structures;
      case 'philosophical_values': return philosophical_values;
      case 'galleries': return galleries;
      case 'join_steps': return join_steps;
      case 'booking_packages': return booking_packages;
      case 'sop_rules': return sop_rules;
      case 'contact_infos': return contact_infos;
      default: return [];
    }
  };

  const collectionData = getActiveCollectionData();

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
        {hasPermission('halaman_pages') && (
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'sections' 
                ? 'border-[#e11d48] text-[#e11d48]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            📑 Edit Section Halaman
          </button>
        )}
        {hasAnyCollectionPermission && (
          <button
            onClick={() => setActiveTab('collections')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'collections' 
                ? 'border-[#e11d48] text-[#e11d48]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            🗂️ Kelola Koleksi Data (Normalized)
          </button>
        )}
        {hasPermission('halaman_pages') && (
          <button
            onClick={() => setActiveTab('active_pages')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'active_pages' 
                ? 'border-[#e11d48] text-[#e11d48]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            ⚙️ Status Aktivasi Halaman
          </button>
        )}
      </div>

      {activeTab === 'sections' && hasPermission('halaman_pages') ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl p-4">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white text-xl font-black">
                <i className="fas fa-file-lines"></i>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Manajemen Konten Banner & Video</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Sesuaikan Teks Judul & Media Utama</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Halaman</label>
                <select 
                  value={selectedPage} 
                  onChange={(e) => handlePageChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#e11d48]/50 dark:text-white"
                >
                  {Object.entries(PAGE_SECTIONS_MAP).map(([key, pageObj]) => (
                    <option key={key} value={key}>{pageObj.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Section</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#e11d48]/50 dark:text-white"
                >
                  {PAGE_SECTIONS_MAP[selectedPage]?.sections.map((sec) => (
                    <option key={sec.key} value={sec.key}>{sec.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleSectionSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Judul Utama / Banner</label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 dark:text-white"
                placeholder="Masukkan judul section..."
              />
            </div>

            {selectedSection !== 'peta' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subtitle / Deskripsi</label>
                <textarea
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 dark:text-white"
                  placeholder="Masukkan deskripsi..."
                />
              </div>
            )}

            {selectedSection === 'video' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">YouTube Embed URL</label>
                <input
                  type="url"
                  value={sectionVideoUrl}
                  onChange={(e) => setSectionVideoUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 dark:text-white"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
            )}

            {selectedSection === 'peta' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e11d48]/50 dark:text-white"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
            )}

            {selectedSection === 'hero' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Gambar Cover Latar Belakang (Otomatis WebP)</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-20 bg-slate-100 dark:bg-slate-800 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    {sectionImagePreview || sectionMediaUrl ? (
                      <img src={sectionImagePreview || sectionMediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fas fa-image text-slate-300"></i>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBase64Upload(e, 'section')}
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#be123c] transition-all"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        activeTab === 'collections' && hasAnyCollectionPermission && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Collection Sidebar selector */}
            <div className="space-y-2 lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl h-fit">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pilih Koleksi Data</h4>
              {[
                { key: 'articles', label: '📰 Berita & Warta', perm: 'halaman_berita' },
                { key: 'schedules', label: '📅 Agenda & Latihan', perm: 'halaman_jadwal' },
                { key: 'programs', label: '🚀 Layanan & Program', perm: 'halaman_program' },
                { key: 'metrics', label: '📊 Statistik & Metrik', perm: 'halaman_home' },
                { key: 'structures', label: '👥 Pengurus & Adat', perm: 'halaman_profil' },
                { key: 'philosophical_values', label: '💡 Nilai Filosofi', perm: 'halaman_filosofi' },
                { key: 'galleries', label: '🖼️ Galeri Foto', perm: 'halaman_galeri' },
                { key: 'join_steps', label: '👣 Syarat & Gabung', perm: 'halaman_join' },
                { key: 'booking_packages', label: '📦 Paket Reservasi', perm: 'halaman_booking' },
                { key: 'sop_rules', label: '📜 Aturan SOP', perm: 'halaman_sop' },
                { key: 'contact_infos', label: '📞 Informasi Kontak', perm: 'halaman_kontak' }
              ].map((col) => {
                if (!hasPermission(col.perm)) return null;
                return (
                  <button
                    key={col.key}
                    onClick={() => setActiveCollection(col.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeCollection === col.key
                        ? 'bg-[#e11d48]/10 text-[#e11d48]'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{col.label}</span>
                    <i className="fas fa-chevron-right text-[10px]"></i>
                  </button>
                );
              })}
            </div>

            {/* List Datatable */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white capitalize">
                    Daftar {activeCollection.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-400">Total data: {collectionData.length} records</p>
                </div>
                {canCreate && (
                  <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-[#e11d48] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#be123c] transition-all"
                  >
                    + Tambah Data
                  </button>
                )}
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      {activeCollection === 'articles' && (
                        <>
                          <th className="py-3 px-4">Judul</th>
                          <th className="py-3 px-4">Slug</th>
                          <th className="py-3 px-4">Foto</th>
                        </>
                      )}
                      {activeCollection === 'schedules' && (
                        <>
                          <th className="py-3 px-4">Tanggal</th>
                          <th className="py-3 px-4">Judul</th>
                          <th className="py-3 px-4">Tempat</th>
                          <th className="py-3 px-4">Kategori</th>
                        </>
                      )}
                      {activeCollection === 'programs' && (
                        <>
                          <th className="py-3 px-4">Judul</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Icon</th>
                        </>
                      )}
                      {activeCollection === 'metrics' && (
                        <>
                          <th className="py-3 px-4">Nilai</th>
                          <th className="py-3 px-4">Label</th>
                        </>
                      )}
                      {activeCollection === 'structures' && (
                        <>
                          <th className="py-3 px-4">Nama</th>
                          <th className="py-3 px-4">Peran</th>
                        </>
                      )}
                      {activeCollection === 'philosophical_values' && (
                        <>
                          <th className="py-3 px-4">Judul</th>
                          <th className="py-3 px-4">Tag</th>
                        </>
                      )}
                      {activeCollection === 'galleries' && (
                        <>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Judul</th>
                          <th className="py-3 px-4">Media</th>
                        </>
                      )}
                      {activeCollection === 'join_steps' && (
                        <>
                          <th className="py-3 px-4">Langkah</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Deskripsi</th>
                        </>
                      )}
                      {activeCollection === 'booking_packages' && (
                        <>
                          <th className="py-3 px-4">Nama Paket</th>
                        </>
                      )}
                      {activeCollection === 'sop_rules' && (
                        <>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Aturan SOP</th>
                        </>
                      )}
                      {activeCollection === 'contact_infos' && (
                        <>
                          <th className="py-3 px-4">Label</th>
                          <th className="py-3 px-4">Nilai</th>
                        </>
                      )}
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs dark:text-slate-300">
                    {collectionData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">Belum ada data tersedia. Silakan tambahkan data baru.</td>
                      </tr>
                    ) : (
                      collectionData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-400">#{item.id}</td>
                          
                          {/* Articles list cells */}
                          {activeCollection === 'articles' && (
                            <>
                              <td className="py-3 px-4 font-bold max-w-[200px] truncate">{item.title}</td>
                              <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{item.slug}</td>
                              <td className="py-3 px-4">
                                {item.media_url ? (
                                  <img src={item.media_url} className="w-10 h-7 object-cover rounded" />
                                ) : (
                                  <span className="text-slate-400 italic">No image</span>
                                )}
                              </td>
                            </>
                          )}

                          {/* Schedules list cells */}
                          {activeCollection === 'schedules' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.date}</td>
                              <td className="py-3 px-4">{item.title}</td>
                              <td className="py-3 px-4">{item.place}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  item.category === 'latihan' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                  {item.category}
                                </span>
                              </td>
                            </>
                          )}

                          {/* Programs list cells */}
                          {activeCollection === 'programs' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.title}</td>
                              <td className="py-3 px-4 uppercase font-bold text-[10px]">{item.category}</td>
                              <td className="py-3 px-4"><i className={`fas ${item.icon} text-slate-400`}></i></td>
                            </>
                          )}

                          {/* Metrics list cells */}
                          {activeCollection === 'metrics' && (
                            <>
                              <td className="py-3 px-4 font-bold text-emerald-500">{item.value}</td>
                              <td className="py-3 px-4">{item.label}</td>
                            </>
                          )}

                          {/* Structures list cells */}
                          {activeCollection === 'structures' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.name}</td>
                              <td className="py-3 px-4">{item.role}</td>
                            </>
                          )}

                          {/* Philosophical list cells */}
                          {activeCollection === 'philosophical_values' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.title}</td>
                              <td className="py-3 px-4">{item.tag || '-'}</td>
                            </>
                          )}

                          {/* Galleries list cells */}
                          {activeCollection === 'galleries' && (
                            <>
                              <td className="py-3 px-4 font-bold text-[#e11d48]">{item.category}</td>
                              <td className="py-3 px-4">{item.title}</td>
                              <td className="py-3 px-4">
                                <img src={item.media_url} className="w-10 h-7 object-cover rounded" />
                              </td>
                            </>
                          )}

                          {/* Join steps list cells */}
                          {activeCollection === 'join_steps' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.step || '-'}</td>
                              <td className="py-3 px-4 uppercase text-[10px] font-bold">{item.category}</td>
                              <td className="py-3 px-4 truncate max-w-[200px]">{item.description}</td>
                            </>
                          )}

                          {/* Booking Packages list cells */}
                          {activeCollection === 'booking_packages' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.name}</td>
                            </>
                          )}

                          {/* SOP Rules list cells */}
                          {activeCollection === 'sop_rules' && (
                            <>
                              <td className="py-3 px-4 font-bold uppercase text-[10px]">{item.category}</td>
                              <td className="py-3 px-4 truncate max-w-[300px]">{item.text}</td>
                            </>
                          )}

                          {/* Contact Infos list cells */}
                          {activeCollection === 'contact_infos' && (
                            <>
                              <td className="py-3 px-4 font-bold">{item.label}</td>
                              <td className="py-3 px-4">{item.value}</td>
                            </>
                          )}

                          <td className="py-3 px-4 text-right space-x-2 shrink-0">
                            {canUpdate && (
                              <button
                                onClick={() => openEditModal(item)}
                                className="px-2.5 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-[10px] font-bold"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleCollectionDelete(item.id)}
                                className="px-2.5 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-[10px] font-bold"
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === 'active_pages' && hasPermission('halaman_pages') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl p-8">
          <div className="border-b border-slate-100 dark:border-slate-800/60 pb-6 mb-8 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white text-xl font-black">
              <i className="fas fa-toggle-on"></i>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">Status Aktivasi Halaman & Menu</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Aktifkan atau nonaktifkan halaman di menu utama dan luar</p>
            </div>
          </div>

          <form onSubmit={handleActivePagesSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAGES_METADATA.map((page) => {
                const hasPagePerm = hasPermission(`halaman_${page.key}`);
                return (
                  <div 
                    key={page.key} 
                    className={`p-5 rounded-2xl border bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between hover:shadow-md transition-all duration-300 group ${
                      hasPagePerm 
                        ? 'border-slate-200 dark:border-slate-800/80 hover:border-[#e11d48]/40' 
                        : 'border-slate-250 dark:border-slate-800/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors ${
                        hasPagePerm ? 'group-hover:bg-[#e11d48]/10 group-hover:text-[#e11d48]' : ''
                      }`}>
                        <i className={`fas ${page.icon} text-lg`}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{page.label}</h4>
                          {!hasPagePerm && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center gap-1 font-semibold">
                              <i className="fas fa-lock text-[8px]"></i> Terkunci
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-slate-400 mt-0.5">{page.path}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!hasPagePerm}
                        onClick={() => handleTogglePage(page.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none shrink-0 ${
                          !hasPagePerm 
                            ? 'bg-slate-200 dark:bg-slate-850 cursor-not-allowed'
                            : activePagesMap[page.key] 
                              ? 'bg-[#e11d48]' 
                              : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            activePagesMap[page.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#be123c] transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Status Aktivasi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal CRUD Collections */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white capitalize">
                {editId ? 'Edit Data' : 'Tambah Data Baru'} &raquo; {activeCollection.replace('_', ' ')}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              
              {/* Image Upload Form Component for Articles and Galleries */}
              {(activeCollection === 'articles' || activeCollection === 'galleries') && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unggah Foto Utama (Otomatis WebP)</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" />
                      ) : (
                        <i className="fas fa-image text-slate-300"></i>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBase64Upload(e, 'collection')}
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic form inputs based on selected active collection */}
              {activeCollection === 'articles' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Judul Berita</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Masukkan judul warta..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Isi Konten Berita (WordPress-Style Rich Text)</label>
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div ref={editorRef} style={{ minHeight: '200px' }} className="dark:text-white"></div>
                    </div>
                  </div>
                </div>
              )}

              {activeCollection === 'schedules' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hari / Tanggal</label>
                    <input
                      type="text"
                      required
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Cth: Selasa / 12 Sep 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Judul Agenda</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tempat / Lokasi</label>
                    <input
                      type="text"
                      required
                      value={formData.place || ''}
                      onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Waktu (Opsional)</label>
                    <input
                      type="text"
                      value={formData.time || ''}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Cth: 20:00 WIB"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Aktivitas Detail (Opsional)</label>
                    <input
                      type="text"
                      value={formData.activity || ''}
                      onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kategori Jadwal</label>
                    <select
                      value={formData.category || 'pertunjukan'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white focus:outline-none"
                    >
                      <option value="latihan">Latihan Mingguan</option>
                      <option value="pertunjukan">Pertunjukan Besar</option>
                    </select>
                  </div>
                </div>
              )}

              {activeCollection === 'programs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Judul Program</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kategori Program</label>
                      <select
                        value={formData.category || 'reguler'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white focus:outline-none"
                      >
                        <option value="reguler">Kelas Reguler</option>
                        <option value="ekowisata">Ekowisata Seni</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon FontAwesome (cth: fa-users)</label>
                      <input
                        type="text"
                        required
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deskripsi Singkat</label>
                    <textarea
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'metrics' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nilai (Value)</label>
                    <input
                      type="text"
                      required
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Cth: 120+"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Label Deskripsi</label>
                    <input
                      type="text"
                      required
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Cth: Anak Sasian"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'structures' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Tokoh / Pengurus</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Peran / Jabatan</label>
                      <input
                        type="text"
                        required
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon FontAwesome (Opsional, cth: fa-user-tie)</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'philosophical_values' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Nilai Filosofi</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tag / Kategori</label>
                      <input
                        type="text"
                        value={formData.tag || ''}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="Cth: Gerak Gelanggang"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon FontAwesome</label>
                    <input
                      type="text"
                      required
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="fa-dot-circle"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deskripsi & Makna</label>
                    <textarea
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'galleries' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kategori Galeri</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="Cth: Latihan / Pertunjukan / Adat"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Judul Foto</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Keterangan / Deskripsi Foto</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'join_steps' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nomor Langkah (Hanya jika Alur)</label>
                      <input
                        type="text"
                        value={formData.step || ''}
                        onChange={(e) => setFormData({ ...formData, step: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="Cth: 1 (Kosongkan jika syarat)"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kategori</label>
                      <select
                        value={formData.category || 'pendaftaran'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white focus:outline-none"
                      >
                        <option value="pendaftaran">Alur Pendaftaran</option>
                        <option value="syarat">Persyaratan Gabung</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Judul Poin (Opsional)</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Cth: Isi Formulir"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Isi Deskripsi Aturan / Langkah</label>
                    <textarea
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'booking_packages' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Paket Reservasi</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deskripsi Detail Paket</label>
                    <textarea
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'sop_rules' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon FontAwesome</label>
                      <input
                        type="text"
                        required
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="fa-user-clock"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kategori Aturan</label>
                      <input
                        type="text"
                        required
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="Cth: aturan"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Isi Poin Aturan SOP</label>
                    <textarea
                      required
                      value={formData.text || ''}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeCollection === 'contact_infos' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Label Kontak</label>
                      <input
                        type="text"
                        required
                        value={formData.label || ''}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="Cth: Email Kami"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon FontAwesome</label>
                      <input
                        type="text"
                        required
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                        placeholder="fa-envelope"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nilai Kontak</label>
                    <input
                      type="text"
                      required
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs dark:text-white"
                      placeholder="Cth: info@antabung.art"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#e11d48] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#be123c]"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
