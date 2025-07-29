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
            <div className="hero-emoji">🌾🍎🥕🍅</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose DeMarket?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Blockchain Powered</h3>
              <p>Transparent, secure transactions powered by Ethereum smart contracts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚫</div>
              <h3>No Middlemen</h3>
              <p>Direct farmer-to-consumer sales with fair pricing for everyone</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Fresh & Local</h3>
              <p>Support local farmers and get the freshest produce delivered</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
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
