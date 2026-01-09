import { useState } from 'react';
import './CodeBlock.css';

interface CodeBlockProps {
    children: string;
    className?: string;
}

/**
 * Mac 风格的代码块组件
 * NOTE: 带有红黄绿窗口按钮和复制功能
 */
function CodeBlock({ children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    // 从 className 提取语言
    const language = className?.replace('language-', '') || '';

    /**
     * 复制代码到剪贴板
     */
    const handleCopy = () => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = children;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    return (
        <div className="mac-code-block">
            {/* Mac 风格的标题栏 */}
            <div className="mac-titlebar">
                <div className="mac-buttons">
                    <span className="mac-btn mac-close" />
                    <span className="mac-btn mac-minimize" />
                    <span className="mac-btn mac-maximize" />
                </div>
                {language && <span className="mac-language">{language}</span>}
                <button
                    className={`mac-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    type="button"
                    title="复制代码"
                >
                    {copied ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            已复制
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            复制
                        </>
                    )}
                </button>
            </div>
            {/* 代码内容 */}
            <pre className="mac-code-content">
                <code className={className}>{children}</code>
            </pre>
        </div>
    );
}

export default CodeBlock;
