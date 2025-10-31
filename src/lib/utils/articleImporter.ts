import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleStatus, ArticleDefaults} from '@/types/article';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';
import { storage } from '@/lib/storage';

/**
 * 从文件名生成slug
 */
function generateSlugFromFileName(fileName: string): string {
  return fileName
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')  // 保留中文字符范围
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * 从文件名提取标题
 */
function extractTitleFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, '');
}

/**
 * 计算阅读时间（分钟）
 */
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200; // 平均每分钟阅读200字
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * 验证并清理元数据
 */
function validateMetadata(key: string, value: any): any {
  // 根据不同的字段进行验证
  switch (key) {
    case 'status':
      const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN'];
      return validStatuses.includes(value) ? value : undefined;
    
    case 'publishedAt':
      // 验证日期格式
      if (typeof value === 'string' && new Date(value).toString() !== 'Invalid Date') {
        return value;
      }
      return undefined;
    
    case 'tags':
      // 确保是数组
      return Array.isArray(value) ? value : undefined;

    case 'viewCount':
      // 确保是数字
      return typeof value === 'number' && value >= 0 ? value : undefined;
    
    case 'isRepost':
      // 确保是布尔值
      return typeof value === 'boolean' ? value : undefined;
    
    default:
      return value;
  }
}

/**
 * 创建默认分类（如果不存在）
 */
async function ensureDefaultCategory(name: string): Promise<string> {
  const categoryId = name.toLowerCase().replace(/\s+/g, '-');
  
  try {
    const existingCategory = await storage.getCategoryById(categoryId);
    if (existingCategory) {
      return categoryId;
    }
    
    // 创建新分类
    const category = await storage.createCategory({
      id: categoryId,
      name,
      slug: categoryId,
      description: `${name}分类`,
      color: '#3b82f6',
      articleCount: 0,
    });
    
    return category.id;
  } catch (error) {
    console.error(`创建分类失败: ${name}`, error);
    return categoryId;
  }
}

/**
 * 导入MD文件到数据库
 * @param filePath MD文件路径
 * @param defaults 默认元数据值
 * @returns 导入的文章
 */
export async function importArticleFromMarkdown(
  filePath: string,
  defaults: ArticleDefaults = {}
): Promise<Article> {
  // 读取文件内容
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  // 解析Front Matter
  const parsed = matter(fileContent);
  const frontMatter = parsed.data ;
  const content = parsed.content;
  
  // 合并元数据（优先级：文章自带 > 函数参数 > 默认值）
  const metadata: ArticleDefaults = {
    // 默认值
    ...defaults,
    
    // 函数参数（会覆盖默认值）
    ...defaults,
    
    // 文章自带的元数据（最高优先级）
    ...Object.entries(frontMatter).reduce((acc, [key, value]) => {
      const validated = validateMetadata(key, value);
      if (validated !== undefined) {
        acc[key] = validated;
      }
      return acc;
    }, {} as Record<string, any>),
  };
  
  // 确保必需字段存在
  const title = metadata.title || frontMatter.title || extractTitleFromFileName(fileName);
  const slug = metadata.slug || frontMatter.slug || generateSlugFromFileName(fileName);

  // 确保 author 是字符串
  let authorValue = metadata.author || frontMatter.author || defaults.author || 'Azx616';
  const author = typeof authorValue === 'string'
    ? authorValue
    : (typeof authorValue === 'object' && authorValue && 'username' in authorValue)
      ? (authorValue as any).username
      : 'Azx616';

  const status = (metadata.status || frontMatter.status || defaults.status || 'PUBLISHED') as ArticleStatus;
  
  // 生成文章ID
  const articleId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  // 处理分类 - 确保分类存在
  let categoryId = metadata.categoryId || frontMatter.categoryId || defaults.categoryId || '未分类';
  categoryId = await ensureDefaultCategory(categoryId);
  
  // 构建文章数据，确保所有字段都是SQLite支持的类型
  const articleData: Partial<Article & { tagNames?: string[] }> = {
    id: articleId,
    title,
    slug,
    content,
    excerpt: metadata.excerpt || frontMatter.excerpt || defaults.excerpt || null,
    coverImage: metadata.coverImage || frontMatter.coverImage || defaults.coverImage || null,
    status,
    publishedAt: typeof (metadata.publishedAt || frontMatter.publishedAt || defaults.publishedAt) === 'string'
      ? (metadata.publishedAt || frontMatter.publishedAt || defaults.publishedAt)
      : now,
    author: author,
    viewCount: metadata.viewCount || frontMatter.viewCount || defaults.viewCount || 0,
    categoryId,
    readTime: calculateReadTime(content),
    isRepost: Boolean(metadata.isRepost || frontMatter.isRepost || defaults.isRepost || false),
    originalAuthor: metadata.originalAuthor || frontMatter.originalAuthor || defaults.originalAuthor || null,
    originalLink: metadata.originalLink || frontMatter.originalLink || defaults.originalLink || null,
    tagNames: metadata.tagNames || frontMatter.tags || defaults.tagNames || [],
    createdAt: now,
    updatedAt: now,
  };

  // 写入数据库
  const article = await storage.createArticle(articleData);
  
  console.log(`✓ 导入文章: ${title} (${slug})`);
  
  return article;
}

/**
 * 批量导入文章
 */
export async function importArticlesFromDirectory(
  dirPath: string,
  defaults: ArticleDefaults = {}
): Promise<Article[]> {
  const files = await fs.readdir(dirPath);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  const articles: Article[] = [];
  
  for (const file of markdownFiles) {
    const filePath = path.join(dirPath, file);
    try {
      const article = await importArticleFromMarkdown(filePath, defaults);
      articles.push(article);
    } catch (error) {
      console.error(`导入失败: ${file}`, error);
    }
  }
  
  return articles;
}

