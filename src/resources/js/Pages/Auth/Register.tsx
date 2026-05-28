import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Toast from '../../Components/Toast';
import AlertBanner from '../../Components/AlertBanner';
import FormInput from '../../Components/FormInput';

export default function Register() {
  const { flash } = usePage<any>().props;
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <div style={{ padding: '60px 24px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Toast flash={flash} />

      <div className="glassmorphism" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(232, 82, 14, 0.15)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '128px', height: '128px',
          background: 'rgba(232, 82, 14, 0.05)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#e8520e',
            background: 'rgba(232, 82, 14, 0.08)', border: '1px solid rgba(232, 82, 14, 0.15)',
            padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase'
          }}>
            RustBasic SPA
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'inherit', marginTop: '16px', marginBottom: '8px' }}>Daftar Akun</h1>
          <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>Mulai perjalanan Anda bersama kami</p>
        </div>

        {flash?.error && <AlertBanner type="error" message={flash.error} />}
        {flash?.success && <AlertBanner type="success" message={flash.success} />}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FormInput
            label="Nama Lengkap"
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            error={errors.name}
            placeholder="Nama Lengkap Anda"
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            placeholder="nama@email.com"
            required
          />

          <FormInput
            label="Password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            error={errors.password}
            placeholder="Min. 8 karakter"
            required
          />

          <button
            type="submit"
            disabled={processing}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #e8520e, #d4470b)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(232,82,14,0.3)',
              transition: 'all 0.2s',
              opacity: processing ? 0.6 : 1,
            }}
          >
            {processing ? 'MENDAFTAR...' : 'BUAT AKUN SEKARANG'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', marginTop: '32px', marginBottom: 0 }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: '#e8520e', fontWeight: 700, textDecoration: 'none' }}>
            Login Disini
          </Link>
        </p>
      </div>
    </div>
  );
}
