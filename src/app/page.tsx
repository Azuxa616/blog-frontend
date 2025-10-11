import Image from "next/image";
import Typewriter from "@/components/Typewriter";

export default function Home() {
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
        {/* 标题区域 */}
        <div className="relative flex flex-col items-center justify-center gap-4 min-h-screen min-w-screen text-center text-white ">
          {/* 主标题 */}
          <h1 className="text-6xl font-bold">Welcome to Azuxa's BlogWorld</h1>
          {/* 副标题 */}
          <Typewriter
            initialText="Not just a blog, but"
            repeatedTextList={[" a notebook"," a showcase", " a ground", " a world"]}
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
        {/* 主要内容区 */}
        <div className="relative flex flex-col items-center justify-center h-full w-full text-center bg-white w-full">
          <h1 className="h-160 text-4xl font-bold">Azuxa's BlogWorld</h1>
        </div>
      </main>
      <footer className="w-full h-16 bg-[#254889] row-start-3 flex gap-[24px] flex-wrap items-center justify-center relative z-10">
        <span className="text-sm text-white font-semibold">
          © {new Date().getFullYear()} Azuxa's BlogSpace. 保留所有权利.
        </span>
        <span className="text-xs text-gray-200">
          由 Next.js & Tailwind CSS 强力驱动
        </span>
      </footer>
    </div>
  );
}
