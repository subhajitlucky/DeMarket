import { useState, useEffect } from 'react'
import { useWallet } from '../wallet/contexts/WalletContext'
import { getDashboardStats, getUserProducts } from '../utils/contract'
import '../styles/ProfilePage.css'

const ProfilePage = () => {
  const { account, provider, connectWallet, isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState({
    totalPurchases: 0,
    totalSales: 0,
    totalSpent: '0',
    totalEarned: '0',
    activeProducts: 0
  })
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [salesHistory, setSalesHistory] = useState([])
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
      
      // Load both dashboard stats and user products
      const [dashboardData, products] = await Promise.all([
        getDashboardStats(provider, account),
        getUserProducts(provider, account)
      ])
      
      setUserStats({
        totalPurchases: dashboardData.totalPurchases,
        totalSales: dashboardData.totalSales,
        totalSpent: dashboardData.totalSpent,
        totalEarned: dashboardData.totalEarned,
        activeProducts: dashboardData.activeProducts
      })
      
      setPurchaseHistory(dashboardData.recentPurchases)
      setSalesHistory(dashboardData.recentSales)
      setUserProducts(products)
      
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
              <h3>{userStats.activeProducts}</h3>
              <p>Active Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{userStats.totalSales}</h3>
              <p>Products Sold</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <h3>{userStats.totalPurchases}</h3>
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

        {(purchaseHistory.length > 0 || salesHistory.length > 0) && (
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {salesHistory.slice(0, 2).map(sale => (
                <div key={sale.txHash} className="activity-item">
                  <span className="activity-icon">💰</span>
                  <div className="activity-details">
                    <span className="activity-title">Sold {sale.productName}</span>
                    <span className="activity-meta">
                      +{sale.sellerEarned} ETH • {sale.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {purchaseHistory.slice(0, 2).map(purchase => (
                <div key={purchase.txHash} className="activity-item">
                  <span className="activity-icon">�</span>
                  <div className="activity-details">
                    <span className="activity-title">Bought {purchase.productName}</span>
                    <span className="activity-meta">
                      -{purchase.totalPrice} ETH • {purchase.timestamp}
                    </span>
                  </div>
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
      {purchaseHistory.length === 0 ? (
        <div className="empty-state">
          <p>No purchases yet</p>
          <p>Start shopping to see your purchase history here</p>
        </div>
      ) : (
        <div className="history-list">
          {purchaseHistory.map(purchase => (
            <div key={purchase.txHash} className="history-item">
              <div className="item-icon">🛒</div>
              <div className="item-details">
                <h4>{purchase.productName}</h4>
                <p>Quantity: {purchase.quantity}</p>
                <p>Total: {purchase.totalPrice} ETH</p>
                <p>Date: {purchase.timestamp}</p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${purchase.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  View Transaction
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderSales = () => (
    <div className="sales-content">
      <div className="section-header">
        <h3>Sales History</h3>
        <p>Track your successful sales</p>
      </div>
      {salesHistory.length === 0 ? (
        <div className="empty-state">
          <p>No sales yet</p>
          <p>List products to start selling and track your sales here</p>
        </div>
      ) : (
        <div className="history-list">
          {salesHistory.map(sale => (
            <div key={sale.txHash} className="history-item">
              <div className="item-icon">💰</div>
              <div className="item-details">
                <h4>{sale.productName}</h4>
                <p>Quantity Sold: {sale.quantity}</p>
                <p>Total Revenue: {sale.totalPrice} ETH</p>
                <p>Your Earnings: {sale.sellerEarned} ETH</p>
                <p>Platform Fee: {sale.platformFee} ETH</p>
                <p>Date: {sale.timestamp}</p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${sale.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  View Transaction
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
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
