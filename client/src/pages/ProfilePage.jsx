import { useState, useEffect } from 'react'
import { useWallet } from '../wallet/contexts/WalletContext'
import { getUserProducts } from '../utils/contract'
import '../styles/ProfilePage.css'

const ProfilePage = () => {
  const { account, provider, connectWallet, isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState({
    totalListed: 0,
    totalSold: 0,
    totalBought: 0,
    totalEarned: 0
  })
  const [userProducts, setUserProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isConnected && account && provider) {
      loadUserData()
    }
  }, [isConnected, account, provider])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const products = await getUserProducts(provider, account)
      setUserProducts(products)
      
      // Calculate stats from actual data
      const activeProducts = products.filter(p => p.isActive)
      const soldOutProducts = products.filter(p => !p.isActive || p.quantity === '0')
      
      setUserStats({
        totalListed: products.length,
        totalSold: soldOutProducts.length,
        totalBought: 0, // This would need additional contract events to track
        totalEarned: 0   // This would need additional contract events to track
      })
    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const renderOverview = () => {
    if (!isConnected) {
      return (
        <div className="overview-content">
          <div className="connect-prompt">
            <h3>Connect Your Wallet</h3>
            <p>Connect your wallet to view your profile and manage your products</p>
            <button onClick={connectWallet} className="connect-btn">
              Connect Wallet
            </button>
          </div>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="overview-content">
          <div className="loading-state">
            <p>Loading your profile data...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="overview-content">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadUserData} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return (
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
              <p>Products Sold</p>
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

        {userProducts.length > 0 && (
          <div className="recent-activity">
            <h3>Your Recent Products</h3>
            <div className="activity-list">
              {userProducts.slice(0, 3).map(product => (
                <div key={product.id} className="activity-item">
                  <span className="activity-icon">📦</span>
                  <span className="activity-text">
                    {product.name} - {product.price} ETH ({product.quantity} available)
                  </span>
                  <span className={`activity-status ${product.status}`}>
                    {product.status === 'active' ? 'Active' : 'Sold Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderListings = () => {
    if (!isConnected) {
      return (
        <div className="listings-content">
          <div className="connect-prompt">
            <h3>Connect Your Wallet</h3>
            <p>Connect your wallet to view your listings</p>
            <button onClick={connectWallet} className="connect-btn">
              Connect Wallet
            </button>
          </div>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="listings-content">
          <div className="loading-state">
            <p>Loading your listings...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="listings-content">
        <div className="section-header">
          <h3>My Listings</h3>
          <p>Manage your products on the marketplace</p>
        </div>
        {userProducts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't listed any products yet.</p>
            <p>Start selling by creating your first listing!</p>
          </div>
        ) : (
          <div className="items-grid">
            {userProducts.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-image">
                  <span className="item-emoji">📦</span>
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-price">{item.price} ETH each</p>
                  <p className="item-quantity">Available: {item.quantity}</p>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === 'active' ? 'Active' : 'Sold Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderPurchases = () => (
    <div className="purchases-content">
      <div className="section-header">
        <h3>My Purchases</h3>
        <p>Items you've bought from the marketplace</p>
      </div>
      <div className="coming-soon">
        <h4>Coming Soon!</h4>
        <p>Purchase history tracking will be available in a future update.</p>
        <p>This feature requires additional smart contract events to track buyer history.</p>
      </div>
    </div>
  )

  const renderSales = () => (
    <div className="sales-content">
      <div className="section-header">
        <h3>Sales History</h3>
        <p>Track your successful sales</p>
      </div>
      <div className="coming-soon">
        <h4>Coming Soon!</h4>
        <p>Sales history tracking will be available in a future update.</p>
        <p>This feature requires additional smart contract events to track sales data.</p>
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
                {isConnected ? (
                  <p className="wallet-address">
                    Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
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
