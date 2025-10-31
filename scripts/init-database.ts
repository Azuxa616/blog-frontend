import { db } from '../src/lib/db';
import { articles, categories, tags, articleTags } from '../src/lib/db/schema';
import path from 'path';

/**
 * 初始化数据库表结构
 */
async function initDatabase() {
  console.log('开始初始化数据库...');

  try {
    // 清除现有数据
    console.log('清除现有数据...');

    // 清空表数据（按依赖关系逆序）
    await db.run(`DELETE FROM article_tags`);
    await db.run(`DELETE FROM articles`);
    await db.run(`DELETE FROM categories`);
    await db.run(`DELETE FROM tags`);

    console.log('数据清除完成');

    // 创建分类表
    await db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT,
        article_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // 创建标签表
    await db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        color TEXT,
        article_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // 创建文章表
    await db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        status TEXT NOT NULL,
        published_at TEXT,
        author TEXT NOT NULL,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        category_id TEXT,
        read_time INTEGER,
        is_repost INTEGER DEFAULT 0,
        original_author TEXT,
        original_link TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // 创建文章标签关联表
    await db.run(`
      CREATE TABLE IF NOT EXISTS article_tags (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id),
        UNIQUE(article_id, tag_id)
      )
    `);

    // 创建索引
    await db.run(`CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug)`);
    await db.run(`CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status)`);
    await db.run(`CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS articles_published_idx ON articles(published_at)`);
    await db.run(`CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug)`);
    await db.run(`CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug)`);
    await db.run(`CREATE INDEX IF NOT EXISTS article_tags_article_idx ON article_tags(article_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON article_tags(tag_id)`);

    console.log('数据库表结构检查完成');
    console.log('已创建的表：');
    console.log('  - articles (文章表)');
    console.log('  - categories (分类表)');
    console.log('  - tags (标签表)');
    console.log('  - article_tags (文章标签关联表)');

    console.log('\n已创建的索引：');
    console.log('  - articles_slug_idx');
    console.log('  - articles_status_idx');
    console.log('  - articles_category_idx');
    console.log('  - articles_published_idx');
    console.log('  - categories_slug_idx');
    console.log('  - tags_slug_idx');
    console.log('  - article_tags_article_idx');
    console.log('  - article_tags_tag_idx');

    console.log('\n✅ 数据库初始化完成！');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

// 运行初始化
initDatabase()
  .then(() => {
    console.log('\n数据库初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  });

