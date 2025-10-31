import { BaseEntity } from './common';

// 用户相关类型 - 网站只有站长一个用户
export interface User extends BaseEntity {
  username: string;
  email: string;
  password?: string; // 只在创建时包含，查询时不返回
  avatar?: string;
  bio?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}


export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}
