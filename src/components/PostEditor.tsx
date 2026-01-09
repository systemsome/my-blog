import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { postsApi } from '../api/posts';
import type { BlogPost } from '../types/blog';
import './PostEditor.css';

interface PostEditorProps {
    post?: BlogPost | null;
    onSave: (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => void;
    onCancel: () => void;
}

/**
 * 文章编辑器组件
 * NOTE: 支持 Markdown 编辑和实时预览
 */
function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
    const isEditing = !!post;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        cover_image: '',
        tags: '',
        read_time: 5,
    });

    // 编辑模式时填充现有数据
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author,
                cover_image: post.cover_image || '',
                tags: post.tags.join(', '),
                read_time: post.read_time,
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
            [name]: name === 'read_time' ? parseInt(value) || 0 : value,
        }));
    };

    /**
     * 处理图片上传
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const imageUrl = await postsApi.uploadImage(file);

            // 插入 Markdown 图片语法到内容中
            const imageMarkdown = `![${file.name}](${imageUrl})`;
            setFormData(prev => ({
                ...prev,
                content: prev.content + '\n' + imageMarkdown + '\n',
            }));
        } catch (err) {
            alert('图片上传失败，请重试');
            console.error(err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    /**
     * 插入 Markdown 模板
     */
    const insertMarkdown = (template: string) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content + template,
        }));
    };

    /**
     * 处理表单提交
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('标题和内容不能为空！');
            return;
        }

        const postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
            title: formData.title.trim(),
            excerpt: formData.excerpt.trim() || formData.content.slice(0, 100) + '...',
            content: formData.content.trim(),
            author: formData.author.trim() || '匿名',
            cover_image: formData.cover_image.trim() || null,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            read_time: formData.read_time || Math.ceil(formData.content.length / 500),
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
                <button
                    type="button"
                    className="preview-toggle"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? '📝 编辑' : '👁️ 预览'}
                </button>
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
                        <label htmlFor="read_time">阅读时间（分钟）</label>
                        <input
                            type="number"
                            id="read_time"
                            name="read_time"
                            value={formData.read_time}
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

                {/* Markdown 工具栏 */}
                <div className="markdown-toolbar">
                    <span className="toolbar-label">Markdown 工具：</span>
                    <button type="button" onClick={() => insertMarkdown('**粗体**')}>B</button>
                    <button type="button" onClick={() => insertMarkdown('*斜体*')}>I</button>
                    <button type="button" onClick={() => insertMarkdown('\n## 标题\n')}>H</button>
                    <button type="button" onClick={() => insertMarkdown('\n- 列表项\n')}>•</button>
                    <button type="button" onClick={() => insertMarkdown('\n```javascript\n// 代码\n```\n')}>{'</>'}</button>
                    <button type="button" onClick={() => insertMarkdown('\n> 引用\n')}>❝</button>
                    <button type="button" onClick={() => insertMarkdown('[链接](url)')}>🔗</button>
                    <label className="upload-btn">
                        📷 {isUploading ? '上传中...' : '上传图片'}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div className="form-group content-group">
                    <label>文章内容 * (支持 Markdown)</label>

                    {showPreview ? (
                        <div className="markdown-preview">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {formData.content || '*暂无内容*'}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="在这里写下你的文章内容...

支持 Markdown 语法：
# 标题
**粗体** *斜体*
- 列表
```javascript
代码块
```
![图片](url)"
                            rows={20}
                            required
                        />
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="cover_image">封面图片 URL</label>
                    <input
                        type="url"
                        id="cover_image"
                        name="cover_image"
                        value={formData.cover_image}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    {formData.cover_image && (
                        <div className="image-preview">
                            <img src={formData.cover_image} alt="封面预览" />
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
                    <button type="submit" className="primary-btn" disabled={isUploading}>
                        {isEditing ? '保存修改' : '发布文章'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostEditor;
