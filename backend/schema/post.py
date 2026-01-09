"""
请求/响应 Pydantic 模型
NOTE: 用于 API 数据校验和序列化
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class PostBase(BaseModel):
    """文章基础模型"""
    title: str = Field(..., min_length=1, max_length=200)
    excerpt: Optional[str] = None
    content: str = Field(..., min_length=1)
    author: str = Field(default="匿名", max_length=100)
    cover_image: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    read_time: int = Field(default=5, ge=1, le=120)


class PostCreate(PostBase):
    """创建文章请求模型"""
    pass


class PostUpdate(BaseModel):
    """更新文章请求模型"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    excerpt: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1)
    author: Optional[str] = Field(None, max_length=100)
    cover_image: Optional[str] = None
    tags: Optional[list[str]] = None
    read_time: Optional[int] = Field(None, ge=1, le=120)


class PostResponse(PostBase):
    """文章响应模型"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
