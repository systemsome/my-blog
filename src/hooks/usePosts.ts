import { useState, useEffect, useCallback } from 'react';
import type { BlogPost } from '../types/blog';
import { BLOG_POSTS } from '../data/posts';

const STORAGE_KEY = 'blog_posts';

/**
 * 生成唯一 ID
 * NOTE: 简化版 UUID 生成
 */
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 博客数据管理 Hook
 * NOTE: 提供博客 CRUD 操作，数据持久化到 localStorage
 */
export function usePosts() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 初始化时从 localStorage 加载数据
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setPosts(JSON.parse(stored));
            } catch {
                // NOTE: 解析失败时使用默认数据
                setPosts(BLOG_POSTS);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(BLOG_POSTS));
            }
        } else {
            // NOTE: 首次使用时加载示例数据
            setPosts(BLOG_POSTS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(BLOG_POSTS));
        }
        setIsLoading(false);
    }, []);

    // 保存到 localStorage
    const savePosts = useCallback((newPosts: BlogPost[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
        setPosts(newPosts);
    }, []);

    /**
     * 创建新文章
     * @param postData 文章数据（不含 id）
     */
    const createPost = useCallback((postData: Omit<BlogPost, 'id'>) => {
        const newPost: BlogPost = {
            ...postData,
            id: generateId(),
        };
        const newPosts = [newPost, ...posts];
        savePosts(newPosts);
        return newPost;
    }, [posts, savePosts]);

    /**
     * 更新文章
     * @param id 文章 ID
     * @param postData 更新的数据
     */
    const updatePost = useCallback((id: string, postData: Partial<BlogPost>) => {
        const newPosts = posts.map(post =>
            post.id === id ? { ...post, ...postData } : post
        );
        savePosts(newPosts);
    }, [posts, savePosts]);

    /**
     * 删除文章
     * @param id 文章 ID
     */
    const deletePost = useCallback((id: string) => {
        const newPosts = posts.filter(post => post.id !== id);
        savePosts(newPosts);
    }, [posts, savePosts]);

    /**
     * 根据 ID 获取文章
     * @param id 文章 ID
     */
    const getPostById = useCallback((id: string) => {
        return posts.find(post => post.id === id);
    }, [posts]);

    return {
        posts,
        isLoading,
        createPost,
        updatePost,
        deletePost,
        getPostById,
    };
}
