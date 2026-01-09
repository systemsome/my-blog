/**
 * 博客文章类型定义
 * NOTE: 统一使用 API 返回的字段名
 */

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date?: string;         // 兼容前端显示
    created_at?: string;   // 后端返回
    updated_at?: string;   // 后端返回
    cover_image: string | null;
    tags: string[];
    read_time: number;
}
