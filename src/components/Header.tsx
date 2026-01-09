import './Header.css';

interface HeaderProps {
    currentView: string;
    onNavClick: () => void;
    onAdminClick: () => void;
}

/**
 * 顶部导航组件
 * NOTE: 展示博客标题和导航链接
 */
function Header({ currentView, onNavClick, onAdminClick }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo" onClick={onNavClick} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">✨</span>
                    <span className="logo-text">技术博客</span>
                </div>
                <nav className="header-nav">
                    <a
                        href="#"
                        className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavClick(); }}
                    >
                        首页
                    </a>
                    <a href="#" className="nav-link">文章</a>
                    <a href="#" className="nav-link">关于</a>
                    <a
                        href="#"
                        className={`nav-link admin-link ${currentView === 'admin' || currentView === 'editor' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onAdminClick(); }}
                    >
                        ⚙️ 管理
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
