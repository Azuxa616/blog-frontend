import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from "@octokit/rest";
import { appConfig } from '@/lib/config/app';

export async function GET(req: NextRequest) {
  try {
    const username = appConfig.admin.githubName;
    const githubToken = process.env.GITHUB_TOKEN;

    // 详细的配置检查
    console.log('GitHub API 配置检查:', {
      username,
      hasToken: !!githubToken,
      tokenLength: githubToken?.length || 0,
      tokenPrefix: githubToken?.substring(0, 4) || 'N/A',
    });

    if (!username || username === 'your-github-name') {
      return NextResponse.json(
        { 
          error: 'GitHub 用户名未配置',
          hint: '请在环境变量中设置 GITHUB_NAME 或在 appConfig 中配置 githubName'
        },
        { status: 400 }
      );
    }

    if (!githubToken) {
      return NextResponse.json(
        { 
          error: 'GitHub Token 未配置',
          hint: '请在环境变量中设置 GITHUB_TOKEN'
        },
        { status: 500 }
      );
    }

    // 在使用时创建 Octokit 实例，确保环境变量已加载
    const octokit = new Octokit({
      auth: githubToken,
    });

    // 先获取用户信息
    let user;
    try {
      console.log(`正在获取 GitHub 用户信息: ${username}`);
      const userResponse = await octokit.rest.users.getByUsername({
        username,
      });
      user = userResponse.data;
      console.log('用户信息获取成功:', user.login);
    } catch (userError: any) {
      console.error('获取用户信息失败详情:', {
        status: userError.status,
        message: userError.message,
        request: userError.request,
        response: userError.response,
      });
      
      if (userError.status === 404) {
        return NextResponse.json(
          { 
            error: `GitHub 用户 "${username}" 不存在`,
            hint: '请检查用户名是否正确，GitHub 用户名区分大小写'
          },
          { status: 404 }
        );
      }
      
      if (userError.status === 401) {
        return NextResponse.json(
          { 
            error: 'GitHub Token 无效或已过期',
            hint: '请检查 GITHUB_TOKEN 是否正确，或生成新的 Personal Access Token'
          },
          { status: 401 }
        );
      }
      
      throw userError;
    }

    // 获取仓库列表
    let repos: any[] = [];
    try {
      console.log(`正在获取用户 ${username} 的仓库列表`);
      const reposResponse = await octokit.rest.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 6,
        type: 'all', // 获取所有类型的仓库（public, private等）
      });
      repos = reposResponse.data;
      console.log(`成功获取 ${repos.length} 个仓库`);
    } catch (reposError: any) {
      console.error('获取仓库列表失败详情:', {
        status: reposError.status,
        message: reposError.message,
      });
      // 如果获取仓库失败，只返回用户信息，不返回仓库
      // 这样至少可以显示用户信息
      if (reposError.status === 404) {
        console.warn('无法获取仓库列表，可能权限不足或用户没有仓库');
        // 继续执行，返回空数组
      } else if (reposError.status === 403) {
        console.warn('获取仓库列表被限制，可能 Token 权限不足');
        // 继续执行，返回空数组
      } else {
        // 对于其他错误，仍然抛出
        throw reposError;
      }
    }

    return NextResponse.json({
      user,
      repos,
    }, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: unknown) {
    console.error('获取 GitHub 数据失败:', error);
    
    // 更详细的错误信息
    let errorMessage = '获取 GitHub 数据失败';
    let statusCode = 500;
    
    if (error && typeof error === 'object' && 'status' in error) {
      statusCode = (error as any).status || 500;
      if (statusCode === 401) {
        errorMessage = 'GitHub Token 无效或已过期';
      } else if (statusCode === 403) {
        errorMessage = 'GitHub API 请求被限制，请稍后重试';
      } else if (statusCode === 404) {
        errorMessage = '请求的资源不存在';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
