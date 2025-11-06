import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

// 获取数据库 URL，支持 Turso 和本地 SQLite
const getDatabaseUrl = (): string => {
  const dbUrl = process.env.TURSO_DATABASE_URL;
  
  if (dbUrl) {
    return dbUrl;
  }
  
  // 默认使用本地 SQLite 文件
  const dbPath = path.join(process.cwd(), 'data', 'blog.db');
  return `file:${dbPath}`;
};

// 判断是否为 Turso 数据库（libsql:// 协议）
const isTursoDatabase = (url: string): boolean => {
  return url.startsWith('libsql://') || url.startsWith('libsqls://');
};

// 创建数据库客户端
const createDatabaseClient = () => {
  const dbUrl = getDatabaseUrl();

  if (isTursoDatabase(dbUrl)) {
    // 使用 Turso 云数据库
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!authToken) {
      throw new Error('DATABASE_AUTH_TOKEN 环境变量未设置，Turso 数据库需要认证令牌');
    }
    console.log('当前使用 Turso 云数据库');
    return createClient({
      url: dbUrl,
      authToken: authToken,
    });
  } else {
    // 使用本地 SQLite 文件
    console.log('当前使用本地 SQLite 文件');
    return createClient({
      url: dbUrl,
    });
  }
};

// 创建数据库客户端实例
const client = createDatabaseClient();

// 创建 Drizzle 实例
export const db = drizzle(client, { schema });

// 导出客户端以供其他用途
export { client };
