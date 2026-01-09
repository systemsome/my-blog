import { useState, useEffect } from 'react';
import type { BlogPost } from '../types/blog';
import './PostEditor.css';

interface PostEditorProps {
    post?: BlogPost | null;
    onSave: (postData: Omit<BlogPost, 'id'>) => void;
    onCancel: () => void;
}

/**
 * 文章编辑器组件
 * NOTE: 支持新建和编辑两种模式
 */
function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
    const isEditing = !!post;

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        coverImage: '',
        tags: '',
        readTime: 5,
    });

    // 编辑模式时填充现有数据
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author,
                date: post.date,
                coverImage: post.coverImage,
                tags: post.tags.join(', '),
                readTime: post.readTime,
            });
        }
    }, [post]);

    /**
     * 处理输入变化
     */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'readTime' ? parseInt(value) || 0 : value,
        }));
    };

    /**
     * 处理表单提交
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // NOTE: 简单验证
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('标题和内容不能为空！');
            return;
        }

        const postData: Omit<BlogPost, 'id'> = {
            title: formData.title.trim(),
            excerpt: formData.excerpt.trim() || formData.content.slice(0, 100) + '...',
            content: formData.content.trim(),
            author: formData.author.trim() || '匿名',
            date: formData.date,
            coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            readTime: formData.readTime || Math.ceil(formData.content.length / 500),
        };

        onSave(postData);
    };

    return (
        <div className="post-editor">
            <div className="editor-header">
                <button className="cancel-btn" onClick={onCancel}>
                    ← 取消
                </button>
                <h1 className="editor-title">
                    {isEditing ? '✏️ 编辑文章' : '✨ 新建文章'}
                </h1>
                <div style={{ width: '80px' }} />
            </div>

            <form className="editor-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">文章标题 *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="输入一个吸引人的标题"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="author">作者</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="作者名称"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">发布日期</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="readTime">阅读时间（分钟）</label>
                        <input
                            type="number"
                            id="readTime"
                            name="readTime"
                            value={formData.readTime}
                            onChange={handleChange}
                            min="1"
                            max="60"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="excerpt">文章摘要</label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="简短描述文章内容，吸引读者点击"
                        rows={2}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">文章内容 *</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="在这里写下你的文章内容..."
                        rows={15}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="coverImage">封面图片 URL</label>
                    <input
                        type="url"
                        id="coverImage"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    {formData.coverImage && (
                        <div className="image-preview">
                            <img src={formData.coverImage} alt="封面预览" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="tags">标签（用逗号分隔）</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="React, TypeScript, 前端开发"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="secondary-btn" onClick={onCancel}>
                        取消
                    </button>
                    <button type="submit" className="primary-btn">
                        {isEditing ? '保存修改' : '发布文章'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostEditor;
