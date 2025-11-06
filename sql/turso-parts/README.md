# Turso 数据库初始化指南

## 问题说明

Turso 网页控制台在执行大型 SQL 文件时可能会遇到解析错误，特别是包含特殊字符（如颜色值中的 `#`）的语句。

## 解决方案

已将此 SQL 文件分割为多个小文件，请按顺序在 Turso 网页控制台中执行：

1. `01-drop-tables.sql` - 删除现有表（如果存在）
2. `02-create-tables.sql` - 创建表结构
3. `03-create-indexes.sql` - 创建索引
4. `04-insert-categories.sql` - 插入分类数据
5. `05-insert-tags.sql` - 插入标签数据
6. `06-insert-user.sql` - 插入管理员用户
7. `07-insert-articles.sql` - 插入示例文章
8. `08-insert-article-tags.sql` - 插入文章标签关联数据

## 执行步骤

1. 登录 Turso 网页控制台
2. 选择你的数据库
3. 打开 "SQL Editor" 或 "Query" 标签
4. 按顺序复制每个分段文件的内容并执行
5. 每个分段执行成功后，再执行下一个

## 替代方案：使用 Turso CLI

如果你安装了 Turso CLI，可以使用以下命令一次性执行：

```bash
# 安装 Turso CLI（如果还没有）
# macOS/Linux: curl -sSfL https://get.turso.tech/install.sh | bash
# Windows: 使用 WSL 或下载二进制文件

# 执行 SQL 文件
turso db shell <your-database-name> < sql/init.sql
```

## 注意事项

- 确保按顺序执行分段文件
- 如果某个分段执行失败，检查错误信息并修复后重试
- 颜色值中的 `#` 符号在 SQLite 中是合法的，但 Turso 网页控制台可能有解析限制
