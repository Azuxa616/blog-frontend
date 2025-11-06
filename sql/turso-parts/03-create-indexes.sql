-- 第三部分：创建索引
-- Part 3: Create indexes
-- ============================================

CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category_id);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles(published_at);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);
CREATE INDEX IF NOT EXISTS article_tags_article_idx ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON article_tags(tag_id);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

-- ============================================