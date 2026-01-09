import { useState } from 'react';
import Header from './components/Header';
import BlogCard from './components/BlogCard';
import BlogDetail from './components/BlogDetail';
import AdminPanel from './components/AdminPanel';
import PostEditor from './components/PostEditor';
import Footer from './components/Footer';
import { usePosts } from './hooks/usePosts';
import type { BlogPost } from './types/blog';
import './App.css';

/**
 * 视图类型定义
 * NOTE: 用于管理应用的不同页面状态
 */
type ViewType = 'home' | 'detail' | 'admin' | 'editor';

/**
 * 博客应用主组件
 * NOTE: 管理视图状态和全局数据
 */
function App() {
  const { posts, isLoading, createPost, updatePost, deletePost } = usePosts();

  // 当前视图
  const [currentView, setCurrentView] = useState<ViewType>('home');
  // 当前查看/编辑的文章
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  /**
   * 导航到首页
   */
  const goHome = () => {
    setCurrentView('home');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 导航到管理页面
   */
  const goAdmin = () => {
    setCurrentView('admin');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 查看文章详情
   */
  const viewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 编辑文章
   */
  const editPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 新建文章
   */
  const createNewPost = () => {
    setSelectedPost(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 保存文章（新建或编辑）
   */
  const handleSavePost = (postData: Omit<BlogPost, 'id'>) => {
    if (selectedPost) {
      // 编辑模式
      updatePost(selectedPost.id, postData);
    } else {
      // 新建模式
      createPost(postData);
    }
    goAdmin();
  };

  /**
   * 删除文章
   */
  const handleDeletePost = (id: string) => {
    deletePost(id);
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="app">
        <Header currentView={currentView} onNavClick={goHome} onAdminClick={goAdmin} />
        <main className="main-content">
          <div className="loading">加载中...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        currentView={currentView}
        onNavClick={goHome}
        onAdminClick={goAdmin}
      />

      <main className="main-content">
        {currentView === 'home' && (
          <>
            <section className="hero">
              <h1 className="hero-title">
                探索<span className="gradient-text">前沿技术</span>
              </h1>
              <p className="hero-subtitle">
                深入浅出的技术文章，帮助你掌握最新的开发技能
              </p>
            </section>

            <section className="blog-grid">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onClick={viewPost}
                />
              ))}
            </section>
          </>
        )}

        {currentView === 'detail' && selectedPost && (
          <BlogDetail post={selectedPost} onBack={goHome} />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            posts={posts}
            onEdit={editPost}
            onDelete={handleDeletePost}
            onCreateNew={createNewPost}
            onBack={goHome}
          />
        )}

        {currentView === 'editor' && (
          <PostEditor
            post={selectedPost}
            onSave={handleSavePost}
            onCancel={goAdmin}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
