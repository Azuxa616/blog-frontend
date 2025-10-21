import { ApiResponse, PaginatedResponse } from './common';
import { User, LoginResponse, RegisterRequest, LoginRequest } from './auth';
import { Article, ArticleQueryParams, CreateArticleRequest, UpdateArticleRequest } from './article';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from './article';
// 评论相关类型已移除 - 评论系统使用第三方服务

// API 响应类型
export type AuthApiResponse = ApiResponse<LoginResponse>;
export type UserApiResponse = ApiResponse<User>;
export type ArticleApiResponse = ApiResponse<Article>;
export type ArticlesApiResponse = PaginatedResponse<Article>;
export type CategoryApiResponse = ApiResponse<Category>;
export type CategoriesApiResponse = ApiResponse<Category[]>;
// 评论相关API类型已移除 - 评论系统使用第三方服务

// API 请求类型
export type LoginApiRequest = LoginRequest;
export type RegisterApiRequest = RegisterRequest;
export type CreateArticleApiRequest = CreateArticleRequest;
export type UpdateArticleApiRequest = UpdateArticleRequest;
export type ArticleQueryApiRequest = ArticleQueryParams;
export type CreateCategoryApiRequest = CreateCategoryRequest;
export type UpdateCategoryApiRequest = UpdateCategoryRequest;
// 评论相关API请求类型已移除 - 评论系统使用第三方服务

// 导出所有类型
export * from './common';
export * from './auth';
export * from './article';
