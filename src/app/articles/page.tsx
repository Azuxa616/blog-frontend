import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ImageHeaderBar from "@/components/ImageHeaderBar";
import BlogItem from "@/app/articles/BlogItem";
import Card from "@/components/Card";
import CategoryFilter from "@/components/CategoryFilter";
import { storage } from "@/lib/storage";
import { Article, ArticleStatus } from "@/types/article";
import { Category } from "@/types/category";


// 前端显示用文章类型（适配标准 Article 类型）
interface ArticleWithDisplay extends Article {
  layout?: 'normal' | 'reverse';
  publishDate?: string;
}


type SortType = 'latest' | 'popular' | 'category';

interface ArticlesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: SortType;
    page?: string;
  }>;
}

type CategoryFilterType = string | 'all';

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    // 解析URL参数
    const params = await searchParams;
    const searchTerm = params.search || '';
    const selectedCategory = (params.category || 'all') as CategoryFilterType;
    const sortType = (params.sort || 'latest') as SortType;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));
    const articlesPerPage = 6;


    // 服务端数据获取
    const [articles, categoriesWithCount, totalCount] = await Promise.all([
        // 获取文章
        (async () => {
            const queryParams: any = {
                status: ArticleStatus.PUBLISHED,
                page: currentPage,
                limit: articlesPerPage,
            };

            // 添加搜索条件
            if (searchTerm) {
                queryParams.search = searchTerm;
            }

            // 添加分类筛选条件
            if (selectedCategory !== 'all') {
                queryParams.categoryId = selectedCategory;
            }

            // 根据排序类型设置参数
            switch (sortType) {
                case 'latest':
                    queryParams.sortBy = 'publishedAt';
                    queryParams.sortOrder = 'desc';
                    break;
                case 'popular':
                    queryParams.sortBy = 'viewCount';
                    queryParams.sortOrder = 'desc';
                    break;
                case 'category':
                    queryParams.sortBy = 'createdAt';
                    queryParams.sortOrder = 'asc';
                    break;
            }

            const result = await storage.getArticles(queryParams);
            return result.items.map((article: Article) => ({
                ...article,
                layout: Math.random() > 0.5 ? 'normal' : 'reverse' as 'normal' | 'reverse',
                publishDate: article.publishedAt,
            }));
        })(),

        // 获取分类及其文章数量
        (async () => {
            const categories = await storage.getCategories();
            // 为每个分类计算文章数量
            const categoriesWithCount = await Promise.all(
                categories.map(async (category) => {
                    const countResult = await storage.getArticles({
                        status: ArticleStatus.PUBLISHED,
                        categoryId: category.id
                    });
                    return {
                        ...category,
                        articleCount: countResult.pagination.total
                    };
                })
            );
            return categoriesWithCount;
        })(),

        // 获取总数
        (async () => {
            const queryParams: any = {
                status: ArticleStatus.PUBLISHED,
            };

            if (searchTerm) {
                queryParams.search = searchTerm;
            }

            // 添加分类筛选条件
            if (selectedCategory !== 'all') {
                queryParams.categoryId = selectedCategory;
            }

            console.log('queryParams', queryParams);
            const result = await storage.getArticles(queryParams);
            return result.pagination.total;
        })()
    ]);
    console.log('articles', articles);
    // 计算总页数
    const totalPages = Math.ceil(totalCount / articlesPerPage);

    // 构建URL参数的辅助函数
    const buildUrl = (updates: Partial<{
        search: string;
        category: string | 'all';
        sort: SortType;
        page: number;
    }>) => {
        const newParams = new URLSearchParams();

        const newSearch = updates.search !== undefined ? updates.search : searchTerm;
        const newSort = updates.sort !== undefined ? updates.sort : sortType;
        const newPage = updates.page !== undefined ? updates.page : (updates.search !== undefined || updates.category !== undefined || updates.sort !== undefined ? 1 : currentPage);

        if (newSearch) newParams.set('search', newSearch);
        // 只有当分类不是 'all' 时才添加到 URL 参数中
        if (newSort !== 'latest') newParams.set('sort', newSort);
        if (newPage > 1) newParams.set('page', newPage.toString());
        console.log('newParams', newParams.toString());
        return newParams.toString() ? `?${newParams.toString()}` : '';
    };

    return (
        <div className="min-h-screen bg-[#fffeee]">
            <ImageHeaderBar
                src="/imgs/index-bg-img-04.png"
                title="文章"
                subtitle="在这里你可以找到我所有的文章"
            />

            {/* 主内容区 */}
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* 侧边栏 */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="flex flex-col gap-6">
                            {/* 搜索框 */}
                            <Card>
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-bold text-gray-800">搜索文章</h3>
                                    <form method="GET" className="relative">
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="输入关键词搜索..."
                                            defaultValue={searchTerm}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button type="submit" className="absolute right-3 top-2.5" title="搜索">
                                            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                        {/* 保持其他参数 */}

                                        {sortType !== 'latest' && <input type="hidden" name="sort" value={sortType} />}
                                    </form>
                                </div>
                            </Card>

                            {/* 分类筛选器 */}
                            <CategoryFilter
                                categories={categoriesWithCount}
                                selectedCategory={selectedCategory}
                                searchTerm={searchTerm}
                                sortType={sortType}
                            />
                        </div>
                    </div>

                    {/* 主内容区 */}
                    <div className="flex-1">
                        {/* 结果统计 */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedCategory && selectedCategory !== 'all'
                                    ? categoriesWithCount.find(c => c.id === selectedCategory)?.name || selectedCategory
                                    : '所有文章'
                                }
                            </h2>
                            <p className="text-gray-600">
                                共找到 {articles.length} 篇文章
                                {searchTerm && `，包含关键词"${searchTerm}"`}
                            </p>
                        </div>

                {/* 文章列表 */}
                        <div className="flex flex-col gap-6 mb-8">
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <Link key={article.id} href={`/articles/${article.id}`}>
                                        <BlogItem
                                            coverImage={article.coverImage || ''}
                                            title={article.title}
                                            description={article.excerpt || '暂无摘要'}
                                            category={article.category?.name || '未分类'}
                                            publishDate={article.publishedAt || '未知时间'}
                                            viewCount={article.viewCount}
                                        />
                                    </Link>
                                ))
                            ) : (
                                <Card>
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">暂无文章</h3>
                                        <p className="text-gray-500">
                                            {searchTerm ? '没有找到匹配的文章，请尝试其他关键词' : '该分类下暂无文章'}
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* 分页 */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                {/* 上一页按钮 */}
                                {currentPage > 1 ? (
                                    <Link
                                        href={buildUrl({ page: currentPage - 1 })}
                                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        aria-label="上一页"
                                    >
                                        上一页
                                    </Link>
                                ) : (
                                    <span className="px-3 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed bg-gray-100 text-gray-400">
                                        上一页
                                    </span>
                                )}

                                {/* 页码按钮 - 简化版本 */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Link
                                            key={pageNum}
                                            href={buildUrl({ page: pageNum })}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                currentPage === pageNum
                                                    ? 'bg-[#254889] text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                            aria-label={`第 ${pageNum} 页`}
                                            aria-current={currentPage === pageNum ? 'page' : undefined}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}

                                {/* 下一页按钮 */}
                                {currentPage < totalPages ? (
                                    <Link
                                        href={buildUrl({ page: currentPage + 1 })}
                                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        aria-label="下一页"
                                    >
                                        下一页
                                    </Link>
                                ) : (
                                    <span className="px-3 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed bg-gray-100 text-gray-400">
                                        下一页
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}