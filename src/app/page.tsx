'use client'
import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from 'react'
import Typewriter from "@/components/Typewriter";
import BusinessCard from "@/components/BusinessCard";
import FooterBar from "@/components/FooterBar";
import WebStatisticDataCard from "@/components/WebStatisticDataCard";
import BlogItem from "@/app/articles/BlogItem";
import { usePage } from "@/contexts/PageContext";
import GithubCard from "@/components/GithubCard";
//背景图片下拉箭头动画
const ArrowAnimation = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="animate-bounce cursor-pointer" onClick={onClick}>
      <Image
        src="/svgs/arrow-down.svg"
        alt="background"
        className="object-cover"
        priority
        quality={100}
        width={40}
        height={40}
      />
    </div>
  )
}


interface GitHubData {
  user: {
    avatar_url: string;
    name: string;
    login: string;
    bio: string | null;
    followers: number;
    following: number;
    public_repos: number;
  };
  repos: Array<{
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    updated_at: string;
    language: string | null;
    license: {
      name: string;
      spdx_id: string;
    } | null;
    stargazers_count: number;
  }>;
}

export default function Home() {
  const { isExpanded, setIsExpanded, isTransitioning, setIsTransitioning } = usePage()
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [githubLoading, setGithubLoading] = useState(true)
  const [githubError, setGithubError] = useState<string | null>(null)

  const throttleTimer = useRef<NodeJS.Timeout>(null)

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
  }, [isExpanded, isTransitioning, setIsExpanded, setIsTransitioning]);

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
  }, [isExpanded, isTransitioning, setIsExpanded, setIsTransitioning]);


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

  // 获取 GitHub 数据 - 组件挂载时获取，只获取一次
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        setGithubLoading(true)
        setGithubError(null)

        const response = await fetch('/api/github')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '获取 GitHub 数据失败')
        }

        setGithubData(data)
      } catch (error) {
        console.error('获取 GitHub 数据错误:', error)
        setGithubError(error instanceof Error ? error.message : '获取 GitHub 数据失败')
      } finally {
        setGithubLoading(false)
      }
    }
    // 组件挂载时立即获取数据
    fetchGithubData()
  }, [])

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
        <div className="relative flex flex-col items-center justify-center gap-4 min-h-screen min-w-screen text-center ">
          {/* 标题区域 */}
          <div className="relative flex flex-col items-center justify-center gap-4 min-h-screen min-w-screen text-center text-white ">
            {/* 主标题 */}
            <h1 className="text-6xl font-bold">Welcome to Azuxa&apos;s BlogWorld</h1>
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
          <div className="relative flex items-start justify-center w-full text-center gap-8 bg-background ">
            {isExpanded && (
              <div className="flex flex-col items-center justify-center p-10 gap-8 rounded-2xl my-30 bg-[url('/imgs/index-bg-img-06.png')] bg-cover">
                {/* GitHub 卡片区域 - 始终渲染 */}
                <GithubCard 
                  user={githubData?.user || null}
                  repos={githubData?.repos || []}
                  isLoading={githubLoading}
                  error={githubError}
                  learned={[
                    { name: "TypeScript", proficiency: 85, imgUrl: "/imgs/logo-ts.webp", docUrl: "https://www.typescriptlang.org/" },
                    { name: "React", proficiency: 75, imgUrl: "/imgs/logo-react.webp", docUrl: "https://zh-hans.react.dev/" },
                    { name: "Vue", proficiency: 65, imgUrl: "/imgs/logo-vue.webp", docUrl: "https://vuejs.org/" },
                    { name: "Ant Design ", proficiency: 50, imgUrl: "/imgs/logo-antd.webp", docUrl: "https://ant.design/index-cn" },
                  ]}
                  practicing={[
                    { name: "Next.js", proficiency: 60, imgUrl: "/imgs/logo-nextjs.webp", docUrl: "https://nextjs.org/" },
                    { name: "Tailwind CSS", proficiency: 60, imgUrl: "/imgs/logo-tailwindcss.webp", docUrl: "https://tailwindcss.com/" },
                    { name: "Node.js", proficiency: 70, imgUrl: "/imgs/logo-nodejs.webp", docUrl: "https://nodejs.org/" },
                    { name: "FastApi", proficiency: 50, imgUrl: "/imgs/logo-fastapi.webp", docUrl: "https://fastapi.tiangolo.com/" }
                  ]}
                />
              </div>
            )}
            {/* 文章导航按钮 */}
            <div className="flex">
              
            </div>
          </div>
        )}
      </main>
      {isExpanded && <FooterBar />}
    </div>
  );
}
