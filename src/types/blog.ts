/**
 * 博客文章类型定义
 * NOTE: 用于统一博客数据结构
 */

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    coverImage: string;
    tags: string[];
    readTime: number;
}
