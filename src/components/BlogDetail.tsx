import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost } from '../api/posts';
import CodeBlock from './CodeBlock';
import './BlogDetail.css';

interface BlogDetailProps {
    post: BlogPost;
    onBack: () => void;
}

/**
 * 博客详情组件
 * NOTE: 使用 react-markdown 渲染 Markdown 内容
 */
function BlogDetail({ post, onBack }: BlogDetailProps) {
    const displayDate = post.created_at
        ? new Date(post.created_at).toLocaleDateString('zh-CN')
        : post.date || '';

    return (
        <article className="blog-detail">
            <button className="back-button" onClick={onBack}>
                <span className="back-icon">←</span>
                <span>返回列表</span>
            </button>

            <div className="detail-hero">
                {post.cover_image && (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="detail-cover"
                    />
                )}
                <div className="detail-hero-overlay" />
                <div className="detail-hero-content">
                    <div className="detail-tags">
                        {post.tags.map((tag) => (
                            <span key={tag} className="detail-tag">{tag}</span>
                        ))}
                    </div>
                    <h1 className="detail-title">{post.title}</h1>
                    <div className="detail-meta">
                        <span className="detail-author">{post.author}</span>
                        <span className="detail-dot">·</span>
                        <span className="detail-date">{displayDate}</span>
                        <span className="detail-dot">·</span>
                        <span className="detail-read-time">{post.read_time} 分钟阅读</span>
                    </div>
                </div>
            </div>

            <div className="detail-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // NOTE: 自定义 pre 标签渲染，捕获代码块
                        pre({ children }) {
                            return <>{children}</>;
                        },
                        // NOTE: 自定义 code 标签渲染
                        code({ node, className, children, ...props }) {
                            const content = String(children).replace(/\n$/, '');
                            // 检查是否是代码块（有 className 或者内容包含换行）
                            const isCodeBlock = className || content.includes('\n');

                            if (isCodeBlock) {
                                return <CodeBlock className={className}>{content}</CodeBlock>;
                            }

                            // 行内代码
                            return <code className="inline-code" {...props}>{content}</code>;
                        }
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}

export default BlogDetail;
