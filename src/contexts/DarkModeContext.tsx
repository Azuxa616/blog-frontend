'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// localStorage 键名
const DARK_MODE_STORAGE_KEY = 'darkMode';

export function DarkModeProvider({ children }: { children: ReactNode }) {
  // 使用 mounted 状态来避免 hydration mismatch
  // 服务端和客户端首次渲染时都使用 false，然后在客户端挂载后同步实际状态
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 客户端挂载后，从 DOM 读取实际的主题状态（脚本已设置）
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // 检查用户是否手动设置过主题
  const hasManualSetting = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(DARK_MODE_STORAGE_KEY) !== null;
  }, []);

  // 更新 DOM 和 localStorage
  const updateTheme = useCallback((isDark: boolean) => {
    if (typeof window === 'undefined') return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem(DARK_MODE_STORAGE_KEY, isDark.toString());
    
    // 触发 storage 事件，支持多标签页同步
    window.dispatchEvent(new StorageEvent('storage', {
      key: DARK_MODE_STORAGE_KEY,
      newValue: isDark.toString(),
      storageArea: localStorage,
    }));
  }, []);

  // 监听 localStorage 变化（多标签页同步）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DARK_MODE_STORAGE_KEY && e.newValue !== null) {
        const newValue = e.newValue === 'true';
        setIsDarkMode(newValue);
        // 更新 DOM（storage 事件不会自动更新当前标签页的 DOM）
        if (newValue) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 监听系统偏好变化（仅在用户未手动设置时）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasManualSetting()) return; // 用户已手动设置，不监听系统偏好

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemPreferenceChange = (e: MediaQueryListEvent) => {
      // 仅在用户未手动设置时响应系统偏好变化
      if (!hasManualSetting()) {
        setIsDarkMode(e.matches);
        updateTheme(e.matches);
      }
    };

    // 使用现代 API 监听变化
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemPreferenceChange);
      return () => mediaQuery.removeEventListener('change', handleSystemPreferenceChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleSystemPreferenceChange);
      return () => mediaQuery.removeListener(handleSystemPreferenceChange);
    }
  }, [hasManualSetting, updateTheme]);

  // 当状态改变时，更新 DOM 和 localStorage（仅在客户端挂载后）
  useEffect(() => {
    if (!mounted) return;
    updateTheme(isDarkMode);
  }, [isDarkMode, updateTheme, mounted]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return (
    <DarkModeContext.Provider value={{
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}
