import Database from 'better-sqlite3';
import path from 'path';
import { storage } from '../src/lib/storage';
import { appConfig } from '../src/lib/config/app';

/**
 * 初始化数据库表结构
 */
async function initDatabase() {
  console.log('开始初始化数据库...');

  try {
    // 获取数据库连接
    const dbPath = path.join(process.cwd(), 'data', 'blog.db');
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');

    // 清除现有数据（可选，仅在需要时启用）
    // console.log('清除现有数据...');
    // sqlite.exec(`DELETE FROM article_tags`);
    // sqlite.exec(`DELETE FROM articles`);
    // sqlite.exec(`DELETE FROM categories`);
    // sqlite.exec(`DELETE FROM tags`);
    // console.log('数据清除完成');

    // 创建分类表
    sqlite.exec(`
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
    sqlite.exec(`
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
    sqlite.exec(`
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
    sqlite.exec(`
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

    // 创建用户表
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        last_login_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // 创建索引
    sqlite.exec(`CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS articles_published_idx ON articles(published_at)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS article_tags_article_idx ON article_tags(article_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON article_tags(tag_id)`);
    sqlite.exec(`CREATE INDEX IF NOT EXISTS users_username_idx ON users(username)`);

    sqlite.close();

    console.log('数据库表结构检查完成');
    console.log('已创建的表：');
    console.log('  - articles (文章表)');
    console.log('  - categories (分类表)');
    console.log('  - tags (标签表)');
    console.log('  - article_tags (文章标签关联表)');
    console.log('  - users (用户表)');

    console.log('\n已创建的索引：');
    console.log('  - articles_slug_idx');
    console.log('  - articles_status_idx');
    console.log('  - articles_category_idx');
    console.log('  - articles_published_idx');
    console.log('  - categories_slug_idx');
    console.log('  - tags_slug_idx');
    console.log('  - article_tags_article_idx');
    console.log('  - article_tags_tag_idx');
    console.log('  - users_username_idx');

    // 初始化管理员用户
    console.log('\n检查管理员用户...');
    const adminUsername = appConfig.admin.username;
    const adminPassword = appConfig.admin.password;
    console.log('adminUsername:', adminUsername, 'adminPassword:', adminPassword);//debug
    const userExists = await storage.userExists(adminUsername);
    if (userExists) {
      console.log(`✅ 管理员用户 "${adminUsername}" 已存在`);
    } else {
      console.log(`创建管理员用户 "${adminUsername}"...`);
      await storage.createUser(adminUsername, adminPassword);
      console.log(`✅ 管理员用户 "${adminUsername}" 创建成功`);
      console.log(`   默认密码: ${adminPassword}`);
      console.log(`   ⚠️  请在生产环境中修改默认密码！`);
    }

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

