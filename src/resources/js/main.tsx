import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from './Layouts/AppLayout';
import AdminLayout from './Layouts/AdminLayout';
import '../css/tailwind.css';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import '../css/premium-ui.css';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

DataTable.use(DT);

// Extend the Window interface to typecheck window.axios
declare global {
  interface Window {
    axios: typeof axios;
  }
}

// Konfigurasi Axios secara global
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Mengambil CSRF token dari meta tag dan menyematkannya ke header default Axios
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
} else {
  console.warn('CSRF token meta tag tidak ditemukan! Pastikan tag <meta name="csrf-token"> tersedia.');
}

createInertiaApp({
  resolve: name => {
    // Membaca seluruh file React di dalam folder Pages secara dinamis menggunakan Vite glob
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    const page = pages[`./Pages/${name}.tsx`] as any;
    if (!page) {
      throw new Error(`Halaman Pages/${name}.tsx tidak ditemukan!`);
    }
    
    // Set default persistent layout
    const pageComponent = page.default;
    
    // Konfigurasi Layout Persisten
    if (name.startsWith('Admin/') || name === 'Dashboard') {
      // Halaman Admin & Dashboard menggunakan AdminLayout
      pageComponent.layout = pageComponent.layout || ((pageNode: React.ReactNode) => <AdminLayout>{pageNode}</AdminLayout>);
    } else if (!name.startsWith('Auth/')) {
      // Halaman publik lainnya menggunakan AppLayout
      pageComponent.layout = pageComponent.layout || ((pageNode: React.ReactNode) => <AppLayout>{pageNode}</AppLayout>);
    }
    
    return pageComponent;
  },
  setup({ el, App, props }) {
    // Mount aplikasi React ke elemen HTML #app
    createRoot(el).render(<App {...props} />);
  },
});
