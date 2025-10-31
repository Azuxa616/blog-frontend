import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';

/**
 * 文章元数据接口
 */
export interface ArticleMetadata {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'HIDDEN';
  publishedAt?: string;
  author: string;
  tags?: string[];
  categoryPath: string;
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
  viewCount?: number;
}

/**
 * 解析后的文章数据
 */
export interface ParsedArticle {
  metadata: ArticleMetadata;
  content: string;
  frontMatter: Record<string, any>;
}

/**
 * 解析Markdown文件
 * @param filePath 文件路径
 * @returns 解析后的文章数据
 */
export async function parseMarkdownFile(filePath: string): Promise<ParsedArticle> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsed = matter(fileContent);

  // 验证必需的元数据字段
  const metadata = parsed.data as ArticleMetadata;
  
  if (!metadata.title || !metadata.slug || !metadata.author || !metadata.categoryPath) {
    throw new Error(`文件 ${filePath} 缺少必需的元数据字段`);
  }

  return {
    metadata,
    content: parsed.content,
    frontMatter: parsed.data,
  };
}

/**
 * 从文件路径提取分类路径
 * @param filePath 文件完整路径
 * @param articlesDir 文章目录根路径
 * @returns 分类路径字符串
 */
export function extractCategoryPathFromFilePath(filePath: string, articlesDir: string): string {
  const relativePath = path.relative(articlesDir, filePath);
  const dirPath = path.dirname(relativePath);
  
  // 如果是根目录下的文件，返回空字符串
  if (dirPath === '.' || dirPath === '') {
    return '';
  }
  
  // 统一使用正斜杠作为分隔符
  return dirPath.replace(/\\/g, '/');
}

/**
 * 生成分类ID
 * @param categoryPath 分类路径
 * @returns 分类ID
 */
export function generateCategoryId(categoryPath: string): string {
  if (!categoryPath || categoryPath === '.') return 'root';
  
  // 先统一路径分隔符
  const normalizedPath = categoryPath.replace(/\\/g, '/');
  
  return normalizedPath
    .split('/')
    .filter(part => part && part !== '.')
    .map(part => {
      // 对于中文，保留原样；对于英文，转小写并用连字符分隔
      // 简单的处理：保留所有字符，只转换空格为连字符
      return part
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    })
    .join('/');
}

/**
 * 提取父分类ID
 * @param categoryId 当前分类ID
 * @returns 父分类ID
 */
export function getParentCategoryId(categoryId: string): string | null {
  if (categoryId === 'root') return null;
  
  const parts = categoryId.split('/');
  if (parts.length <= 1) return 'root';
  
  return parts.slice(0, -1).join('/');
}

/**
 * 写入Markdown文件（包含Front Matter）
 * @param filePath 文件路径
 * @param metadata 元数据
 * @param content 内容
 */
export async function writeMarkdownFile(
  filePath: string,
  metadata: ArticleMetadata,
  content: string
): Promise<void> {
  const frontMatter = `---
${Object.entries(metadata)
  .map(([key, value]) => {
    if (value === undefined || value === null) return '';
    if (Array.isArray(value)) {
      return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
    }
    return `${key}: ${value}`;
  })
  .filter(line => line !== '')
  .join('\n')}
---

${content}`;

  await fs.writeFile(filePath, frontMatter, 'utf-8');
}

