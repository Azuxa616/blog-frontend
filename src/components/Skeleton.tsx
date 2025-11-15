import { cn } from "@/lib/utils";

// 基础骨架屏盒子组件
interface SkeletonBoxProps {
  className?: string;
  variant?: "default" | "circular" | "rounded";
}

export const SkeletonBox = ({ className = "", variant = "default" }: SkeletonBoxProps) => {
  const variantClasses = {
    default: "rounded",
    circular: "rounded-full",
    rounded: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200/60 dark:bg-slate-700/60",
        variantClasses[variant],
        className
      )}
    />
  );
};

// 文本骨架屏组件
interface SkeletonTextProps {
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

export const SkeletonText = ({
  width = "w-full",
  height = "h-4",
  className = "",
  lines = 1,
}: SkeletonTextProps) => {
  if (lines === 1) {
    return <SkeletonBox className={cn(width, height, className)} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={cn(
            width,
            height,
            index === lines - 1 && "w-3/4", // 最后一行通常较短
            className
          )}
        />
      ))}
    </div>
  );
};

// 头像骨架屏组件
interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const SkeletonAvatar = ({ size = "md", className = "" }: SkeletonAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-32 h-32",
  };

  return <SkeletonBox variant="circular" className={cn(sizeClasses[size], className)} />;
};

// 卡片骨架屏组件
interface SkeletonCardProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
}

export const SkeletonCard = ({
  className = "",
  showHeader = true,
  showFooter = false,
  lines = 3,
}: SkeletonCardProps) => {
  return (
    <div className={cn("rounded-2xl border border-slate-100/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80", className)}>
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <SkeletonText width="w-32" height="h-5" />
          <SkeletonText width="w-16" height="h-3" />
        </div>
      )}
      <div className="space-y-2">
        <SkeletonText lines={lines} />
      </div>
      {showFooter && (
        <div className="mt-4 flex gap-2">
          <SkeletonText width="w-20" height="h-3" />
          <SkeletonText width="w-20" height="h-3" />
        </div>
      )}
    </div>
  );
};

// 热力图骨架屏组件
interface SkeletonHeatmapProps {
  weeks?: number;
  daysPerWeek?: number;
}

export const SkeletonHeatmap = ({ weeks = 6, daysPerWeek = 7 }: SkeletonHeatmapProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={`skeleton-week-${weekIndex}`} className="flex flex-col gap-1">
          {Array.from({ length: daysPerWeek }).map((_, dayIndex) => (
            <SkeletonBox key={`skeleton-day-${dayIndex}`} className="h-3.5 w-3.5 rounded-sm" />
          ))}
        </div>
      ))}
    </div>
  );
};

// 统计卡片骨架屏组件
interface SkeletonStatCardProps {
  className?: string;
}

export const SkeletonStatCard = ({ className = "" }: SkeletonStatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/50 bg-white/80 p-4 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60",
        className
      )}
    >
      <SkeletonText width="w-24" height="h-3" className="mx-auto" />
      <SkeletonText width="w-16" height="h-8" className="mt-2 mx-auto" />
      <SkeletonText width="w-20" height="h-3" className="mt-1 mx-auto" />
    </div>
  );
};

