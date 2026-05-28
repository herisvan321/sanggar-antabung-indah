import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Toast from '../Components/Toast';
import { useTheme } from '../Layouts/AppLayout';

interface DashboardProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  totalUsers?: number;
}

export default function Dashboard({ title, userName, userEmail, totalUsers }: DashboardProps) {
  const { flash } = usePage<any>().props;
  const { colors, isDark } = useTheme();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <Toast flash={flash} />
      
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 900,
              color: colors.textMain,
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {title || 'Dashboard'}
            </h1>
            <p style={{
              fontSize: '0.9rem',
              color: colors.textMuted,
              marginTop: '4px',
              marginBottom: 0,
            }}>
              Selamat datang kembali, kendalikan project Anda secara instan.
            </p>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'rgba(16,185,129,0.08)',
            color: '#34d399',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 10px #34d399',
            }} />
            Server Status: Running
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {/* Stat 1 */}
          <div style={{
            padding: '28px',
            borderRadius: '20px',
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#e8520e',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              User Terdaftar
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: colors.textMain }}>
                {totalUsers || 0}
              </span>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>
                pengguna
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div style={{
            padding: '28px',
            borderRadius: '20px',
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#ff8c42',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Response Time
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: colors.textMain }}>
                24
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: colors.textMuted }}>
                ms
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div style={{
            padding: '28px',
            borderRadius: '20px',
            border: `1px solid ${colors.activeCardBorder}`,
            background: colors.activeCardBg,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#e8520e',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Database Status
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 12px #34d399',
              }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
                HEALTHY
              </span>
            </div>
          </div>
        </div>

        {/* User profile & action panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {/* User profile card */}
          <div style={{
            padding: '32px',
            borderRadius: '24px',
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: colors.textMain,
              margin: 0,
            }}>
              👤 Profil Pengguna
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e8520e, #ff8c42)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '1.2rem',
              }}>
                {userName ? userName[0].toUpperCase() : 'G'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: colors.textMain, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {userName || 'Administrator'}
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: colors.textMuted, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {userEmail || 'admin@rustbasic.dev'}
                </p>
              </div>
            </div>

            <form onSubmit={handleLogout} style={{ marginTop: '8px' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                }}
              >
                🚪 KELUAR SISTEM
              </button>
            </form>
          </div>

          {/* Server Info Panel */}
          <div style={{
            padding: '32px',
            borderRadius: '24px',
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: colors.textMain,
              margin: 0,
            }}>
              ⚙️ Informasi Kernel Server
            </h3>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${colors.cardBorder}`,
              color: isDark ? '#34d399' : '#059669',
              lineHeight: 1.6,
            }}>
              <div>[OK] Compiled with Rust Engine 0.8.2</div>
              <div>[OK] Database Pool: Connection Established</div>
              <div>[OK] Modern SPA Routing: Powered by Inertia.js</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
