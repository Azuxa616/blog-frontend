/**
 * Markdown 代码块组件
 * 支持语法高亮和黑暗模式适配
 */
'use client';
import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
    language: string;
    children: string;
    className?: string;
}

/**
 * 支持的语言列表，用于验证和映射
 */
const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby',
    'go', 'rust', 'swift', 'kotlin', 'sql', 'json', 'yaml', 'markdown',
    'bash', 'css', 'scss', 'html', 'jsx', 'text'
];

/**
 * 语言别名映射
 * 将常见的语言别名映射到标准语言名称
 */
const LANGUAGE_ALIASES: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'c++': 'cpp',
    'c#': 'csharp',
    'cs': 'csharp',
    'sh': 'bash',
    'shell': 'bash',
    'yml': 'yaml',
    'htm': 'html'
};

export default function CodeBlock({
    language,
    children,
    className = ""
}: CodeBlockProps) {
    // 标准化语言名称
    const normalizedLang = language.toLowerCase().trim();
    const mappedLang = LANGUAGE_ALIASES[normalizedLang] || normalizedLang;

    // 检查是否支持该语言，如果不支持则使用纯文本
    const finalLang = SUPPORTED_LANGUAGES.includes(mappedLang) ? mappedLang : 'text';

    // 使用暗色主题（vsDark），适配黑暗模式
    // 在浅色模式下也使用暗色代码块，这是常见的做法，可以提供更好的对比度
    const theme = themes.vsDark;
    const backgroundColor = '#1e1e1e';
    // 使用 CSS 变量定义的颜色，但代码块保持固定暗色背景以确保可读性
    const lineNumberColor = 'text-muted';
    const languageLabelColor = 'text-muted';

    return (
        <div className={`my-4 rounded-lg overflow-hidden ${className}`}>
            <Highlight
                theme={theme}
                code={children}
                language={finalLang as any}
            >
                {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={`${highlightClassName} p-4 m-0 text-sm leading-relaxed overflow-x-auto`}
                        style={{
                            ...style,
                            backgroundColor,
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}
                    >
                        <div className={`flex flex-row justify-between items-center text-sm ${languageLabelColor}`}>
                            {finalLang}
                        </div>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                <span className={`inline-block w-8 text-right mr-4 select-none ${lineNumberColor}`}>
                                    {i + 1}
                                </span>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}