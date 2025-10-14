import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    showDecorativeBg?: boolean;//是否显示装饰性背景
    showBottomGradient?: boolean;//是否显示底部渐变
    maxWidth?: string;
    padding?: string;
}

export default function Card({
    children,
    className = "",
    showDecorativeBg = true,
    showBottomGradient = false,
    maxWidth = "max-w-sm",
    padding = "p-8"
}: CardProps) {
    return (
        <div className={`relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl ${padding} hover:shadow-2xl transition-all duration-300 ${className} ${maxWidth} mx-auto`}>
            {/* 装饰性背景元素 */}
            {showDecorativeBg && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 rounded-2xl"></div>
            )}
            {/* 内容区域 */}
            <div className={`relative flex `}>
                {children}
            </div>
            {/* 装饰性底部渐变 */}
            {showBottomGradient && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-b-2xl opacity-80"></div>
            )}
        </div>
    );
}
