import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 分类表
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  color: text('color'),
  articleCount: integer('article_count').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 标签表
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  color: text('color'),
  articleCount: integer('article_count').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 文章表
export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  status: text('status').notNull(), // 'DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN'
  publishedAt: text('published_at'),
  author: text('author').notNull(),
  viewCount: integer('view_count').default(0),
  categoryId: text('category_id').references(() => categories.id),
  readTime: integer('read_time'),
  isRepost: integer('is_repost', { mode: 'boolean' }).default(false),
  originalAuthor: text('original_author'),
  originalLink: text('original_link'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 文章标签关联表
export const articleTags = sqliteTable('article_tags', {
  id: text('id').primaryKey(),
  articleId: text('article_id').references(() => articles.id).notNull(),
  tagId: text('tag_id').references(() => tags.id).notNull(),
  createdAt: text('created_at').notNull(),
});

// 用户表（仅站长）
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(), // bcrypt加密后的密码
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 索引
export const articlesSlugIdx = sql`CREATE INDEX articles_slug_idx ON articles(slug)`;
export const articlesStatusIdx = sql`CREATE INDEX articles_status_idx ON articles(status)`;
export const articlesCategoryIdx = sql`CREATE INDEX articles_category_idx ON articles(category_id)`;
export const articlesPublishedIdx = sql`CREATE INDEX articles_published_idx ON articles(published_at)`;
export const categoriesSlugIdx = sql`CREATE INDEX categories_slug_idx ON categories(slug)`;
export const tagsSlugIdx = sql`CREATE INDEX tags_slug_idx ON tags(slug)`;
export const articleTagsArticleIdx = sql`CREATE INDEX article_tags_article_idx ON article_tags(article_id)`;
export const articleTagsTagIdx = sql`CREATE INDEX article_tags_tag_idx ON article_tags(tag_id)`;
export const usersUsernameIdx = sql`CREATE INDEX users_username_idx ON users(username)`;
