"""
文章 API 路由
NOTE: 处理文章相关的 HTTP 请求
"""

import os
import uuid
import base64
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from database import get_db
from schema.post import PostCreate, PostUpdate, PostResponse
from service.post_service import PostService

router = APIRouter(prefix="/api/posts", tags=["posts"])


def get_service(db: Session = Depends(get_db)) -> PostService:
    """依赖注入：获取 PostService 实例"""
    return PostService(db)


@router.get("", response_model=list[PostResponse])
def get_posts(service: PostService = Depends(get_service)):
    """
    获取所有文章
    """
    return service.get_all_posts()


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: str, service: PostService = Depends(get_service)):
    """
    根据 ID 获取文章
    """
    post = service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    return post


@router.post("", response_model=PostResponse, status_code=201)
def create_post(data: PostCreate, service: PostService = Depends(get_service)):
    """
    创建新文章
    """
    return service.create_post(data)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: str, data: PostUpdate, service: PostService = Depends(get_service)):
    """
    更新文章
    """
    post = service.update_post(post_id, data)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    return post


@router.delete("/{post_id}", status_code=204)
def delete_post(post_id: str, service: PostService = Depends(get_service)):
    """
    删除文章
    """
    if not service.delete_post(post_id):
        raise HTTPException(status_code=404, detail="文章不存在")


# 图片上传路由
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    上传图片
    NOTE: 将图片保存到本地并返回访问 URL
    """
    # 验证文件类型
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="只能上传图片文件")

    # 生成唯一文件名
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # 保存文件
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"/api/posts/images/{filename}"}


@router.get("/images/{filename}")
async def get_image(filename: str):
    """获取上传的图片"""
    from fastapi.responses import FileResponse

    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="图片不存在")
    return FileResponse(filepath)
