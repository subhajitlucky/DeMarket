import { Link } from 'react-router-dom'
import '../styles/HomePage.css'

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to DeMarket</h1>
            <p className="hero-subtitle">
              The first decentralized marketplace for fresh fruits & vegetables
            </p>
            <p className="hero-description">
              Buy directly from farmers, support local agriculture, and enjoy the freshest produce 
              with blockchain transparency and security.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Browse Products
              </Link>
              <Link to="/sell" className="btn btn-secondary">
                Start Selling
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-circle"></div>
              <div className="graphic-circle inner"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose DeMarket?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              </div>
              <h3>Blockchain Powered</h3>
              <p>Transparent, secure transactions powered by Ethereum smart contracts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3>No Middlemen</h3>
              <p>Direct farmer-to-consumer sales with fair pricing for everyone</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Fresh & Local</h3>
              <p>Support local farmers and get the freshest produce delivered</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Low Platform Fees</h3>
              <p>Only 2% platform fee to keep the marketplace sustainable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Products Listed</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Happy Farmers</p>
            </div>
            <div className="stat-item">
              <h3>2000+</h3>
              <p>Satisfied Customers</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of farmers and customers already using DeMarket</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
            <Link to="/sell" className="btn btn-outline">
              List Your Products
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}

export default HomePage
