-- 插入文章标签关联数据
-- 文章 1 (TailwindCSS) 的标签
INSERT OR IGNORE INTO article_tags (id, article_id, tag_id, created_at) VALUES
('at-001', 'article-001', 'tag-001', '2025-01-01T00:00:00Z'), -- CSS
('at-002', 'article-001', 'tag-002', '2025-01-01T00:00:00Z'), -- TailwindCSS
('at-003', 'article-001', 'tag-003', '2025-01-01T00:00:00Z'), -- 前端开发
('at-004', 'article-001', 'tag-004', '2025-01-01T00:00:00Z'); -- 框架

-- 文章 2 (Markdown 测试) 的标签
INSERT OR IGNORE INTO article_tags (id, article_id, tag_id, created_at) VALUES
('at-005', 'article-002', 'tag-005', '2025-01-01T00:00:00Z'), -- Markdown
('at-006', 'article-002', 'tag-006', '2025-01-01T00:00:00Z'); -- 测试

-- ============================================
-- 第五部分：完成提示
-- Part 5: Completion message
-- ============================================

-- 数据库初始化完成！
-- Database initialization completed!

-- 默认管理员账号信息：
-- Default admin account:
--   用户名 / Username: admin
--   密码 / Password: admin
--   ⚠️ 警告：生产环境请务必修改默认密码！
--   ⚠️ Warning: Please change the default password in production!

-- 已创建的初始数据：
-- Initial data created:
--   - 5 个分类 / 5 categories
--   - 6 个标签 / 6 tags
--   - 1 个管理员用户 / 1 admin user
--   - 2 篇示例文章 / 2 sample articles