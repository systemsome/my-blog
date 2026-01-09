"""
业务逻辑层
NOTE: 处理文章相关的业务逻辑
"""

import json
from typing import Optional
from sqlalchemy.orm import Session

from repository.post_repo import PostRepository
from schema.post import PostCreate, PostUpdate, PostResponse
from model.post import Post


class PostService:
    """文章业务逻辑服务"""

    def __init__(self, db: Session):
        self.repo = PostRepository(db)

    def _to_response(self, post: Post) -> PostResponse:
        """
        将 ORM 模型转换为响应模型
        NOTE: 处理 tags 的 JSON 反序列化
        """
        tags = json.loads(post.tags) if post.tags else []
        return PostResponse(
            id=post.id,
            title=post.title,
            excerpt=post.excerpt or "",
            content=post.content,
            author=post.author,
            cover_image=post.cover_image,
            tags=tags,
            read_time=post.read_time,
            created_at=post.created_at,
            updated_at=post.updated_at
        )

    def create_post(self, data: PostCreate) -> PostResponse:
        """创建新文章"""
        post = self.repo.create(
            title=data.title,
            content=data.content,
            excerpt=data.excerpt,
            author=data.author,
            cover_image=data.cover_image,
            tags=data.tags,
            read_time=data.read_time
        )
        return self._to_response(post)

    def get_all_posts(self) -> list[PostResponse]:
        """获取所有文章"""
        posts = self.repo.get_all()
        return [self._to_response(p) for p in posts]

    def get_post(self, post_id: str) -> Optional[PostResponse]:
        """根据 ID 获取文章"""
        post = self.repo.get_by_id(post_id)
        if not post:
            return None
        return self._to_response(post)

    def update_post(self, post_id: str, data: PostUpdate) -> Optional[PostResponse]:
        """更新文章"""
        update_data = data.model_dump(exclude_unset=True)
        post = self.repo.update(post_id, **update_data)
        if not post:
            return None
        return self._to_response(post)

    def delete_post(self, post_id: str) -> bool:
        """删除文章"""
        return self.repo.delete(post_id)
