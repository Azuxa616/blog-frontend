import path from 'path';
import { importArticleFromMarkdown } from '../src/lib/utils/articleImporter';
import { ArticleStatus } from '../src/types/article';

/**
 * 导入示例文章到数据库
 */
async function importSampleArticles() {
  console.log('开始导入示例文章...\n');

  const articlesDir = path.join(process.cwd(), 'data', 'file', 'articles');

  // 默认元数据
  const defaults = {
    author: 'Azuxa616',
    status: ArticleStatus.PUBLISHED,
    isRepost: false,
    viewCount: 0,
  };

  try {
    // 1. 导入包含元数据的文章（TailwindCSS常用类目.md）
    console.log('1. 导入文章: TailwindCSS常用类目.md');
    
    const tailwindPath = path.join(articlesDir, 'TailwindCSS常用类目.md');
    await importArticleFromMarkdown(tailwindPath, {
      ...defaults,
      categoryId: '技术随笔',
    });

    console.log('   ✓ 成功导入 TailwindCSS 常用类目文章\n');

    // 2. 导入不含元数据的文章（文章渲染器测试.md）
    console.log('2. 导入文章: 文章渲染器测试.md');
    
    const testPath = path.join(articlesDir, '文章渲染器测试.md');
    await importArticleFromMarkdown(testPath, {
      ...defaults,
      title: 'Markdown 渲染器测试',
      slug: 'markdown-renderer-test',
      excerpt: '这是测试 markdownRenderer.tsx 中所有支持的 Markdown 标记的文章',
      categoryId: '测试',
    });

    console.log('   ✓ 成功导入 Markdown 渲染器测试文章\n');

    console.log('========================================');
    console.log('✅ 所有示例文章导入完成！');
    console.log('========================================');
  } catch (error) {
    console.error('❌ 导入失败:', error);
    throw error;
  }
}

// 运行导入
importSampleArticles()
  .then(() => {
    console.log('\n程序执行成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('程序执行失败:', error);
    process.exit(1);
  });

