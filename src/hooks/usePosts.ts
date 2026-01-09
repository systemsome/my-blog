import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/posts';
import { BLOG_POSTS } from '../data/posts';
import type { BlogPost } from '../types/blog';

// 重新导出类型
export type { BlogPost };

/**
 * 博客数据管理 Hook
 * NOTE: 使用后端 API 进行数据持久化，后端不可用时回退到本地静态数据
 */
export function usePosts() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // NOTE: 标记是否使用本地数据（用于禁用编辑功能）
    const [isLocalMode, setIsLocalMode] = useState(false);

    /**
     * 加载所有文章
     * NOTE: 后端不可用时自动回退到本地静态数据
     */
    const loadPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await postsApi.getAll();
            setPosts(data);
            setIsLocalMode(false);
        } catch (err) {
            // FIXME: 后端不可用时使用本地静态数据
            console.warn('后端连接失败，使用本地静态数据:', err);
            setPosts(BLOG_POSTS);
            setIsLocalMode(true);
            setError(null); // 清除错误，使用本地数据正常展示
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 初始化加载
    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    /**
     * 创建新文章
     */
    const createPost = useCallback(async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const newPost = await postsApi.create(postData);
            setPosts(prev => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            console.error('创建文章失败:', err);
            throw err;
        }
    }, []);

    /**
     * 更新文章
     */
    const updatePost = useCallback(async (id: string, postData: Partial<BlogPost>) => {
        try {
            const updatedPost = await postsApi.update(id, postData);
            setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
            return updatedPost;
        } catch (err) {
            console.error('更新文章失败:', err);
            throw err;
        }
    }, []);

    /**
     * 删除文章
     */
    const deletePost = useCallback(async (id: string) => {
        try {
            await postsApi.delete(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('删除文章失败:', err);
            throw err;
        }
    }, []);

    /**
     * 根据 ID 获取文章
     */
    const getPostById = useCallback((id: string) => {
        return posts.find(post => post.id === id);
    }, [posts]);

    return {
        posts,
        isLoading,
        error,
        isLocalMode, // NOTE: 本地模式下应禁用编辑功能
        createPost,
        updatePost,
        deletePost,
        getPostById,
        refreshPosts: loadPosts,
    };
}
