'use client';
import { useState, useEffect } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function FloatingActionButton() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件，控制组件显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 当视窗处于顶部时隐藏，否则显示
      setIsVisible(currentScrollY > 0);
    };

    // 初始检查
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* 回到顶部按钮 */}
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="回到顶部"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>

        {/* 深色模式切换按钮 */}
        <button
          onClick={toggleDarkMode}
          className="w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDarkMode ? (
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
