'use client';

import { useEffect } from 'react';

export default function ArticleActions() {
  useEffect(() => {
    // 阅读进度条和回到顶部按钮逻辑
    const handleScroll = () => {
      const progressBar = document.getElementById('progress-bar');
      const backToTop = document.getElementById('back-to-top');

      if (!progressBar || !backToTop) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);

      progressBar.style.width = progress + '%';
      backToTop.classList.toggle('hidden', scrollTop <= 300);
    };

    window.addEventListener('scroll', handleScroll);
    // 初始加载时也检查一次
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-1 bg-blue-500 transition-all duration-300 ease-out"
          id="progress-bar"
        />
      </div>

      {/* 回到顶部按钮 */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40 flex items-center justify-center back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="回到顶部"
        id="back-to-top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  );
}

