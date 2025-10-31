import { BaseEntity } from './common';
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
  