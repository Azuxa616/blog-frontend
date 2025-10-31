import { ReactNode } from 'react';
import CodeBlock from '@/lib/utils/markdownRenderer/CodeBlock';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * 简化的Markdown渲染器
 * 支持基本的Markdown语法转换为HTML
 */
export default function MarkdownRenderer({ 
    content, 
    className = "prose prose-lg max-w-none" 
}: MarkdownRendererProps) {
    /**
     * 将Markdown文本转换为HTML
     * @param text - Markdown文本
     * @returns HTML字符串
     */
    const formatContent = (text: string): string => {
        return text
            // 标题处理
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-800 mb-4 mt-6">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-700 mb-3 mt-4">$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold text-gray-700 mb-2 mt-3">$1</h4>')
            .replace(/^##### (.*$)/gim, '<h5 class="text-base font-bold text-gray-700 mb-2 mt-3">$1</h5>')
            .replace(/^###### (.*$)/gim, '<h6 class="text-sm font-bold text-gray-700 mb-2 mt-3">$1</h6>')
            
            // 列表处理
            .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
            
            // 代码块处理
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
            
            // 文本格式处理
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
            
            // 链接处理
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#254889] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
            
            // 图片处理
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
            
            // 引用处理
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">$1</blockquote>')
            
            // 水平线处理
            .replace(/^---$/gim, '<hr class="my-6 border-gray-300" />')
            .replace(/^\*\*\*$/gim, '<hr class="my-6 border-gray-300" />')
            
            // 段落处理
            .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
            .replace(/^(?!<[h|l|b|p|d|i|a|i|h])(.*)$/gim, '<p class="mb-4 leading-relaxed">$1</p>');
    };

    return (
        <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
    );
}

/**
 * 纯函数版本的Markdown转换器
 * 不返回React组件，只返回HTML字符串
 * @param content - Markdown内容
 * @returns HTML字符串
 */
export function markdownToHtml(content: string): string {
    return content
        // 标题处理
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-800 mb-4 mt-6">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-700 mb-3 mt-4">$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold text-gray-700 mb-2 mt-3">$1</h4>')
        .replace(/^##### (.*$)/gim, '<h5 class="text-base font-bold text-gray-700 mb-2 mt-3">$1</h5>')
        .replace(/^###### (.*$)/gim, '<h6 class="text-sm font-bold text-gray-700 mb-2 mt-3">$1</h6>')
        
        // 列表处理
        .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
        
        // 代码块处理
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
        
        // 文本格式处理
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
        
        // 链接处理
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#254889] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
        
        // 图片处理
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
        
        // 引用处理
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">$1</blockquote>')
        
        // 水平线处理
        .replace(/^---$/gim, '<hr class="my-6 border-gray-300" />')
        .replace(/^\*\*\*$/gim, '<hr class="my-6 border-gray-300" />')
        
        // 段落处理
        .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
        .replace(/^(?!<[h|l|b|p|d|i|a|i|h])(.*)$/gim, '<p class="mb-4 leading-relaxed">$1</p>');
}

/**
 * 获取Markdown内容的纯文本摘要
 * 移除所有Markdown语法，只保留纯文本
 * @param content - Markdown内容
 * @param maxLength - 最大长度，默认200
 * @returns 纯文本摘要
 */
export function getMarkdownExcerpt(content: string, maxLength: number = 200): string {
    // 移除Markdown语法
    const plainText = content
        .replace(/#{1,6}\s+/g, '') // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
        .replace(/`([^`]+)`/g, '$1') // 移除行内代码标记
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
        .replace(/^> (.*$)/gim, '$1') // 移除引用标记
        .replace(/^[-*]\s+(.*$)/gim, '$1') // 移除列表标记
        .replace(/^\d+\.\s+(.*$)/gim, '$1') // 移除有序列表标记
        .replace(/\n+/g, ' ') // 将换行符替换为空格
        .trim();

    // 截取指定长度
    if (plainText.length <= maxLength) {
        return plainText;
    }

    return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * 计算Markdown内容的阅读时间
 * 基于中文和英文的平均阅读速度
 * @param content - Markdown内容
 * @returns 预估阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
    // 移除Markdown语法，只计算纯文本
    const plainText = content
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        .replace(/^> (.*$)/gim, '$1')
        .replace(/^[-*]\s+(.*$)/gim, '$1')
        .replace(/^\d+\.\s+(.*$)/gim, '$1')
        .replace(/\n+/g, ' ')
        .trim();

    // 计算字符数
    const charCount = plainText.length;

    // 中文阅读速度：每分钟300-500字，取400字
    // 英文阅读速度：每分钟200-300词，取250词
    // 混合文本取平均值：每分钟325字0
    const wordsPerMinute = 325;

    const readingTime = Math.ceil(charCount / wordsPerMinute);

    return Math.max(1, readingTime); // 最少1分钟
}

/**
 * 解析Markdown内容并返回React组件数组
 * 支持使用CodeBlock组件渲染代码块
 * @param content - Markdown内容
 * @returns React元素数组
 */
export function renderMarkdownWithComponents(content: string): ReactNode[] {
    // 统一处理换行符，将 \r\n 转换为 \n
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedContent.split('\n');
    const result: ReactNode[] = [];
    let currentParagraph: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';
    let listItems: string[] = [];
    let inList = false;

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const paragraphText = currentParagraph.join('\n');
            if (paragraphText.trim()) {
                result.push(
                    <p key={`p-${result.length}`} className="mb-4 leading-relaxed">
                        {renderInlineElements(paragraphText)}
                    </p>
                );
            }
            currentParagraph = [];
        }
    };

    const flushList = () => {
        if (listItems.length > 0) {
            result.push(
                <ul key={`ul-${result.length}`} className="mb-4">
                    {listItems.map((item, index) => (
                        <li key={index} className="ml-4 mb-1">• {renderInlineElements(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
            inList = false;
        }
    };

    const renderInlineElements = (text: string): ReactNode => {
        // 处理行内代码
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                const code = part.slice(1, -1);
                return <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{code}</code>;
            }

            // 处理其他行内元素 - 注意顺序很重要，图片要在链接之前处理
            return part
                .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#254889] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
        }).map((part, index) => {
            if (typeof part === 'string' && part.includes('<')) {
                return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            }
            return part;
        });
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 代码块开始
        if (line.startsWith('```')) {
            flushParagraph();
            flushList();

            if (inCodeBlock) {
                // 代码块结束
                result.push(
                    <CodeBlock
                        key={`codeblock-${result.length}`}
                        language={codeBlockLanguage || 'text'}
                        children={codeBlockContent.trim()}
                    />
                );
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLanguage = '';
            } else {
                // 代码块开始
                inCodeBlock = true;
                codeBlockLanguage = line.slice(3).trim();
            }
            continue;
        }

        // 在代码块内
        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            continue;
        }

        // 标题
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            flushParagraph();
            flushList();

            const level = headingMatch[1].length;
            const text = headingMatch[2];
            const headingClasses = [
                'text-3xl font-bold text-gray-900 mb-6 mt-8', // h1
                'text-2xl font-bold text-gray-800 mb-4 mt-6', // h2
                'text-xl font-bold text-gray-700 mb-3 mt-4',   // h3
                'text-lg font-bold text-gray-700 mb-2 mt-3',   // h4
                'text-base font-bold text-gray-700 mb-2 mt-3', // h5
                'text-sm font-bold text-gray-700 mb-2 mt-3'    // h6
            ];

            const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            result.push(
                <HeadingTag key={`h${level}-${result.length}`} className={headingClasses[level - 1]}>
                    {renderInlineElements(text)}
                </HeadingTag>
            );
            continue;
        }

        // 列表项
        const listMatch = line.match(/^[-*]\s+(.*)$/);
        if (listMatch) {
            flushParagraph();
            listItems.push(listMatch[1]);
            inList = true;
            continue;
        }

        // 有序列表项
        const orderedListMatch = line.match(/^\d+\.\s+(.*)$/);
        if (orderedListMatch) {
            flushParagraph();
            listItems.push(orderedListMatch[1]);
            inList = true;
            continue;
        }

        // 引用
        if (line.startsWith('> ')) {
            flushParagraph();
            flushList();
            result.push(
                <blockquote key={`blockquote-${result.length}`} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                    {renderInlineElements(line.slice(2))}
                </blockquote>
            );
            continue;
        }

        // 水平线
        if (line.match(/^(-{3,}|\*{3,})$/)) {
            flushParagraph();
            flushList();
            result.push(<hr key={`hr-${result.length}`} className="my-6 border-gray-300" />);
            continue;
        }

        // 图片 - 现在在 renderInlineElements 中处理

        // 空行
        if (line.trim() === '') {
            flushParagraph();
            flushList();
            continue;
        }

        // 普通段落内容
        if (!inList) {
            currentParagraph.push(line);
        }
    }

    // 处理最后的段落和列表
    flushParagraph();
    flushList();
    return result;
}
