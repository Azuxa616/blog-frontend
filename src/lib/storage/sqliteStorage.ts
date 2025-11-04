import { db } from '../db';
import { articles, categories, tags, articleTags, users } from '../db/schema';
import { eq, and, like, desc, asc, sql, or } from 'drizzle-orm';
import { Article, ArticleQueryParams } from '../../types/article';
import { Category } from '../../types/category';
import { Tag } from '../../types/tag';
import { User } from '../../types/auth';
import { hashPassword } from '../utils/auth';

// 辅助函数：从标签输入中提取标签名称数组
function extractTagNames(tagsInput: string[] | Tag[] | undefined): string[] {
  if (!tagsInput || tagsInput.length === 0) {
    return [];
  }

  return tagsInput.map((tag: any) =>
    typeof tag === 'string' ? tag : tag?.name || ''
  ).filter(Boolean);
}

// 类型转换辅助函数
function convertToArticle(dbArticle: any, tags: Tag[]): Article {
  return {
    ...dbArticle,
    excerpt: dbArticle.excerpt || undefined,
    coverImage: dbArticle.coverImage || undefined,
    publishedAt: dbArticle.publishedAt || undefined,
    readTime: dbArticle.readTime || undefined,
    originalAuthor: dbArticle.originalAuthor || undefined,
    originalLink: dbArticle.originalLink || undefined,
    tags: tags.map(t => t.name),
    author: typeof dbArticle.author === 'string' 
      ? { id: '', username: dbArticle.author, avatar: undefined }
      : dbArticle.author || { id: '', username: 'Unknown', avatar: undefined },
  } as Article;
}

function convertToCategory(dbCategory: any): Category {
  return {
    ...dbCategory,
    description: dbCategory.description || undefined,
    color: dbCategory.color || undefined,
  } as Category;
}

function convertToTag(dbTag: any): Tag {
  return {
    ...dbTag,
    color: dbTag.color || undefined,
  } as Tag;
}

/**
 * SQLite存储类
 * 使用Drizzle ORM操作SQLite数据库
 */
export class SQLiteStorage {
  // ==================== 文章相关方法 ====================

  /**
   * 根据ID获取文章
   */
  async getArticleById(id: string): Promise<Article | null> {
    const result = await db.select().from(articles).where(eq(articles.id, id));
    if (result.length === 0) return null;
    
    const article = result[0];
    const articleTags = await this.getArticleTags(id);
    
    return convertToArticle(article, articleTags);
  }

