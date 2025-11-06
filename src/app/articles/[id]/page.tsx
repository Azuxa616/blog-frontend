import { notFound } from "next/navigation";
import { renderMarkdownWithComponents } from "@/lib/utils/markdownRenderer/markdownRenderer";
import ImageHeaderBar from "@/components/ImageHeaderBar";
import ArticleActions from "./ArticleActions";
import { storage } from "@/lib/storage";

interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: string;
  publishedAt?: string;
  publishDate?: string;
  viewCount: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    color?: string;
  };
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
  readTime?: number;
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
}


export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 直接调用数据库获取文章详情
  const article = await storage.getArticleById(id);

  if (!article) {
    notFound();
  }

  // 增加浏览量（使用 try-catch 避免阻塞页面渲染）
  // 如果更新失败，不影响页面正常显示
  try {
    await storage.incrementViewCount(id);
  } catch (error) {
    // 静默处理错误，不影响页面渲染
    console.error('更新浏览量失败:', error);
  }

  // 获取分类信息（如果文章有分类）
  let category = article.category;
  if (!category && article.categoryId) {
    const categoryData = await storage.getCategoryById(article.categoryId);
    if (categoryData) {
      category = categoryData;
    }
  }

  const publishedAt = article.publishedAt || article.createdAt;
  const content = article.content || "";
  const author = article.author
    ? {
        username: article.author.username,
        avatar: article.author.avatar || "/imgs/avatar.jpg",
      }
    : { username: "Unknown", avatar: "/imgs/avatar.jpg" };

  const categoryDisplay = category
    ? {
        name: category.name,
        color: category.color || "#3b82f6",
      }
    : undefined;

  const readTime =
    article.readTime || (content ? Math.ceil(content.length / 400) : 1);

  return (
    <article className="min-h-screen bg-background">
      {/* 封面图片和标题 */}
      <ImageHeaderBar
        mode="article"
        src={article.coverImage || "/imgs/index-bg-img-04.png"}
        articleTitle={article.title}
        publishedAt={publishedAt}
        author={author}
        readTime={readTime}
        category={categoryDisplay}
      />

      {/* 文章内容 */}
      <div className="max-w-4xl mx-auto px-10 py-8 prose prose-lg bg-card-background bg-opacity-50">
        {renderMarkdownWithComponents(content)}
      </div>

      {/* 客户端交互功能（阅读进度条、回到顶部按钮等） */}
      <ArticleActions />
    </article>
  );
}
