import { BaseEntity } from './common';
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
  