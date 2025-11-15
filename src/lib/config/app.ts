// 应用配置文件
export const appConfig = {
  // 应用基本信息
  app: {
    name: 'Azuxa\'s BlogSpace',
    description: '一个现代化的全栈个人博客系统',
    version: process.env.APP_VERSION || "未知版本",
    author: process.env.AUTHOR || "站长",
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  // 站长账号设置
  
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin',
    // 清理 GitHub 用户名：去除引号、冒号和空格
    githubName: process.env.GITHUB_NAME 
      ? process.env.GITHUB_NAME.trim().replace(/^[:"]+|[:"]+$/g, '').trim()
      : 'your-github-name',
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'azuxa-blog-azuxa-jwt-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'azuxa-blog-azuxa-jwt-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // 文件上传配置
  upload: {
    dir: process.env.UPLOAD_DIR || './public/uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
  },

  // 邮件配置
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.FROM_EMAIL || 'noreply@azuxa.com',
    fromName: process.env.FROM_NAME || 'Azuxa\'s BlogSpace',
  },

  // 安全配置
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // 分页配置
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },


  // 第三方服务配置
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },

  // 开发环境配置
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
