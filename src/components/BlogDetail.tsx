import type { BlogPost } from '../types/blog';
import './BlogDetail.css';

interface BlogDetailProps {
    post: BlogPost;
    onBack: () => void;
}

/**
 * 博客详情组件
 * NOTE: 展示完整的博客文章内容
 */
function BlogDetail({ post, onBack }: BlogDetailProps) {
    return (
        <article className="blog-detail">
            <button className="back-button" onClick={onBack}>
                <span className="back-icon">←</span>
                <span>返回列表</span>
            </button>

            <div className="detail-hero">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="detail-cover"
                />
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
                        <span className="detail-date">{post.date}</span>
                        <span className="detail-dot">·</span>
                        <span className="detail-read-time">{post.readTime} 分钟阅读</span>
                    </div>
                </div>
            </div>

            <div
                className="detail-content"
                dangerouslySetInnerHTML={{
                    __html: formatContent(post.content)
                }}
            />
        </article>
    );
}

/**
 * 格式化博客内容
 * NOTE: 将 Markdown 风格的内容转换为 HTML
 * HACK: 简化版转换，生产环境应使用专业的 Markdown 解析库
 */
function formatContent(content: string): string {
    return content
        // 代码块
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // 标题
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/## (.*)/g, '<h2>$1</h2>')
        // 行内代码
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        // 段落
        .replace(/\n\n/g, '</p><p>')
        // 列表项
        .replace(/- (.*)/g, '<li>$1</li>');
}

export default BlogDetail;
