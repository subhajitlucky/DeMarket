import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { BrowserProvider } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getDashboardStats, getUserProducts } from '../utils/contract'
import Overview from '../components/profile/Overview'
import Listings from '../components/profile/Listings'
import Purchases from '../components/profile/Purchases'
import Sales from '../components/profile/Sales'
import '../styles/ProfilePage.css'

const ProfilePage = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
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
    if (isConnected && address && walletClient) {
      loadUserData()
    } else {
      // Reset all data when wallet is disconnected
      setUserStats({
        totalPurchases: 0,
        totalSales: 0,
        totalSpent: '0',
        totalEarned: '0',
        activeProducts: 0
      })
      setPurchaseHistory([])
      setSalesHistory([])
      setUserProducts([])
      setError('')
    }
  }, [isConnected, address])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get provider from walletClient
      const provider = walletClient ? new BrowserProvider(walletClient) : null
      
      if (!provider) {
        setError('Wallet not connected')
        setLoading(false)
        return
      }
      
      // Load both dashboard stats and user products
      const [dashboardData, products] = await Promise.all([
        getDashboardStats(provider, address),
        getUserProducts(provider, address)
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

  return (
    <div className="page-container">
      <div className="profile-page">
        <div className="profile-header">
          <div className="container">
            <div className="profile-info">
              <div className="profile-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="profile-details">
                <h1>My Profile</h1>
                {isConnected ? (
                  <p className="wallet-address">
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <ConnectButton />
                  </div>
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
            {activeTab === 'overview' && (
              <Overview 
                isConnected={isConnected}
                loading={loading}
                userStats={userStats}
                purchaseHistory={purchaseHistory}
                salesHistory={salesHistory}
              />
            )}
            {activeTab === 'listings' && (
              <Listings 
                isConnected={isConnected}
                loading={loading}
                userProducts={userProducts}
              />
            )}
            {activeTab === 'purchases' && (
              <Purchases 
                isConnected={isConnected}
                loading={loading}
                purchaseHistory={purchaseHistory}
              />
            )}
            {activeTab === 'sales' && (
              <Sales 
                isConnected={isConnected}
                loading={loading}
                salesHistory={salesHistory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage