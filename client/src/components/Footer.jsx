import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🥕 DeMarket</h3>
          <p>Decentralized marketplace for fresh fruits & vegetables</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/sell">Sell</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Discord">💬</a>
            <a href="#" aria-label="GitHub">🐙</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 DeMarket. Built on Ethereum. Made with ❤️ for farmers.</p>
      </div>
    </footer>
  )
}

export default Footer
