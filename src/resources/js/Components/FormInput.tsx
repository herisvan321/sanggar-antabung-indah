import React, { useState, useEffect } from 'react';
import { useTheme } from '../Layouts/AppLayout';

interface FormInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

function useSafeTheme() {
  try {
    const context = useTheme();
    return context;
  } catch (e) {
    return null;
  }
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoFocus = false,
  disabled = false,
}: FormInputProps) {
  const themeContext = useSafeTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (themeContext) {
      setIsDark(themeContext.isDark);
    } else {
      const checkDark = () => {
        setIsDark(document.documentElement.classList.contains('dark'));
      };
      checkDark();
      const observer = new MutationObserver(checkDark);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, [themeContext, themeContext?.isDark]);

  const hasError = !!error;

  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '8px',
          color: hasError ? '#fb7185' : (isDark ? '#94a3b8' : '#64748b'),
          transition: 'color 0.3s ease',
        }}>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${hasError ? 'rgba(244, 63, 94, 0.5)' : (isDark ? 'rgba(30, 41, 59, 1)' : 'rgba(203, 213, 225, 1)')}`,
          borderRadius: '12px',
          padding: '12px 14px',
          fontSize: '14px',
          color: isDark ? '#ffffff' : '#0f172a',
          outline: 'none',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.5 : 1,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = hasError ? 'rgba(244, 63, 94, 0.7)' : 'rgba(232, 82, 14, 0.5)';
          e.target.style.boxShadow = hasError ? '0 0 0 3px rgba(244, 63, 94, 0.1)' : '0 0 0 3px rgba(232, 82, 14, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = hasError ? 'rgba(244, 63, 94, 0.5)' : (isDark ? 'rgba(30, 41, 59, 1)' : 'rgba(203, 213, 225, 1)');
          e.target.style.boxShadow = 'none';
        }}
      />
      {hasError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginTop: '6px',
          animation: 'errorShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6" cy="6" r="6" fill="rgba(244, 63, 94, 0.15)" />
            <path d="M6 3.5V6.5" stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6" cy="8.2" r="0.6" fill="#fb7185" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fb7185', lineHeight: 1.3 }}>{error}</span>
        </div>
      )}
      <style>{`
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}
