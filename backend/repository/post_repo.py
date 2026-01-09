"""
数据库操作层
NOTE: 封装所有数据库 CRUD 操作
"""

import json
import uuid
from typing import Optional
from sqlalchemy.orm import Session

from model.post import Post


class PostRepository:
    """文章数据库操作类"""

    def __init__(self, db: Session):
        self.db = db

    def create(self, title: str, content: str, excerpt: Optional[str] = None,
               author: str = "匿名", cover_image: Optional[str] = None,
               tags: list[str] = None, read_time: int = 5) -> Post:
        """
        创建新文章
        """
        post = Post(
            id=str(uuid.uuid4()),
            title=title,
            content=content,
            excerpt=excerpt or content[:100] + "...",
            author=author,
            cover_image=cover_image,
            tags=json.dumps(tags or [], ensure_ascii=False),
            read_time=read_time
        )
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        return post

    def get_all(self) -> list[Post]:
        """获取所有文章"""
        return self.db.query(Post).order_by(Post.created_at.desc()).all()

    def get_by_id(self, post_id: str) -> Optional[Post]:
        """根据 ID 获取文章"""
        return self.db.query(Post).filter(Post.id == post_id).first()

    def update(self, post_id: str, **kwargs) -> Optional[Post]:
        """
        更新文章
        """
        post = self.get_by_id(post_id)
        if not post:
            return None

        # NOTE: 处理 tags 字段的 JSON 序列化
        if "tags" in kwargs and kwargs["tags"] is not None:
            kwargs["tags"] = json.dumps(kwargs["tags"], ensure_ascii=False)

        for key, value in kwargs.items():
            if value is not None and hasattr(post, key):
                setattr(post, key, value)

        self.db.commit()
        self.db.refresh(post)
        return post

    def delete(self, post_id: str) -> bool:
        """删除文章"""
        post = self.get_by_id(post_id)
        if not post:
            return False
        self.db.delete(post)
        self.db.commit()
        return True