  /**
   * 根据slug获取文章
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug));
    if (result.length === 0) return null;
    
    const article = result[0];
    const articleTags = await this.getArticleTags(article.id);
    
    return convertToArticle(article, articleTags);
  }

  /**
   * 查询文章列表
   */
  async getArticles(params: ArticleQueryParams = {}) {
    // 构建查询条件
    const conditions = [];
    
    if (params.status) {
      conditions.push(eq(articles.status, params.status));
    }
    
    if (params.categoryId) {
      conditions.push(eq(articles.categoryId, params.categoryId));
    }
    
    if (params.search) {
      conditions.push(
        or(
          like(articles.title, `%${params.search}%`),
          like(articles.excerpt, `%${params.search}%`),
          like(articles.content, `%${params.search}%`)
        )!
      );
    }
    
    // 排序
    const sortField = params.sortBy || 'publishedAt';
    const sortOrder = params.sortOrder === 'desc' ? desc : asc;
    
    let orderByClause;
    switch (sortField) {
      case 'publishedAt':
        orderByClause = sortOrder(articles.publishedAt);
        break;
      case 'viewCount':
        orderByClause = sortOrder(articles.viewCount);
        break;
      default:
        orderByClause = sortOrder(articles.createdAt);
    }
    
    // 获取总数
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;
    
    // 分页
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    
    const results = await db
      .select()
      .from(articles)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
    
    // 为每篇文章获取标签
    const articlesWithTags = await Promise.all(
      results.map(async (article) => {
        const articleTags = await this.getArticleTags(article.id);
        return convertToArticle(article, articleTags);
      })
    );
    
    return {
      items: articlesWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 创建文章
   */
  async createArticle(data: Partial<Article> & { tagNames?: string[] }): Promise<Article> {
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const articleData = {
      id,
      title: data.title!,
      slug: data.slug!,
      content: data.content!,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      status: data.status!,
      publishedAt: data.publishedAt || null,
      author: typeof data.author === 'string' ? data.author : data.author?.username || 'Unknown',
      viewCount: data.viewCount || 0,
      categoryId: data.categoryId!,
      readTime: data.readTime || null,
      isRepost: data.isRepost || false,
      originalAuthor: data.originalAuthor || null,
      originalLink: data.originalLink || null,
      createdAt: now,
      updatedAt: now,
    };

    // 检查文章是否已存在
    const existing = await this.getArticleBySlug(data.slug!);
    if (existing) {
      // 如果存在，更新文章（不包含标签，避免重复设置）
      const { tagNames: _, tags: __, ...updateData } = data;
      return await this.updateArticle(existing.id, updateData);
    }

    // 插入文章数据到数据库
    await db.insert(articles).values(articleData);

    // 处理标签 - 统一转换为标签名称数组
    const tagNames = data.tagNames || extractTagNames(data.tags);

    if (tagNames.length > 0) {
      await this.setArticleTags(id, tagNames);
    }

    return convertToArticle(articleData, []);
  }

  /**
   * 更新文章
   */
  async updateArticle(id: string, updates: Partial<Article> & { tagNames?: string[] }): Promise<Article> {
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.content) updateData.content = updates.content;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt || null;
    if (updates.coverImage !== undefined) updateData.coverImage = updates.coverImage || null;
    if (updates.status) updateData.status = updates.status;
    if (updates.publishedAt !== undefined) updateData.publishedAt = updates.publishedAt || null;
    if (updates.categoryId) updateData.categoryId = updates.categoryId;
    if (updates.readTime !== undefined) updateData.readTime = updates.readTime || null;
    if (updates.isRepost !== undefined) updateData.isRepost = updates.isRepost;
    if (updates.originalAuthor !== undefined) updateData.originalAuthor = updates.originalAuthor || null;
    if (updates.originalLink !== undefined) updateData.originalLink = updates.originalLink || null;

    const result = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();

    if (result.length === 0) throw new Error('文章不存在');

    // 更新标签 - 只有当明确提供了标签时才更新
    if (updates.tagNames !== undefined || updates.tags !== undefined) {
      const tagNames = updates.tagNames || extractTagNames(updates.tags);
      if (tagNames.length > 0) {
        await this.setArticleTags(id, tagNames);
      }
    }

    const articleTags = await this.getArticleTags(id);
    return convertToArticle(result[0], articleTags);
  }

  /**
   * 删除文章
   */
  async deleteArticle(id: string): Promise<boolean> {
    // 先删除标签关联
    await db.delete(articleTags).where(eq(articleTags.articleId, id));
    
    // 再删除文章
    await db.delete(articles).where(eq(articles.id, id));
    return true;
  }

  /**
   * 增加浏览量
   */
  async incrementViewCount(id: string): Promise<Article | null> {
    const article = await this.getArticleById(id);
    if (!article) return null;

    const result = await db
      .update(articles)
      .set({ viewCount: article.viewCount + 1 })
      .where(eq(articles.id, id))
      .returning();

    if (result.length === 0) return null;

    const articleTags = await this.getArticleTags(id);
    return convertToArticle(result[0], articleTags);
  }

  /**
   * 获取文章统计信息
   */
  async getArticleStats() {
    const allArticles = await db.select().from(articles);
    
    return {
      total: allArticles.length,
      published: allArticles.filter(a => a.status === 'PUBLISHED').length,
      draft: allArticles.filter(a => a.status === 'DRAFT').length,
      archived: allArticles.filter(a => a.status === 'ARCHIVED').length,
    };
  }

  // ==================== 分类相关方法 ====================

  /**
   * 获取所有分类
   */
  async getCategories(): Promise<Category[]> {
    const result = await db.select().from(categories).orderBy(asc(categories.name));
    return result.map(convertToCategory);
  }

  /**
   * 根据ID获取分类
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    if (result.length === 0) return null;
    return convertToCategory(result[0]);
  }

  /**
   * 根据slug获取分类
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    if (result.length === 0) return null;
    return convertToCategory(result[0]);
  }

  /**
   * 创建分类
   */
  async createCategory(data: Partial<Category>): Promise<Category> {
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const categoryData = {
      id,
      name: data.name!,
      slug: data.slug!,
      description: data.description || null,
      color: data.color || null,
      articleCount: data.articleCount || 0,
      createdAt: now,
      updatedAt: now,
    };

    // 先检查分类是否已存在
    const existing = await this.getCategoryBySlug(data.slug!);
    if (existing) {
      return existing;
    }

    await db.insert(categories).values(categoryData);
    return convertToCategory(categoryData);
  }

  /**
   * 更新分类
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    if (updates.name) updateData.name = updates.name;
    if (updates.slug) updateData.slug = updates.slug;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.color !== undefined) updateData.color = updates.color || null;
    if (updates.articleCount !== undefined) updateData.articleCount = updates.articleCount;
    
    const result = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    
    if (result.length === 0) return null;
    return convertToCategory(result[0]);
  }

  /**
   * 删除分类
   */
  async deleteCategory(id: string): Promise<boolean> {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  // ==================== 标签相关方法 ====================

  /**
   * 获取所有标签
   */
  async getTags(): Promise<Tag[]> {
    const result = await db.select().from(tags).orderBy(asc(tags.name));
    return result.map(convertToTag);
  }

  /**
   * 根据ID获取标签
   */
  async getTagById(id: string): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.id, id));
    if (result.length === 0) return null;
    return convertToTag(result[0]);
  }

  /**
   * 根据slug获取标签
   */
  async getTagBySlug(slug: string): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.slug, slug));
    if (result.length === 0) return null;
    return convertToTag(result[0]);
  }

  /**
   * 创建标签
   */
  async createTag(data: Partial<Tag>): Promise<Tag> {
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const tagData = {
      id,
      name: data.name!,
      slug: data.slug!,
      color: data.color || null,
      articleCount: data.articleCount || 0,
      createdAt: now,
      updatedAt: now,
    };

    // 先检查标签是否已存在
    const existing = await this.getTagBySlug(data.slug!);
    if (existing) {
      return existing;
    }

    await db.insert(tags).values(tagData);
    return convertToTag(tagData);
  }

  /**
   * 获取文章的所有标签
   */
  async getArticleTags(articleId: string): Promise<Tag[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        color: tags.color,
        articleCount: tags.articleCount,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, articleId));
    
    return result.map(convertToTag);
  }

  /**
   * 设置文章的标签
   */
  async setArticleTags(articleId: string, tagNames: string[]): Promise<void> {
    // 先删除现有标签关联
    await db.delete(articleTags).where(eq(articleTags.articleId, articleId));

    // 获取或创建标签
    const tagIds: string[] = [];
    const uniqueTagIds = new Set<string>(); // 用于去重

    for (const tagName of tagNames) {
      const slug = this.generateSlug(tagName);

      // 查找是否存在该标签
      let tag = await this.getTagBySlug(slug);

      if (!tag) {
        // 创建新标签
        tag = await this.createTag({
          name: tagName,
          slug,
          articleCount: 0,
        });
      }

      // 确保不重复添加相同的 tagId
      if (!uniqueTagIds.has(tag.id)) {
        uniqueTagIds.add(tag.id);
        tagIds.push(tag.id);
      }
    }

    // 创建文章标签关联
    const now = new Date().toISOString();
    for (const tagId of tagIds) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(articleTags).values({
        id,
        articleId,
        tagId,
        createdAt: now,
      });
    }
  }

  /**
   * 生成slug
   */
  private generateSlug(text: string): string {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-\u4e00-\u9fa5]/g, '') // 保留中文字符范围 \u4e00-\u9fa5
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);

    // 如果 slug 为空（比如纯中文没有分隔符），使用标签名的 hash 值作为后备
    if (!slug) {
      // 简单 hash 函数
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
      }
      return Math.abs(hash).toString(36);
    }

    return slug;
  }

  // ==================== 用户相关方法 ====================

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (result.length === 0) return null;
    
    const dbUser = result[0];
    return {
      id: dbUser.id,
      username: dbUser.username,
      email: '', // 简化用户表，不需要email字段
      isActive: true,
      lastLoginAt: dbUser.lastLoginAt ? new Date(dbUser.lastLoginAt) : undefined,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };
  }

  /**
   * 获取用户密码哈希（用于验证）
   */
  async getUserPasswordHash(username: string): Promise<string | null> {
    const result = await db.select({ password: users.password })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return result.length > 0 ? result[0].password : null;
  }

  /**
   * 创建用户
   */
  async createUser(username: string, password: string): Promise<User> {
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      id,
      username,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id,
      username,
      email: '',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * 更新密码
   */
  async updatePassword(username: string, newPassword: string): Promise<void> {
    const passwordHash = await hashPassword(newPassword);
    const now = new Date().toISOString();

    await db.update(users)
      .set({
        password: passwordHash,
        updatedAt: now,
      })
      .where(eq(users.username, username));
  }

  /**
   * 更新最后登录时间
   */
  async updateLastLogin(username: string): Promise<void> {
    const now = new Date().toISOString();

    await db.update(users)
      .set({
        lastLoginAt: now,
        updatedAt: now,
      })
      .where(eq(users.username, username));
  }

  /**
   * 检查用户是否存在
   */
  async userExists(username: string): Promise<boolean> {
    const result = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return result.length > 0;
  }
}

/**
 * 创建SQLite存储实例
 */
export function createSQLiteStorage(): SQLiteStorage {
  return new SQLiteStorage();
}
