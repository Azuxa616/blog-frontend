import { notFound } from 'next/navigation';
import { renderMarkdownWithComponents } from '@/lib/utils/markdownRenderer/markdownRenderer';
import ImageHeaderBar from '@/components/ImageHeaderBar';
import { storage } from '@/lib/storage';
import { Article } from '@/types/article';
import ArticleActions from './ArticleActions';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 直接调用storage方法，服务器端执行，无HTTP开销
  const article = await storage.getArticleById(id);
  console.log('article', article);
  if (!article) {
    notFound();
  }

  // 处理author字段，确保符合ImageHeaderBar的要求
  const author = article.author 
    ? { username: article.author.username, avatar: article.author.avatar || '/imgs/avatar.jpg' }
    : { username: 'Unknown', avatar: '/imgs/avatar.jpg' };

  // 处理category字段，确保符合ImageHeaderBar的要求
  const category = article.category 
    ? { name: article.category.name, color: article.category.color || '#3b82f6' }
    : undefined;

  return (
    <article className="min-h-screen bg-background">
      {/* 封面图片和标题 */}
      <ImageHeaderBar
        mode="article"
        src={article.coverImage || '/imgs/index-bg-img-04.png'}
        articleTitle={article.title}
        publishedAt={article.publishedAt}
        author={author}
        readTime={article.readTime || Math.ceil(article.content.length / 400)}
        category={category}
      />

      {/* 文章内容 */}
      <div className="max-w-4xl mx-auto px-10 py-8 prose prose-lg bg-card-background bg-opacity-50">
          {renderMarkdownWithComponents(article.content)}
      </div>

      {/* 客户端交互功能（阅读进度条、回到顶部按钮等） */}
      <ArticleActions />
    </article>
  );
}
