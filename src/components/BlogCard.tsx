import type { BlogPost } from '../types/blog';
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
    return (
        <article className="blog-card" onClick={() => onClick(post)}>
            <div className="card-image-wrapper">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="card-image"
                    loading="lazy"
                />
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
                    <span className="card-date">{post.date}</span>
                    <span className="card-dot">·</span>
                    <span className="card-read-time">{post.readTime} 分钟阅读</span>
                </div>
            </div>
        </article>
    );
}

export default BlogCard;
