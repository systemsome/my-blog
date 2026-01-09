import './Footer.css';

/**
 * 页脚组件
 * NOTE: 展示版权信息和社交链接
 */
function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="footer-logo">✨ 技术博客</span>
                    <p className="footer-desc">分享技术，传递知识</p>
                </div>
                <div className="footer-links">
                    <a href="#" className="footer-link">GitHub</a>
                    <a href="#" className="footer-link">Twitter</a>
                    <a href="#" className="footer-link">RSS</a>
                </div>
                <div className="footer-copyright">
                    © {currentYear} 技术博客. 保留所有权利.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
