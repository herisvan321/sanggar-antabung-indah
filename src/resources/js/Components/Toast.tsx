import React, { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface SingleToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

interface ToastProps {
  flash?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  } | null;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity={0.15} />
      <path d="M6 10.5L8.5 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity={0.15} />
      <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity={0.15} />
      <path d="M10 6V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity={0.15} />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
};

const STYLES: Record<ToastType, { bg: string; border: string; color: string; progress: string; shadow: string }> = {
  success: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
    color: '#34d399',
    progress: '#10b981',
    shadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
  },
  error: {
    bg: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.25)',
    color: '#fb7185',
    progress: '#f43f5e',
    shadow: '0 8px 32px rgba(244, 63, 94, 0.15)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    color: '#fbbf24',
    progress: '#f59e0b',
    shadow: '0 8px 32px rgba(245, 158, 11, 0.15)',
  },
  info: {
    bg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.25)',
    color: '#818cf8',
    progress: '#6366f1',
    shadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
  },
};

function SingleToast({ id, type, message, duration = 5000, onDismiss }: SingleToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const style = STYLES[type] || STYLES.info;

  const dismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(id), 350);
  }, [id, onDismiss]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    const dismissTimer = setTimeout(() => dismiss(), duration);
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(progressInterval);
    }, 30);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [duration, dismiss]);

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        color: style.color,
        backdropFilter: 'blur(20px)',
        boxShadow: style.shadow,
        transform: isVisible && !isLeaving
          ? 'translateX(0) scale(1)'
          : isLeaving
            ? 'translateX(120%) scale(0.9)'
            : 'translateX(120%) scale(0.9)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '320px',
        maxWidth: '420px',
        cursor: 'pointer',
      }}
      onClick={dismiss}
      role="alert"
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{ICONS[type] || ICONS.info}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          opacity: 0.7,
          marginBottom: '2px',
        }}>
          {type === 'success' && 'Berhasil'}
          {type === 'error' && 'Kesalahan'}
          {type === 'warning' && 'Peringatan'}
          {type === 'info' && 'Informasi'}
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#e2e8f0',
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}>{message}</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        style={{
          background: 'none',
          border: 'none',
          color: style.color,
          cursor: 'pointer',
          padding: '2px',
          opacity: 0.5,
          transition: 'opacity 0.2s',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        ✕
      </button>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `${style.progress}15`,
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${style.progress}, ${style.progress}aa)`,
          transition: 'width 0.1s linear',
          borderRadius: '0 0 16px 16px',
        }} />
      </div>
    </div>
  );
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export default function Toast({ flash, duration = 5000, position = 'top-right' }: ToastProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!flash) return;
    const newToasts: ToastItem[] = [];
    if (flash.success) newToasts.push({ id: Date.now() + '_s', type: 'success', message: flash.success });
    if (flash.error) newToasts.push({ id: Date.now() + '_e', type: 'error', message: flash.error });
    if (flash.warning) newToasts.push({ id: Date.now() + '_w', type: 'warning', message: flash.warning });
    if (flash.info) newToasts.push({ id: Date.now() + '_i', type: 'info', message: flash.info });

    if (newToasts.length > 0) {
      setToasts(prev => [...prev, ...newToasts]);
    }
  }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

  const handleDismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const positionStyle: Record<string, React.CSSProperties> = {
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' },
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', zIndex: 99999, pointerEvents: 'none', ...positionStyle[position] }}>
      <div style={{ pointerEvents: 'auto' }}>
        {toasts.map(toast => (
          <SingleToast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={duration}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
}
