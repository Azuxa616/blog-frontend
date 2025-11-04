import { ReactNode } from 'react';
import { renderInlineElements } from './markdownUtils';

/**
 * Markdown 段落组件
 * 用于渲染普通文本段落
 */

interface MarkdownParagraphProps {
    content: string;
}

export default function MarkdownParagraph({ content }: MarkdownParagraphProps): ReactNode {
    // 如果内容为空，不渲染
    if (!content.trim()) {
        return null;
    }

    return (
        <p className="mb-4 leading-relaxed text-foreground">
            {renderInlineElements(content)}
        </p>
    );
}

