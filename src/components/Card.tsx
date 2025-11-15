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

    padding = "p-8"
}: CardProps) {
    return (
        <div className={`relative flex 
        bg-card-background  backdrop-blur-sm border 
         border-white/20 shadow-xl rounded-2xl ${padding} hover:shadow-2xl transition-all duration-300  ${className}`}>
            {/* 内容区域 */}
                {children}
        </div>
    );
}
