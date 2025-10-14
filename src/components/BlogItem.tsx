import { useEffect, useState } from "react";
import Image from "next/image";

interface BlogItemProps {
    layout: "normal" | "reverse";
    coverImage: string;
    title: string;
    description: string;
    category: string;
    publishDate: string;
    viewCount?: number;
}



export default function BlogItem({
    layout = "normal",
    coverImage = "/imgs/404.jpg",
    title = "Untitled",
    description = "No description",
    category = "未分类",
    publishDate = "未知时间",
    viewCount = 0
}: BlogItemProps) {
    const [isReverse, setIsReverse] = useState(false);
    useEffect(() => {
        setIsReverse(layout === "reverse");
    }, [layout]);

    return (
        <div className={`relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 flex min-w-96 justify-between items-start  gap-4`}>
            {/* 装饰性背景元素 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 rounded-2xl"></div>

            {/* 内容区域 */}
            <div className="flex justify-between">
                {/* 封面图片 */}
                {!isReverse && <div className="flex-shrink-0 w-28 h-20 relative rounded-lg overflow-hidden">
                    <Image
                        src={coverImage}
                        alt={title}
                        width={112}
                        height={80}
                    />
                </div>}

                {/* 内容区域 */}
                <div className="flex flex-col flex-1 gap-3 items-start min-w-0">
                    {/* 标题和分类 */}
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2 flex-1 leading-tight">
                            {title}
                        </h3>
                        <span className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {category}
                        </span>
                    </div>

                    {/* 描述 */}
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {description}
                    </p>

                    {/* 发布时间和浏览量 */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {publishDate}
                        </span>
                        {viewCount > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {viewCount}
                            </span>
                        )}
                    </div>
                </div>
                {/* 封面图片 (reverse)*/}
                {isReverse && <div className="flex-shrink-0 w-28 h-20 relative rounded-lg overflow-hidden">
                    <Image
                        src={coverImage}
                        alt={title}
                        width={112}
                        height={80}
                    />
                </div>}
            </div>
        </div>
    )

}