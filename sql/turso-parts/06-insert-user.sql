-- 插入管理员用户
-- 默认用户名: admin
-- 默认密码: admin
-- ⚠️ 警告：生产环境请务必修改默认密码！
INSERT OR IGNORE INTO users (id, username, password, last_login_at, created_at, updated_at) VALUES
('user-001', 'Azuxa', '$2a$12$ofq3QwMIsHQ3N7WXs0OX7u19kpB75NDae56Hyc04pAr.FOs4ihAve', NULL, '2025-10-09T00:00:00Z', '2025-11-05T00:00:00Z');