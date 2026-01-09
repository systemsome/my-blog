import { useState } from 'react';
import Header from './components/Header';
import BlogCard from './components/BlogCard';
import BlogDetail from './components/BlogDetail';
import AdminPanel from './components/AdminPanel';
import PostEditor from './components/PostEditor';
import Footer from './components/Footer';
import { usePosts, type BlogPost } from './hooks/usePosts';
import './App.css';

/**
 * 视图类型定义
 */
type ViewType = 'home' | 'detail' | 'admin' | 'editor';

/**
 * 博客应用主组件
 */
function App() {
  const { posts, isLoading, error, createPost, updatePost, deletePost, refreshPosts } = usePosts();

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const goHome = () => {
    setCurrentView('home');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goAdmin = () => {
    setCurrentView('admin');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createNewPost = () => {
    setSelectedPost(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 保存文章（新建或编辑）
   */
  const handleSavePost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedPost) {
        await updatePost(selectedPost.id, postData);
      } else {
        await createPost(postData);
      }
      goAdmin();
    } catch (err) {
      alert('保存失败，请检查后端服务是否运行');
      console.error(err);
    }
  };

  /**
   * 删除文章
   */
  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
    } catch (err) {
      alert('删除失败，请检查后端服务是否运行');
      console.error(err);
    }
  };

  // 错误状态
  if (error && posts.length === 0) {
    return (
      <div className="app">
        <Header currentView={currentView} onNavClick={goHome} onAdminClick={goAdmin} />
        <main className="main-content">
          <div className="error-state">
            <h2>⚠️ 无法连接到后端服务</h2>
            <p>{error}</p>
            <p>请确保后端服务正在运行：</p>
            <code>cd backend && uvicorn main:app --reload</code>
            <button onClick={refreshPosts} className="retry-btn">重试</button>
          </div>
        </main>
      </div>
    );
  }

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

            {posts.length === 0 ? (
              <div className="empty-home">
                <p>暂无文章，去管理页面创建第一篇吧！</p>
                <button onClick={goAdmin} className="go-admin-btn">
                  进入管理
                </button>
              </div>
            ) : (
              <section className="blog-grid">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onClick={viewPost}
                  />
                ))}
              </section>
            )}
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
