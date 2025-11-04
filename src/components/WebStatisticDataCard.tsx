import Card from "./Card";

interface WebStatisticDataCardProps {
    title?: string;
    articleCount?: number;
    totalWords?: string;
    visitorCount?: number;
    totalViews?: number;
    lastUpdatedDays?: number;
    className?: string;
}

export default function WebStatisticDataCard({
    title = "网站统计",
    articleCount = 4,
    totalWords = "2.6k",
    visitorCount = 10,
    totalViews = 34,
    lastUpdatedDays = 25,
    className = ""
}: WebStatisticDataCardProps) {
    return (
        <Card className={className}>
            <div className="flex flex-col gap-6 w-full">
                {/* 标题 */}
                <h3 className="text-2xl font-bold mb-2 text-center">{title}</h3>

                {/* 统计数据网格 */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 文章数目 */}
                    <div className="flex flex-col items-center p-4 rounded-xl text-blue-600">
                        <span className="text-1xl font-medium  mb-1">
                            文章数目
                        </span>
                        <span className="text-3xl font-bold ">
                            {articleCount}
                        </span>
                    </div>

                    {/* 本站总字数 */}
                    <div className="flex flex-col items-center p-4 rounded-xl text-green-600 ">
                        <span className="text-1xl font-medium mb-1">
                            本站总字数
                        </span>
                        <span className="text-3xl font-bold ">
                            {totalWords}
                        </span>
                    </div>

                    {/* 本站访客数 */}
                    <div className="flex flex-col items-center p-4 rounded-xl text-purple-600 ">
                        <span className="text-1xl font-medium  mb-1">
                            本站访客数
                        </span>
                        <span className="text-3xl font-bold ">
                            {visitorCount}
                        </span>
                    </div>

                    {/* 本站总浏览量 */}
                    <div className="flex flex-col items-center p-4 rounded-xl text-orange-600 ">
                        <span className="text-1xl font-medium  mb-1">
                            本站总浏览量
                        </span>
                        <span className="text-3xl font-bold ">
                            {totalViews}
                        </span>
                    </div>
                </div>

                {/* 最后更新时间 */}
                <div className="flex flex-col items-center p-4 rounded-xl text-gray-600     ">
                    <span className="text-1xl font-medium  mb-1">
                        最后更新时间
                    </span>
                    <span className="text-3xl font-bold ">
                        {lastUpdatedDays} 天前
                    </span>
                </div>
            </div>
        </Card>
    );
}
