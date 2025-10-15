import Image from "next/image";
import Avatar from "./Avatar";
import Card from "./Card";

export default function BusinessCard() {
    return (
        <Card showBottomGradient={true}>
            {/* 内容区域 */}
            <div className="flex flex-col items-center gap-6">
                {/* 头像区域 */}
                <div className="relative -mt-24">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
                        <Avatar src="/imgs/avatar.jpg" width={120} height={120} />
                    </div>
                </div>

                {/* 姓名 */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Azuxa616</h3>
                    <p className="text-sm text-gray-500">2226123739@qq.com</p>
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
        </Card>
    )
}