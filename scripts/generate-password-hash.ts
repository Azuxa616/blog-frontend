import bcrypt from 'bcryptjs';

/**
 * 生成密码哈希工具
 * 用于生成生产环境数据库初始化时需要的密码哈希值
 * 
 * 使用方法:
 *   npm run hash-password <你的密码>
 * 
 * 示例:
 *   npm run hash-password MySecurePassword123!
 */

async function generatePasswordHash() {
  // 从命令行参数获取密码
  const password = process.argv[2];
  
  if (!password) {
    console.error('\n❌ 错误: 未提供密码参数\n');
    console.error('用法: npm run hash-password <你的密码>');
    console.error('示例: npm run hash-password MySecurePassword123!\n');
    console.error('⚠️  注意: 密码包含特殊字符时，请使用引号包裹');
    console.error('   例如: npm run hash-password "My@Secure#Password123!"\n');
    process.exit(1);
  }

  // 使用与项目相同的加密轮数（默认12轮）
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  
  console.log('\n⏳ 正在生成密码哈希...');
  console.log(`   加密轮数: ${rounds}`);
  
  const hash = await bcrypt.hash(password, rounds);
  
  console.log('\n✅ 密码哈希生成成功！\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('原始密码:', password);
  console.log('哈希值:  ', hash);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('📝 现在请更新 sql/init.sql 文件，将以下内容替换第 135 行：\n');
  console.log('───────────────────────────────────────────────────────────');
  console.log(`INSERT OR IGNORE INTO users (id, username, password, last_login_at, created_at, updated_at) VALUES`);
  console.log(`('user-001', 'admin', '${hash}', NULL, datetime('now'), datetime('now'));`);
  console.log('───────────────────────────────────────────────────────────\n');
  
  console.log('⚠️  安全提示:');
  console.log('   - 请妥善保管此哈希值');
  console.log('   - 不要将包含真实密码的 .env 文件提交到代码仓库');
  console.log('   - 生产环境建议使用强密码（至少12位，包含大小写字母、数字、特殊字符）');
  console.log('   - 可以手动复制上面的 SQL 语句更新 init.sql 文件\n');
}

generatePasswordHash().catch((error) => {
  console.error('\n❌ 生成密码哈希失败:', error.message);
  console.error('\n请检查:');
  console.error('  1. 是否已安装 bcryptjs 依赖');
  console.error('  2. 密码参数是否正确提供\n');
  process.exit(1);
});

