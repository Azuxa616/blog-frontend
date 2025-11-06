-- 第一部分：删除现有表（如果存在）
-- Part 1: Drop existing tables (if exists)
-- ============================================
-- 注意：取消下面的注释以清空现有数据
-- Note: Uncomment below to clear existing data

DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ============================================