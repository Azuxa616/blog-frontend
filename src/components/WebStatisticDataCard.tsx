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
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{title}</h3>

                {/* 统计数据网格 */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 文章数目 */}
                    <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                            文章数目
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                            {articleCount}
                        </span>
                    </div>

                    {/* 本站总字数 */}
                    <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                            本站总字数
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                            {totalWords}
                        </span>
                    </div>

                    {/* 本站访客数 */}
                    <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                            本站访客数
                        </span>
                        <span className="text-2xl font-bold text-purple-600">
                            {visitorCount}
                        </span>
                    </div>

                    {/* 本站总浏览量 */}
                    <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                        <span className="text-sm font-medium text-gray-600 mb-1">
                            本站总浏览量
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                            {totalViews}
                        </span>
                    </div>
                </div>

                {/* 最后更新时间 */}
                <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 mb-1">
                        最后更新时间
                    </span>
                    <span className="text-xl font-bold text-gray-700">
                        {lastUpdatedDays} 天前
                    </span>
                </div>
            </div>
        </Card>
    );
}
