

interface DividerProps {
    className?: string;
    layout?: "horizontal" | "vertical";
    color?: string;
    thickness?: "thin" | "normal" | "thick" | number;
    children?: React.ReactNode;
}


export default function Divider({
    className = "",
    layout = "horizontal",
    color = "gray-300",
    thickness = "normal",
    children
}: DividerProps) {

    const getThicknessClasses = (thickness: "thin" | "normal" | "thick" | number, layout: "horizontal" | "vertical") => {
        if (typeof thickness === "number") {
            return layout === "horizontal"
                ? `h-[${thickness}px]`
                : `w-[${thickness}px]`;
        }

        const thicknessMap = {
            thin: layout === "horizontal" ? "h-px" : "w-px",
            normal: layout === "horizontal" ? "h-0.5" : "w-0.5",
            thick: layout === "horizontal" ? "h-1" : "w-1"
        };

        return thicknessMap[thickness];
    };

    if (children) {
        if (layout === "horizontal") {
            const thicknessClasses = getThicknessClasses(thickness, layout);
            return (
                <div className={`flex items-center w-full ${className}`}>
                    <div className={`flex-1 bg-${color} ${thicknessClasses}`} />
                    <div className="mx-4 text-gray-500 text-sm font-medium">
                        {children}
                    </div>
                    <div className={`flex-1 bg-${color} ${thicknessClasses}`} />
                </div>
            );
        } else {
            const thicknessClasses = getThicknessClasses(thickness, layout);
            return (
                <div className={`flex flex-col items-center h-full relative ${className}`}>
                    <div className={`flex-1 bg-${color} ${thicknessClasses} w-full`} />
                    <div className="my-4 text-gray-500 text-sm font-medium transform -rotate-90">
                        {children}
                    </div>
                    <div className={`flex-1 bg-${color} ${thicknessClasses} w-full`} />
                </div>
            );
        }
    }

    // 无内容时的原始渲染
    const thicknessClasses = getThicknessClasses(thickness, layout);
    const baseClasses = layout === "horizontal" ? "w-full" : "h-full";
    const classes = `bg-${color} ${thicknessClasses} ${baseClasses} ${className}`;

    return <div className={classes} />;
}