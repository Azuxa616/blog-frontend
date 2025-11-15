import { BaseEntity } from './common';
import { Category } from './category';
import { Tag } from './tag';

// 文章相关类型

/**
 * 文章元数据默认值接口
 * 用于文章导入时的默认值设置
 */
export interface ArticleDefaults {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  status?: ArticleStatus;
  publishedAt?: string;
  author?: string;
  tagNames?: string[];  // 标签名称数组（用于导入时的默认标签）
  categoryId?: string;
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
  viewCount?: number;
}
export interface Article extends BaseEntity {
  title: string;            //标题
  slug: string;             //slug
  content: string;          //内容
  excerpt?: string;         //摘要
  coverImage?: string;      //封面图片
  status: ArticleStatus;    //状态
  publishedAt?: string;     //发布时间 (ISO字符串格式)
  viewCount: number;        //浏览量
  categoryId: string;       //分类ID
  tags?: string[];       //标签名称数组
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
  tagNames?: string[];
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
  tagNames?: string[];
  status?: ArticleStatus;
  author?: string;

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
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}
