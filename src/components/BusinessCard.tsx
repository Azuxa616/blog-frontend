import Image from "next/image";
import Avatar from "./Avatar";
import Link from "next/link";

export default function BusinessCard() {
    return (
        <div className="relative max-w-sm mx-auto">
            {/* 卡片主体 */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* 装饰性背景元素 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 rounded-2xl"></div>

                {/* 内容区域 */}
                <div className="relative flex flex-col items-center gap-6">
                    {/* 头像区域 */}
                    <div className="relative ">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
                            <Avatar width={80} height={80} />
                        </div>
                        {/* 装饰环 */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/60 shadow-sm"></div>
                    </div>

                    {/* 姓名 */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">Azuxa616</h3>
                        <p className="text-sm text-gray-500">Frontend Developer</p>
                    </div>

                    {/* GitHub 按钮 */}
                    <button
                        className="w-full group flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        onClick={() => window.open("https://github.com/Azuxa616", "_blank")}
                    >
                        <Image
                            src="/svgs/github.svg"
                            alt="github"
                            width={20}
                            height={20}
                            className="opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <span>Follow on GitHub</span>
                    </button>
                    {/* Gitee 按钮 */}
                    <button
                        className="w-full group flex items-center gap-3 bg-gradient-to-r from-[#d81e06] to-[#c0392b] hover:from-[#c0392b] hover:to-[#a93226] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        onClick={() => window.open("https://gitee.com/Azuxa616", "_blank")}
                    >
                        <Image
                            src="/svgs/gitee.svg"
                            alt="gitee"
                            width={20}
                            height={20}
                            className="opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <span>Follow on Gitee</span>
                    </button>
                </div>

                {/* 装饰性底部渐变 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-b-2xl opacity-80"></div>
            </div>
        </div>
    )
}