import Link from "next/link";
import ImageHeaderBar from "@/components/ImageHeaderBar";
import BlogItem from "@/app/articles/BlogItem";
import Card from "@/components/Card";
import CategoryFilter from "@/components/CategoryFilter";
import { storage } from "@/lib/storage";
import { ArticleStatus } from "@/types/article";

type SortType = "latest" | "popular" | "category";

interface ArticlesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: SortType;
    page?: string;
  }>;
}

type CategoryFilterType = string | "all";

interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: string;
  publishedAt?: string;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  tags?: string[];
  readTime?: number;
}

interface ArticleWithDisplay extends ArticleListItem {
  layout?: "normal" | "reverse";
}



function formatDateToISO(dateString?: string): string | undefined {
  if (!dateString) {
    return undefined;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().split("T")[0];
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const searchTerm = params.search || "";
  const selectedCategory = (params.category || "all") as CategoryFilterType;
  const sortType = (params.sort || "latest") as SortType;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const articlesPerPage = 6;

  // 构建查询参数
  let sortBy: "createdAt" | "publishedAt" | "viewCount" = "publishedAt";
  let sortOrder: "asc" | "desc" = "desc";

  switch (sortType) {
    case "latest":
      sortBy = "publishedAt";
      sortOrder = "desc";
      break;
    case "popular":
      sortBy = "viewCount";
      sortOrder = "desc";
      break;
    case "category":
      sortBy = "createdAt";
      sortOrder = "asc";
      break;
  }

  // 直接调用数据库获取文章列表
  const articlesResult = await storage.getArticles({
    status: ArticleStatus.PUBLISHED, // 只获取已发布的文章
    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchTerm || undefined,
    page: currentPage,
    limit: articlesPerPage,
    sortBy,
    sortOrder,
  });

  // 直接调用数据库获取分类列表
  const categories = await storage.getCategories();

  // 格式化文章数据
  const articles: ArticleWithDisplay[] = articlesResult.items.map((article) => {
    const publishDateValue = formatDateToISO(
      article.publishedAt || article.createdAt
    );

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      status: article.status.toLowerCase(),
      publishedAt: article.publishedAt || publishDateValue,
      publishDate: publishDateValue,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      viewCount: article.viewCount,
      categoryId: article.categoryId,
      category: article.category
        ? {
            id: article.category.id,
            name: article.category.name,
            color: article.category.color,
          }
        : undefined,
      tags: article.tags,
      readTime: article.readTime || (article.content ? Math.ceil(article.content.length / 400) : undefined),
      layout: Math.random() > 0.5 ? "normal" : "reverse",
    } as ArticleWithDisplay;
  });

  // 格式化分类数据 - 转换为 Category 类型并包含 articleCount
  const categoriesWithCount = categories.map((category) => ({
    ...category,
    articleCount: category.articleCount,
  }));

  const totalCount = articlesResult.pagination.total;

  const totalPages = articlesResult.pagination.totalPages;

  const buildUrl = (updates: Partial<{
    search: string;
    category: string | "all";
    sort: SortType;
    page: number;
  }>) => {
    const newParams = new URLSearchParams();

    const newSearch = updates.search !== undefined ? updates.search : searchTerm;
    const newSort = updates.sort !== undefined ? updates.sort : sortType;
    const newCategory =
      updates.category !== undefined ? updates.category : selectedCategory;
    const newPage =
      updates.page !== undefined
        ? updates.page
        : updates.search !== undefined ||
          updates.category !== undefined ||
          updates.sort !== undefined
        ? 1
        : currentPage;

    if (newSearch) newParams.set("search", newSearch);
    if (newCategory && newCategory !== "all") newParams.set("category", newCategory);
    if (newSort !== "latest") newParams.set("sort", newSort);
    if (newPage > 1) newParams.set("page", newPage.toString());

    return newParams.toString() ? `?${newParams.toString()}` : "";
  };

  return (
    <div className="min-h-screen bg-background">
      <ImageHeaderBar
        src="/imgs/index-bg-img-04.png"
        title="文章"
        subtitle="在这里你可以找到我所有的文章"
      />

      {/* 主内容区 */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏 */}
          <div className="flex flex-col gap-6 lg:w-80 flex-shrink-0">
            {/* 搜索框 */}
            <div className="flex flex-col gap-4">
              <form method="GET" className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="输入关键词搜索..."
                  defaultValue={searchTerm}
                  className="w-full px-4 py-2 
                                            border border-gray-200 rounded-lg bg-card-background
                                            focus:outline-none focus:ring-2 
                                            focus:ring-primary focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-2.5" title="搜索">
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {sortType !== "latest" && <input type="hidden" name="sort" value={sortType} />}
                {selectedCategory !== "all" && (
                  <input type="hidden" name="category" value={selectedCategory} />
                )}
              </form>
            </div>

            {/* 分类筛选器 */}
            <CategoryFilter
              categories={categoriesWithCount as any}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              sortType={sortType}
            />
          </div>

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 结果统计 */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedCategory && selectedCategory !== "all"
                  ? categoriesWithCount.find((c) => c.id === selectedCategory)?.name ||
                    selectedCategory
                  : "所有文章"}
              </h2>
              <p className="text-muted">
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
                      coverImage={article.coverImage || ""}
                      title={article.title}
                      description={article.excerpt || "暂无摘要"}
                      category={article.category?.name || "未分类"}
                      publishDate={
                        article.publishDate ||
                        article.publishedAt ||
                        article.createdAt ||
                        "未知时间"
                      }
                      viewCount={article.viewCount}
                    />
                  </Link>
                ))
              ) : (
                <Card>
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">暂无文章</h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? "没有找到匹配的文章，请尝试其他关键词"
                        : "该分类下暂无文章"}
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
                  const pageNumber = i + 1;
                  return (
                    <Link
                      key={pageNumber}
                      href={buildUrl({ page: pageNumber })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNumber
                          ? "bg-primary text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {pageNumber}
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
