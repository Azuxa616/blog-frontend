interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}: PaginationProps) {
    // 如果只有一页或没有页面，不显示分页
    if (totalPages <= 1) {
        return null;
    }

    // 计算显示的页码范围
    const getVisiblePages = () => {
        const delta = 2; // 当前页前后显示的页码数
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={`flex justify-center items-center gap-2 ${className}`}>
            {/* 上一页按钮 */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label="上一页"
            >
                上一页
            </button>

            {/* 页码按钮 */}
            {visiblePages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`dots-${index}`}
                            className="px-3 py-2 text-gray-500"
                        >
                            ...
                        </span>
                    );
                }

                const pageNumber = page as number;
                return (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNumber
                                ? 'bg-[#254889] text-white shadow-lg mt-[-10px]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-label={`第 ${pageNumber} 页`}
                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* 下一页按钮 */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label="下一页"
            >
                下一页
            </button>
        </div>
    );
}
