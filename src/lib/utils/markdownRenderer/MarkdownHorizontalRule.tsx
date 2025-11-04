import { ReactNode } from 'react';

/**
 * Markdown 水平线组件
 * 用于分隔内容
 */

export default function MarkdownHorizontalRule(): ReactNode {
    return (
        <hr 
            className="my-6 border-t"
            style={{ borderColor: 'var(--border)' }}
        />
    );
}

