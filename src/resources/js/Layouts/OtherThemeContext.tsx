import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeContextType {
  theme: 'dark' | 'light';
  isDark: boolean;
  toggleTheme: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  toastOpen: boolean;
  toastMessage: string;
  showToast: (msg: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useOtherTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useOtherTheme must be used within an OtherThemeProvider');
  }
  return context;
}

export function OtherThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('other_theme') as 'dark' | 'light') || 'light';
    }
    return 'light';
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Proses Berhasil!');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  useEffect(() => {
    if (toastOpen) {
      const timer = setTimeout(() => {
        setToastOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update body classes and styles dynamically
  useEffect(() => {
    localStorage.setItem('other_theme', theme);
    const docRoot = document.documentElement;
    const body = document.body;
    
    body.style.fontFamily = "'Poppins', sans-serif";
    
    if (theme === 'dark') {
      docRoot.classList.add('dark');
      docRoot.classList.remove('light');
      body.style.backgroundColor = '#0a0a0c';
      body.style.color = '#ffffff';
    } else {
      docRoot.classList.add('light');
      docRoot.classList.remove('dark');
      body.style.backgroundColor = '#f8fafc';
      body.style.color = '#0f172a';
    }
  }, [theme]);

  // Clean up styles when this layout provider unmounts (leaving the layout)
  useEffect(() => {
    return () => {
      const docRoot = document.documentElement;
      const body = document.body;
      docRoot.classList.remove('dark', 'light');
      body.style.backgroundColor = '';
      body.style.color = '';
      body.style.fontFamily = '';
    };
  }, []);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isFullscreen, toggleFullscreen, toastOpen, toastMessage, showToast }}>
      {children}
    </ThemeContext.Provider>
  );
}
