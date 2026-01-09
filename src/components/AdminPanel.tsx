import type { BlogPost } from '../types/blog';
import './AdminPanel.css';

interface AdminPanelProps {
    posts: BlogPost[];
    onEdit: (post: BlogPost) => void;
    onDelete: (id: string) => void;
    onCreateNew: () => void;
    onBack: () => void;
}

/**
 * 管理面板组件
 * NOTE: 显示文章列表和管理操作
 */
function AdminPanel({ posts, onEdit, onDelete, onCreateNew, onBack }: AdminPanelProps) {
    /**
     * 处理删除确认
     * NOTE: 防止误删，需用户确认
     */
    const handleDelete = (post: BlogPost) => {
        if (window.confirm(`确定要删除文章「${post.title}」吗？`)) {
            onDelete(post.id);
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <button className="back-btn" onClick={onBack}>
                    ← 返回首页
                </button>
                <h1 className="admin-title">📝 文章管理</h1>
                <button className="create-btn" onClick={onCreateNew}>
                    ✨ 新建文章
                </button>
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-number">{posts.length}</span>
                    <span className="stat-label">篇文章</span>
                </div>
            </div>

            <div className="posts-table">
                <div className="table-header">
                    <span className="col-title">标题</span>
                    <span className="col-author">作者</span>
                    <span className="col-date">日期</span>
                    <span className="col-actions">操作</span>
                </div>

                {posts.length === 0 ? (
                    <div className="empty-state">
                        <p>暂无文章，点击「新建文章」开始创作吧！</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="table-row">
                            <span className="col-title">
                                <span className="post-title-text">{post.title}</span>
                                <span className="post-tags">
                                    {post.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="mini-tag">{tag}</span>
                                    ))}
                                </span>
                            </span>
                            <span className="col-author">{post.author}</span>
                            <span className="col-date">{post.date}</span>
                            <span className="col-actions">
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => onEdit(post)}
                                >
                                    ✏️ 编辑
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(post)}
                                >
                                    🗑️ 删除
                                </button>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
