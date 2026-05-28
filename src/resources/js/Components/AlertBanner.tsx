import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertBannerProps {
  type?: AlertType;
  message?: string | null;
  onDismiss?: () => void;
}

const ALERT_STYLES: Record<AlertType, { bg: string; border: string; color: string; icon: string }> = {
  success: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.2)',
    color: '#34d399',
    icon: '✅',
  },
  error: {
    bg: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.2)',
    color: '#fb7185',
    icon: '❌',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
    color: '#fbbf24',
    icon: '⚠️',
  },
  info: {
    bg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    icon: 'ℹ️',
  },
};

export default function AlertBanner({ type = 'info', message, onDismiss }: AlertBannerProps) {
  if (!message) return null;
  const style = ALERT_STYLES[type] || ALERT_STYLES.info;

  return (
    <div
      role="alert"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '14px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'alertSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{style.icon}</span>
      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: style.color, lineHeight: 1.5 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: style.color,
            cursor: 'pointer',
            padding: '2px 4px',
            opacity: 0.6,
            transition: 'opacity 0.2s',
            fontSize: '14px',
          }}
        >
          ✕
        </button>
      )}
      <style>{`
        @keyframes alertSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
