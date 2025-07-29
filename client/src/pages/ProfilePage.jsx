import { useState, useEffect } from 'react'
import '../styles/ProfilePage.css'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState({
    totalListed: 0,
    totalSold: 0,
    totalBought: 0,
    totalEarned: 0,
    address: null
  })

  // Mock data - will be replaced with blockchain data
  const mockListings = [
    { id: 1, name: 'Fresh Apples', price: '0.1', quantity: 10, sold: 3, status: 'active', image: '🍎' },
    { id: 2, name: 'Organic Carrots', price: '0.05', quantity: 20, sold: 15, status: 'active', image: '🥕' },
    { id: 3, name: 'Sweet Bananas', price: '0.06', quantity: 25, sold: 25, status: 'sold-out', image: '🍌' }
  ]

  const mockPurchases = [
    { id: 1, name: 'Fresh Tomatoes', price: '0.08', quantity: 2, total: '0.16', date: '2025-01-15', image: '🍅' },
    { id: 2, name: 'Green Lettuce', price: '0.04', quantity: 1, total: '0.04', date: '2025-01-14', image: '🥬' },
    { id: 3, name: 'Red Peppers', price: '0.07', quantity: 3, total: '0.21', date: '2025-01-13', image: '🌶️' }
  ]

  const mockSales = [
    { id: 1, product: 'Fresh Apples', buyer: '0x742d35Cc6634C0532925a3b8D32f', quantity: 2, total: '0.2', date: '2025-01-15' },
    { id: 2, product: 'Organic Carrots', buyer: '0x851d35Cc6634C0532925a3b8D42g', quantity: 5, total: '0.25', date: '2025-01-14' },
    { id: 3, product: 'Sweet Bananas', buyer: '0x962e46Dd7634D0542925b4c8E53h', quantity: 10, total: '0.6', date: '2025-01-13' }
  ]

  useEffect(() => {
    // Simulate loading user data
    setUserStats({
      totalListed: mockListings.length,
      totalSold: mockSales.length,
      totalBought: mockPurchases.length,
      totalEarned: mockSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0).toFixed(3),
      address: '0x742d35Cc6634C0532925a3b8D32f485'
    })
  }, [])

  const connectWallet = async () => {
    // TODO: Implement wallet connection
    alert('Wallet connection coming soon!')
  }

  const renderOverview = () => (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{userStats.totalListed}</h3>
            <p>Products Listed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{userStats.totalSold}</h3>
            <p>Sales Made</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{userStats.totalBought}</h3>
            <p>Items Bought</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-info">
            <h3>{userStats.totalEarned} ETH</h3>
            <p>Total Earned</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <span className="activity-text">Sold 2 Fresh Apples for 0.2 ETH</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🛒</span>
            <span className="activity-text">Bought 2 Fresh Tomatoes for 0.16 ETH</span>
            <span className="activity-time">1 day ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📦</span>
            <span className="activity-text">Listed Organic Carrots for sale</span>
            <span className="activity-time">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderListings = () => (
    <div className="listings-content">
      <div className="section-header">
        <h3>My Listings</h3>
        <p>Manage your products on the marketplace</p>
      </div>
      <div className="items-grid">
        {mockListings.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <span className="item-emoji">{item.image}</span>
            </div>
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">{item.price} ETH each</p>
              <p className="item-quantity">Available: {item.quantity - item.sold}</p>
              <p className="item-sold">Sold: {item.sold}</p>
              <span className={`status-badge ${item.status}`}>
                {item.status === 'active' ? 'Active' : 'Sold Out'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPurchases = () => (
    <div className="purchases-content">
      <div className="section-header">
        <h3>My Purchases</h3>
        <p>Items you've bought from the marketplace</p>
      </div>
      <div className="items-grid">
        {mockPurchases.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              <span className="item-emoji">{item.image}</span>
            </div>
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">{item.price} ETH each</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
              <p className="item-total">Total: {item.total} ETH</p>
              <p className="item-date">Date: {item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSales = () => (
    <div className="sales-content">
      <div className="section-header">
        <h3>Sales History</h3>
        <p>Track your successful sales</p>
      </div>
      <div className="sales-table">
        <div className="table-header">
          <span>Product</span>
          <span>Buyer</span>
          <span>Quantity</span>
          <span>Total</span>
          <span>Date</span>
        </div>
        {mockSales.map(sale => (
          <div key={sale.id} className="table-row">
            <span>{sale.product}</span>
            <span className="buyer-address">
              {sale.buyer.slice(0, 6)}...{sale.buyer.slice(-4)}
            </span>
            <span>{sale.quantity}</span>
            <span className="total-amount">{sale.total} ETH</span>
            <span>{sale.date}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="profile-page">
        <div className="profile-header">
          <div className="container">
            <div className="profile-info">
              <div className="profile-avatar">👤</div>
              <div className="profile-details">
                <h1>My Profile</h1>
                {userStats.address ? (
                  <p className="wallet-address">
                    Connected: {userStats.address.slice(0, 6)}...{userStats.address.slice(-4)}
                  </p>
                ) : (
                  <button onClick={connectWallet} className="connect-btn">
                    Connect Wallet
                </button>
              )}
            </div>
          </div>
          </div>
        </div>

        <div className="profile-tabs">
          <div className="container">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              My Listings
            </button>
            <button
              className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              Purchases
            </button>
            <button
              className={`tab-button ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </button>
          </div>
        </div>

        <div className="container">
          <div className="profile-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'listings' && renderListings()}
            {activeTab === 'purchases' && renderPurchases()}
            {activeTab === 'sales' && renderSales()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
