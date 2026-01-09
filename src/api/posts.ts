/**
 * API 配置
 * NOTE: 后端 API 基础 URL，自动使用当前主机地址
 */
const API_HOST = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://localhost:8000';
const API_BASE_URL = `${API_HOST}/api`;

import type { BlogPost } from '../types/blog';

// 重新导出类型
export type { BlogPost };


/**
 * API 请求封装
 */
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API 错误: ${response.status}`);
    }

    // NOTE: 204 No Content 不返回 body
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

/**
 * 文章 API
 */
export const postsApi = {
    /**
     * 获取所有文章
     */
    getAll: () => fetchApi<BlogPost[]>('/posts'),

    /**
     * 获取单篇文章
     */
    getById: (id: string) => fetchApi<BlogPost>(`/posts/${id}`),

    /**
     * 创建文章
     */
    create: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) =>
        fetchApi<BlogPost>('/posts', {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                cover_image: data.cover_image || null,
            }),
        }),

    /**
     * 更新文章
     */
    update: (id: string, data: Partial<BlogPost>) =>
        fetchApi<BlogPost>(`/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * 删除文章
     */
    delete: (id: string) =>
        fetchApi<void>(`/posts/${id}`, {
            method: 'DELETE',
        }),

    /**
     * 上传图片
     */
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/posts/upload-image`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('图片上传失败');
        }

        const data = await response.json();
        // NOTE: 使用 API_HOST 而不是 API_BASE_URL，避免重复 /api
        return `${API_HOST}${data.url}`;
    },
};
