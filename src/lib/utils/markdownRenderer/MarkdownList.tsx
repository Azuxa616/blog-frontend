import { ReactNode } from 'react';
import { renderInlineElements } from './markdownUtils';

/**
 * Markdown 列表组件
 * 支持无序列表和有序列表
 */

interface MarkdownListProps {
    items: string[];
    ordered?: boolean;
}

export default function MarkdownList({ items, ordered = false }: MarkdownListProps): ReactNode {
    if (items.length === 0) {
        return null;
    }

    const ListTag = ordered ? 'ol' : 'ul';
    const listClassName = ordered 
        ? 'mb-4 ml-6 list-decimal' 
        : 'mb-4 ml-6 list-disc';

    return (
        <ListTag className={listClassName}>
            {items.map((item, index) => (
                <li 
                    key={index} 
                    className="mb-1 text-foreground"
                >
                    {renderInlineElements(item)}
                </li>
            ))}
        </ListTag>
    );
}

