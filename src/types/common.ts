// 通用类型定义
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 基础分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 搜索参数
export interface SearchParams {
  search?: string;
}

// 文件上传响应
export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    width?: number;
    height?: number;
    mimeType: string;
  };
  error?: string;
}

// 健康检查响应
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  database?: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  storage?: {
    status: 'ok' | 'error';
    totalArticles?: number;
    totalCategories?: number;
  };
}
