import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/posts';
import type { BlogPost } from '../types/blog';

// 重新导出类型
export type { BlogPost };

/**
 * 博客数据管理 Hook
 * NOTE: 使用后端 API 进行数据持久化
 */
export function usePosts() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * 加载所有文章
     */
    const loadPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await postsApi.getAll();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载失败');
            console.error('加载文章失败:', err);
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
        createPost,
        updatePost,
        deletePost,
        getPostById,
        refreshPosts: loadPosts,
    };
}
