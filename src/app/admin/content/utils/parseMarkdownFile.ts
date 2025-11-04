import matter from 'gray-matter';
import { ArticleStatus } from '@/types/article';

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
 * 验证并清理元数据
 */
function validateMetadata(key: string, value: any): any {
  switch (key) {
    case 'status':
      const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN'];
      return validStatuses.includes(value?.toUpperCase()) ? value.toUpperCase() : undefined;
    
    case 'publishedAt':
      if (typeof value === 'string' && new Date(value).toString() !== 'Invalid Date') {
        return value;
      }
      return undefined;
    
    case 'tags':
    case 'tagNames':
      return Array.isArray(value) ? value : (typeof value === 'string' ? value.split(',').map(t => t.trim()) : []);
    
    case 'viewCount':
      return typeof value === 'number' && value >= 0 ? value : undefined;
    
    case 'isRepost':
      return typeof value === 'boolean' ? value : undefined;
    
    default:
      return value;
  }
}

/**
 * 解析Markdown文件
 * @param file File对象
 * @param categoryId 分类ID（从拖拽目标传入）
 * @returns Promise解析后的文章数据
 */
export async function parseMarkdownFile(
  file: File,
  categoryId: string
): Promise<{
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: ArticleStatus;
  categoryId: string;
  tagNames?: string[];
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
}> {
  // 验证文件扩展名
  if (!file.name.toLowerCase().endsWith('.md')) {
    throw new Error('文件必须是Markdown格式（.md）');
  }

  // 读取文件内容
  const fileContent = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('文件读取失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取错误'));
    reader.readAsText(file);
  });

  // 解析Front Matter
  const parsed = matter(fileContent);
  const frontMatter = parsed.data;
  const content = parsed.content;

  // 验证并提取元数据
  const metadata: Record<string, any> = {};
  Object.entries(frontMatter).forEach(([key, value]) => {
    const validated = validateMetadata(key, value);
    if (validated !== undefined) {
      metadata[key] = validated;
    }
  });

  // 提取标题和slug
  const title = metadata.title || frontMatter.title || extractTitleFromFileName(file.name);
  const slug = metadata.slug || frontMatter.slug || generateSlugFromFileName(file.name);

  // 提取状态，默认为DRAFT
  const status = (metadata.status || frontMatter.status || ArticleStatus.DRAFT) as ArticleStatus;

  // 提取标签
  const tagNames = metadata.tagNames || metadata.tags || frontMatter.tagNames || frontMatter.tags || [];

  // 返回解析后的数据
  return {
    title,
    slug,
    content,
    excerpt: metadata.excerpt || frontMatter.excerpt,
    coverImage: metadata.coverImage || frontMatter.coverImage,
    status,
    categoryId,
    tagNames: Array.isArray(tagNames) ? tagNames : [],
    isRepost: metadata.isRepost || frontMatter.isRepost || false,
    originalAuthor: metadata.originalAuthor || frontMatter.originalAuthor,
    originalLink: metadata.originalLink || frontMatter.originalLink,
  };
}

