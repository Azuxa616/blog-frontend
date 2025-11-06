import type { Config } from 'drizzle-kit';
import path from 'path';

// 获取数据库 URL
const getDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl) {
    return dbUrl;
  }
  
  // 默认使用本地 SQLite 文件
  const dbPath = path.join(process.cwd(), 'data', 'blog.db');
  return `file:${dbPath}`;
};

const dbUrl = getDatabaseUrl();

// Drizzle Kit 配置
// 注意：对于 Turso，authToken 需要在运行时通过环境变量提供
// Drizzle Kit 只使用 url 进行连接
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbUrl,
  },
} satisfies Config;
