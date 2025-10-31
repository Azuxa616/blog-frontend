'use client';

import Link from 'next/link';
import { Category } from '@/types/category';

interface CategoryFilterProps {
  categories: (Category & { articleCount: number })[];
  selectedCategory?: string;
  searchTerm?: string;
  sortType?: string;
}

// 预定义的颜色数组，用于相邻分类的颜色区分
const categoryColors = [
  'text-blue-600',
  'text-green-600',
  'text-purple-600',
  'text-red-600',
  'text-orange-600',
  'text-teal-600',
  'text-pink-600',
  'text-indigo-600',
  'text-cyan-600',
  'text-emerald-600',
];

export default function CategoryFilter({
  categories,
  selectedCategory = 'all',
  searchTerm,
  sortType
}: CategoryFilterProps) {
  // 按文章数量排序（降序）
  const sortedCategories = [...categories].sort((a, b) => b.articleCount - a.articleCount);

  // 计算字体大小：基于文章数量的相对比例
  const minFontSize = 14; // 最小字体大小
  const maxFontSize = 24; // 最大字体大小

  // 找出最大和最小的文章数量
  const maxCount = Math.max(...sortedCategories.map(c => c.articleCount));
  const minCount = Math.min(...sortedCategories.map(c => c.articleCount));

  // 计算字体大小的函数
  const getFontSize = (count: number): number => {
    if (maxCount === minCount) return (minFontSize + maxFontSize) / 2;
    const ratio = (count - minCount) / (maxCount - minCount);
    return minFontSize + ratio * (maxFontSize - minFontSize);
  };

  // 构建URL参数的辅助函数
  const buildUrl = (categoryId: string) => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (sortType && sortType !== 'latest') params.set('sort', sortType);

    // 如果选择的是 'all'，不添加category参数
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }

    const queryString = params.toString();
    const url = queryString ? `/articles?${queryString}` : '/articles';
    return url;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">分类筛选</h3>
        {/* 重置按钮 - 仅在有分类筛选时显示 */}
        {selectedCategory !== 'all' && selectedCategory && (
          <Link
            href={buildUrl('all')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full transition-colors duration-200"
          >
            重置筛选
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {/* 分类列表 */}
        {sortedCategories.map((category, index) => {
          const fontSize = getFontSize(category.articleCount);
          const colorClass = categoryColors[index % categoryColors.length];
          const isSelected = selectedCategory === category.id;

          return (
            <Link
              key={category.id}
              href={buildUrl(category.id)}
              className={`transition-all duration-200 hover:opacity-80 ${
                isSelected
                  ? 'font-bold text-[#254889]'
                  : `${colorClass} hover:text-opacity-80`
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.2'
              }}
            >
              {category.name} ({category.articleCount})
            </Link>
          );
        })}
      </div>
    </div>
  );
}
