import { ReactNode } from 'react';
import CodeBlock from '@/lib/utils/markdownRenderer/CodeBlock';
import MarkdownHeading from './MarkdownHeading';
import MarkdownParagraph from './MarkdownParagraph';
import MarkdownList from './MarkdownList';
import MarkdownBlockquote from './MarkdownBlockquote';
import MarkdownHorizontalRule from './MarkdownHorizontalRule';
import {
    normalizeLineBreaks,
    matchHeading,
    matchUnorderedList,
    matchOrderedList,
    matchBlockquote,
    matchHorizontalRule,
    matchCodeBlockStart
} from './markdownUtils';

/**
 * Markdown 渲染器主函数
 * 
 * 将 Markdown 文本解析为 React 组件数组
 * 支持以下 Markdown 语法：
 * - 标题（h1-h6）
 * - 段落
 * - 无序列表和有序列表
 * - 代码块（使用 CodeBlock 组件进行语法高亮）
 * - 行内代码
 * - 粗体、斜体、删除线
 * - 链接和图片
 * - 引用块
 * - 水平线
 * 
 * 所有组件都支持黑暗模式适配
 * 
 * @param content - Markdown 内容字符串
 * @returns React 元素数组
 */
export function renderMarkdownWithComponents(content: string): ReactNode[] {
    // 统一处理换行符，将不同系统的换行符统一为 \n
    const normalizedContent = normalizeLineBreaks(content);
    const lines = normalizedContent.split('\n');
    
    // 结果数组，存储所有渲染的 React 元素
    const result: ReactNode[] = [];
    
    // 状态变量
    let currentParagraph: string[] = [];  // 当前正在构建的段落内容
    let inCodeBlock = false;              // 是否在代码块内
    let codeBlockContent = '';            // 代码块内容
    let codeBlockLanguage = '';           // 代码块语言
    let listItems: string[] = [];         // 当前列表项
    let isOrderedList = false;            // 是否为有序列表
    let inList = false;                   // 是否在列表中

    /**
     * 刷新当前段落
     * 将累积的段落内容转换为 React 组件并添加到结果数组
     */
    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const paragraphText = currentParagraph.join('\n');
            if (paragraphText.trim()) {
                result.push(
                    <MarkdownParagraph
                        key={`p-${result.length}`}
                        content={paragraphText}
                    />
                );
            }
            currentParagraph = [];
        }
    };

    /**
     * 刷新当前列表
     * 将累积的列表项转换为 React 组件并添加到结果数组
     */
    const flushList = () => {
        if (listItems.length > 0) {
            result.push(
                <MarkdownList
                    key={`ul-${result.length}`}
                    items={listItems}
                    ordered={isOrderedList}
                />
            );
            listItems = [];
            inList = false;
            isOrderedList = false;
        }
    };

    // 遍历每一行进行解析
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 处理代码块开始/结束
        const codeBlockLang = matchCodeBlockStart(line);
        if (codeBlockLang !== null || (inCodeBlock && line === '```')) {
            flushParagraph();
            flushList();

            if (inCodeBlock) {
                // 代码块结束，渲染 CodeBlock 组件
                result.push(
                    <CodeBlock
                        key={`codeblock-${result.length}`}
                        language={codeBlockLanguage || 'text'}
                    >
                        {codeBlockContent.trim()}
                    </CodeBlock>
                );
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLanguage = '';
            } else {
                // 代码块开始
                inCodeBlock = true;
                codeBlockLanguage = codeBlockLang || '';
            }
            continue;
        }

        // 在代码块内，直接累积内容
        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            continue;
        }

        // 处理标题
        const headingMatch = matchHeading(line);
        if (headingMatch) {
            flushParagraph();
            flushList();

            result.push(
                <MarkdownHeading
                    key={`h${headingMatch.level}-${result.length}`}
                    level={headingMatch.level}
                    text={headingMatch.text}
                />
            );
            continue;
        }

        // 处理无序列表项
        const unorderedListItem = matchUnorderedList(line);
        if (unorderedListItem !== null) {
            flushParagraph();
            
            // 如果之前是有序列表，需要先刷新
            if (inList && isOrderedList) {
                flushList();
            }
            
            listItems.push(unorderedListItem);
            inList = true;
            isOrderedList = false;
            continue;
        }

        // 处理有序列表项
        const orderedListItem = matchOrderedList(line);
        if (orderedListItem !== null) {
            flushParagraph();
            
            // 如果之前是无序列表，需要先刷新
            if (inList && !isOrderedList) {
                flushList();
            }
            
            listItems.push(orderedListItem);
            inList = true;
            isOrderedList = true;
            continue;
        }

        // 处理引用块
        const blockquoteContent = matchBlockquote(line);
        if (blockquoteContent !== null) {
            flushParagraph();
            flushList();
            
            result.push(
                <MarkdownBlockquote
                    key={`blockquote-${result.length}`}
                    content={blockquoteContent}
                />
            );
            continue;
        }

        // 处理水平线
        if (matchHorizontalRule(line)) {
            flushParagraph();
            flushList();
            
            result.push(
                <MarkdownHorizontalRule
                    key={`hr-${result.length}`}
                />
            );
            continue;
        }

        // 处理空行
        if (line.trim() === '') {
            flushParagraph();
            flushList();
            continue;
        }

        // 普通段落内容
        if (!inList) {
            currentParagraph.push(line);
        } else {
            // 如果列表中断（遇到非列表项内容），刷新列表
            flushList();
            currentParagraph.push(line);
        }
    }

    // 处理最后的段落和列表
    flushParagraph();
    flushList();
    
    return result;
}
