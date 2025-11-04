import { ReactNode } from 'react';
import { renderInlineElements } from './markdownUtils';

/**
 * Markdown 标题组件
 * 支持 h1-h6 六个级别的标题
 */

interface MarkdownHeadingProps {
    level: number;
    text: string;
}

/**
 * 标题样式配置
 * 每个级别都有对应的浅色和暗色主题样式
 */
const headingClasses = [
    'text-3xl font-bold text-foreground mb-6 mt-8', // h1
    'text-2xl font-bold text-foreground mb-4 mt-6', // h2
    'text-xl font-bold text-foreground mb-3 mt-4',  // h3
    'text-lg font-bold text-foreground mb-2 mt-3',  // h4
    'text-base font-bold text-foreground mb-2 mt-3', // h5
    'text-sm font-bold text-foreground mb-2 mt-3'    // h6
];

export default function MarkdownHeading({ level, text }: MarkdownHeadingProps): ReactNode {
    // 确保级别在有效范围内（1-6）
    const validLevel = Math.max(1, Math.min(6, level));
    const HeadingTag = `h${validLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    
    return (
        <HeadingTag className= {headingClasses[validLevel - 1]}>
            {renderInlineElements(text)}
        </HeadingTag>
    );
}

