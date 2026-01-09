"""
博客后端 API 入口
NOTE: FastAPI 应用主文件
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from api.posts import router as posts_router

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理
    NOTE: 启动时初始化数据库
    """
    logger.info("正在初始化数据库...")
    init_db()
    logger.info("数据库初始化完成")
    yield
    logger.info("应用关闭")


app = FastAPI(
    title="博客 API",
    description="博客文章管理 API",
    version="1.0.0",
    lifespan=lifespan
)

# 配置 CORS
# NOTE: 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(posts_router)


@app.get("/")
def root():
    """API 根路径"""
    return {"message": "博客 API 服务运行中", "version": "1.0.0"}


@app.get("/health")
def health_check():
    """健康检查端点"""
    return {"status": "healthy"}
