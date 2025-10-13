'use client'
import Image from "next/image";
import { useEffect, useRef, useCallback } from 'react'
import Typewriter from "@/components/Typewriter";
import BusinessCard from "@/components/BusinessCard";
import FooterBar from "@/components/FooterBar";
import { usePage } from "@/contexts/PageContext";

//背景图片下拉箭头动画
const ArrowAnimation = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="animate-bounce cursor-pointer" onClick={onClick}>
      <Image
        src="/svgs/arrow-down.svg"
        alt="background"
        className="object-cover"
        priority
        quality={200}
        width={40}
        height={40}
      />
    </div>
  )
}



export default function Home() {
  const { isExpanded, setIsExpanded, isTransitioning, setIsTransitioning } = usePage()

  const mainRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const throttleTimer = useRef<NodeJS.Timeout>(null)


  //节流函数
  const throttle = useCallback((func: Function, delay: number) => {
    if (throttleTimer.current) {
      clearTimeout(throttleTimer.current)
    }
    throttleTimer.current = setTimeout(() => {
      func()
    }, delay)
  }, [])

  // 展开页面函数
  const expandPage = useCallback(() => {
    if (!isExpanded && !isTransitioning) {
      console.log("触发展开");
      setIsExpanded(true);
      setIsTransitioning(true);

      // 延迟后滚动到主要内容区
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
        setIsTransitioning(false);
      }, 100);
    }
  }, [isExpanded, isTransitioning]);

  // 折叠页面函数
  const collapsePage = useCallback(() => {
    if (isExpanded && !isTransitioning) {
      console.log("触发折叠");
      setIsExpanded(false);
      setIsTransitioning(true);

      // 滚动到页面顶部
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setIsTransitioning(false);
      }, 100);
    }
  }, [isExpanded, isTransitioning]);


  //处理滚轮事件
  const handleWheel = useCallback((e: WheelEvent) => {
    console.log('Wheel event triggered:', {
      deltaY: e.deltaY,
      isExpanded,
      isTransitioning,
      scrollY: window.scrollY,
      type: e.type
    });

    const deltaY = e.deltaY; // wheel事件的deltaY直接表示滚轮方向

    // 检测向下滚动（滚轮下拉）
    if (deltaY > 0 && !isExpanded && !isTransitioning) {
      console.log("触发向下滚动展开");
      e.preventDefault(); // 防止默认滚动行为
      expandPage();
    }
    // 检测向上滚动且页面在顶部附近时复原折叠状态
    else if (deltaY < 0 && isExpanded && window.scrollY <= 100 && !isTransitioning) {
      console.log("触发向上滚动折叠");
      e.preventDefault(); // 防止默认滚动行为
      collapsePage();
    }
  }, [isExpanded, isTransitioning, expandPage, collapsePage]);

  // 设置事件监听器
  useEffect(() => {

    // 添加滚轮事件监听
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);
  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen w-full">

      <main className="flex flex-col row-start-2 items-center sm:items-start w-full relative z-10">
        {/* 背景图片区域 */}
        <div className="relative w-full h-full">
          {/* 背景图片 */}
          <div className="fixed inset-0 z-0">
            <Image
              src="/imgs/index-bg-img-03.png"
              alt="background"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </div>
        </div>
        {/* 首页初始显示区域 */}
        <div className="relative flex flex-col items-center justify-center gap-4 min-h-screen min-w-screen text-center text-white ">
          {/* 标题区域 */}
          <div className="relative flex flex-col items-center justify-center gap-4 min-h-screen min-w-screen text-center text-white ">
            {/* 主标题 */}
            <h1 className="text-6xl font-bold">Welcome to Azuxa's BlogWorld</h1>
            {/* 副标题 */}
            <Typewriter
              initialText="Not just a blog, but"
              repeatedTextList={[" a notebook", " a showcase", " a ground", " a world"]}
              initialTypingSpeed={120}
              repeatedTypingSpeed={100}
              gapInterval={2000}
              loop={true}
              deleteSpeed={60}
              cursor="_"
              cursorBlinkInterval={500}
              className="text-3xl font-mono"
            />
          </div>
          {/* 下拉箭头动画 */}
          <div className="absolute bottom-1/12 left-1/2 ">
            <ArrowAnimation onClick={expandPage} />
          </div>

        </div>


        {/* 主要内容区 */}
        {isExpanded && (
          <div className="relative flex flex-col items-center justify-center h-screen w-full text-center bg-[#fffeee]">
            <h1 className="h-160 text-4xl font-bold">Azuxa's BlogWorld</h1>
            <BusinessCard />
          </div>
        )}
      </main>
        {isExpanded && <FooterBar />}
    </div>
  );
}
