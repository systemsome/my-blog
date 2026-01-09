import type { BlogPost } from '../api/posts';
import './BlogCard.css';

interface BlogCardProps {
    post: BlogPost;
    onClick: (post: BlogPost) => void;
}

/**
 * 博客卡片组件
 * NOTE: 展示单篇博客的预览信息
 */
function BlogCard({ post, onClick }: BlogCardProps) {
    // NOTE: 兼容 created_at 和 date 字段
    const displayDate = post.created_at
        ? new Date(post.created_at).toLocaleDateString('zh-CN')
        : post.date || '';

    return (
        <article className="blog-card" onClick={() => onClick(post)}>
            <div className="card-image-wrapper">
                {post.cover_image ? (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="card-image"
                        loading="lazy"
                    />
                ) : (
                    <div className="card-image-placeholder">
                        <span>📝</span>
                    </div>
                )}
                <div className="card-overlay" />
            </div>
            <div className="card-content">
                <div className="card-tags">
                    {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="card-tag">{tag}</span>
                    ))}
                </div>
                <h2 className="card-title">{post.title}</h2>
                <p className="card-excerpt">{post.excerpt}</p>
                <div className="card-meta">
                    <span className="card-author">{post.author}</span>
                    <span className="card-dot">·</span>
                    <span className="card-date">{displayDate}</span>
                    <span className="card-dot">·</span>
                    <span className="card-read-time">{post.read_time} 分钟阅读</span>
                </div>
            </div>
        </article>
    );
}

export default BlogCard;
