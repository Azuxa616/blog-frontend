import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'data', 'blog.db');

// 创建SQLite数据库连接
const sqlite = new Database(dbPath);

// 启用WAL模式以提高并发性能
sqlite.pragma('journal_mode = WAL');

// 创建Drizzle实例
export const db = drizzle(sqlite, { schema });

// 导出schema类型
export type { Database } from 'better-sqlite3';
export { sqlite };
