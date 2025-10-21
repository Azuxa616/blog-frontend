import { BaseEntity } from './common';
import { User } from './auth';

// 文章相关类型
export interface Article extends BaseEntity {
  title: string;            //标题
  slug: string;             //slug
  content: string;          //内容
  excerpt?: string;         //摘要
  coverImage?: string;      //封面图片
  status: ArticleStatus;    //状态
  publishedAt?: string;     //发布时间 (ISO字符串格式)
  viewCount: number;        //浏览量
  likeCount: number;        //点赞数
  categoryId: string;       //分类ID
  tags?: string[];          //标签数组（简化版，去除了关联对象）
  readTime?: number;        //阅读时间

  // 转载相关字段
  isRepost?: boolean;       // 是否为转载文章
  originalAuthor?: string;  // 原作者姓名（转载时填写）
  originalLink?: string;    // 原文章链接（转载时填写）

  // 关联数据（仅在需要时加载）
  category?: Category;      //分类（可选，用于详情页显示）
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',//草稿
  PUBLISHED = 'PUBLISHED',//已发布
  ARCHIVED = 'ARCHIVED',//已归档
  HIDDEN = 'HIDDEN',//已隐藏
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  categoryId: string;
  tagIds?: string[];
  status?: ArticleStatus;

  // 转载相关字段
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  categoryId?: string;
  tagIds?: string[];
  status?: ArticleStatus;

  // 转载相关字段
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
}

export interface ArticleQueryParams {
  status?: ArticleStatus;
  categoryId?: string;
  tagId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

// 分类相关类型
export interface Category extends BaseEntity {
  name: string;                   //名称
  slug: string;                   //slug
  description?: string;           //描述
  color?: string;                 //颜色
  articleCount: number;           //文章数量
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// 标签相关类型
export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  color?: string;
  articleCount: number;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

// 评论相关类型已移除 - 评论系统使用第三方服务
