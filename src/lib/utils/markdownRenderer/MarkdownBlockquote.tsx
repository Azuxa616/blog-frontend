import { ReactNode } from 'react';
import { renderInlineElements } from './markdownUtils';

/**
 * Markdown 引用块组件
 * 用于渲染引用文本
 */

interface MarkdownBlockquoteProps {
    content: string;
}

export default function MarkdownBlockquote({ content }: MarkdownBlockquoteProps): ReactNode {
    return (
        <blockquote 
            className="border-l-4 border-border pl-4 italic text-muted my-4"
            style={{ borderLeftColor: 'var(--border)' }}
        >
            {renderInlineElements(content)}
        </blockquote>
    );
}

