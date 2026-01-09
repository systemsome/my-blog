"""
博客 ORM 模型
NOTE: 定义文章的数据库表结构
"""

from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Post(Base):
    """文章模型"""
    __tablename__ = "posts"

    id = Column(String(36), primary_key=True)
    title = Column(String(200), nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    author = Column(String(100), default="匿名")
    cover_image = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)  # JSON 字符串存储
    read_time = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
