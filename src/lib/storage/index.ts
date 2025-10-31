// SQLite存储服务入口文件
// 使用SQLite + Drizzle ORM作为主要存储方式

// 导出SQLite存储
export { SQLiteStorage, createSQLiteStorage } from './sqliteStorage';

// 创建统一的存储实例
import { createSQLiteStorage } from './sqliteStorage';

// 导出一个默认的存储实例
export const storage = createSQLiteStorage();

// 导出articleStorage（保持向后兼容）
export const articleStorage = {
  findAll: async () => {
    const result = await storage.getArticles({});
    return result.items;
  },
  
  findById: async (id: string) => {
    return await storage.getArticleById(id);
  },
  
  findBySlug: async (slug: string) => {
    return await storage.getArticleBySlug(slug);
  },
  
  findMany: async (params: any = {}) => {
    return await storage.getArticles(params);
  },
  
  create: async (data: any) => {
    return await storage.createArticle(data);
  },

  update: async (id: string, updates: any) => {
    return await storage.updateArticle(id, updates);
  },
  
  delete: async (id: string) => {
    return await storage.deleteArticle(id);
  },
  
  incrementViewCount: async (id: string) => {
    return await storage.incrementViewCount(id);
  },
  
  getStats: async () => {
    return await storage.getArticleStats();
  },
  
  initialize: async () => {
    // SQLite初始化在db/index.ts中完成
    return Promise.resolve();
  },
};

// 导出categoryStorage（保持向后兼容）
export const categoryStorage = {
  findAll: async () => {
    return await storage.getCategories();
  },
  
  findById: async (id: string) => {
    return await storage.getCategoryById(id);
  },
  
  findBySlug: async (slug: string) => {
    return await storage.getCategoryBySlug(slug);
  },
  
  getStats: async () => {
    const categories = await storage.getCategories();
    return {
      total: categories.length,
    };
  },
  
  initialize: async () => {
    return Promise.resolve();
  },
};

// 初始化存储服务
export async function initializeStorage(): Promise<void> {
  // SQLite数据库已在db/index.ts中初始化
  console.log('SQLite存储已初始化');
}
