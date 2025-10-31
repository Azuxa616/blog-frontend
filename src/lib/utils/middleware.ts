import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 响应工具类
export class ResponseUtils {
  static success<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message,
    });
  }

  static error(error: string, status: number = 400): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status }
    );
  }

  static notFound(message: string = '资源不存在'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 404 }
    );
  }

  static unauthorized(message: string = '未授权访问'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 401 }
    );
  }

  static forbidden(message: string = '禁止访问'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 403 }
    );
  }

  static serverError(message: string = '服务器错误'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// 分页工具类
export class PaginationUtils {
  static createPaginationResponse<T>(
    items: T[],
    page: number,
    limit: number,
    total: number
  ): {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } {
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}

// 日志工具
export class Logger {
  static logRequest(req: NextRequest, message: string): void {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    console.log(`[${timestamp}] ${method} ${url} - ${message}`);
  }

  static logError(error: Error, context?: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR${context ? ` [${context}]` : ''}:`, error);
  }
}

// 错误处理中间件
export function withErrorHandling(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      Logger.logError(error as Error, `${req.method} ${req.url}`);

      return ResponseUtils.serverError('服务器内部错误');
    }
  };
}

// 请求日志中间件
export function withLogging(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    Logger.logRequest(req, 'Incoming request');
    const response = await handler(req, ...args);
    Logger.logRequest(req, `Response: ${response.status}`);
    return response;
  };
}
