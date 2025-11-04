import { ReactNode } from 'react';

/**
 * Markdown 渲染工具函数
 * 提供行内元素的渲染逻辑
 */

/**
 * 渲染行内元素（粗体、斜体、删除线、链接、图片、行内代码）
 * @param text - 需要处理的文本
 * @returns React 元素数组
 */
export function renderInlineElements(text: string): ReactNode {
    // 先处理行内代码，避免与其他标记冲突
    const parts = text.split(/(`[^`]+`)/g);
    
    return parts.map((part, index) => {
        // 处理行内代码
        if (part.startsWith('`') && part.endsWith('`')) {
            const code = part.slice(1, -1);
            return (
                <code 
                    key={index} 
                    className="px-2 py-1 rounded text-sm font-mono text-foreground"
                    style={{ 
                        backgroundColor: 'var(--card-background)',
                        border: '1px solid var(--border)'
                    }}
                >
                    {code}
                </code>
            );
        }

        // 处理其他行内元素 - 注意顺序很重要，图片要在链接之前处理
        let processedText = part
            // 图片处理
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />')
            // 粗体处理 - 使用 CSS 变量
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold" style="color: var(--foreground);">$1</strong>')
            // 斜体处理 - 使用 CSS 变量
            .replace(/\*(.*?)\*/g, '<em class="italic" style="color: var(--foreground);">$1</em>')
            // 删除线处理 - 使用 CSS 变量
            .replace(/~~(.*?)~~/g, '<del class="line-through" style="color: var(--muted);">$1</del>')
            // 链接处理 - 使用 CSS 变量和自定义边框动画
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
                '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>');

        // 如果包含 HTML 标签，使用 dangerouslySetInnerHTML
        if (typeof processedText === 'string' && processedText.includes('<')) {
            return <span key={index} dangerouslySetInnerHTML={{ __html: processedText }} />;
        }
        
        return <span key={index}>{processedText}</span>;
    });
}

/**
 * 标准化换行符
 * 将不同系统的换行符统一为 \n
 * @param content - 原始内容
 * @returns 标准化后的内容
 */
export function normalizeLineBreaks(content: string): string {
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * 检查是否为标题行
 * @param line - 文本行
 * @returns 匹配结果，包含级别和文本内容
 */
export function matchHeading(line: string): { level: number; text: string } | null {
    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
        return {
            level: match[1].length,
            text: match[2]
        };
    }
    return null;
}

/**
 * 检查是否为无序列表项
 * @param line - 文本行
 * @returns 列表项内容，如果不是则返回 null
 */
export function matchUnorderedList(line: string): string | null {
    const match = line.match(/^[-*]\s+(.*)$/);
    return match ? match[1] : null;
}

/**
 * 检查是否为有序列表项
 * @param line - 文本行
 * @returns 列表项内容，如果不是则返回 null
 */
export function matchOrderedList(line: string): string | null {
    const match = line.match(/^\d+\.\s+(.*)$/);
    return match ? match[1] : null;
}

/**
 * 检查是否为引用行
 * @param line - 文本行
 * @returns 引用内容，如果不是则返回 null
 */
export function matchBlockquote(line: string): string | null {
    if (line.startsWith('> ')) {
        return line.slice(2);
    }
    return null;
}

/**
 * 检查是否为水平线
 * @param line - 文本行
 * @returns 是否为水平线
 */
export function matchHorizontalRule(line: string): boolean {
    return /^(-{3,}|\*{3,})$/.test(line);
}

/**
 * 检查是否为代码块开始
 * @param line - 文本行
 * @returns 语言名称，如果不是代码块则返回 null
 */
export function matchCodeBlockStart(line: string): string | null {
    if (line.startsWith('```')) {
        return line.slice(3).trim();
    }
    return null;
}

