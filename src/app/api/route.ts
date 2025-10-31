import { NextResponse } from 'next/server';
import {appConfig} from '../../lib/config/app';
// 根路径问候API
export async function GET() {
  return NextResponse.json({
    message: `欢迎使用 ${appConfig.app.name} API!`,
    version: appConfig.app.version,
    author: appConfig.app.author,
    timestamp: new Date().toISOString(),
  });
}
