import { NextResponse } from 'next/server';

// 健康检查API
export async function GET() {
  try {
    // 检查服务器基本状态
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(healthCheck);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
