import React from 'react';
import '../../styles/ProfilePage.css';

const Overview = ({ isConnected, connectWallet, loading, userStats, purchaseHistory, salesHistory }) => {
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
    );
  }

  if (loading) {
    return (
      <div className="overview-content">
        <div className="loading-state">
          <p>Loading your profile data...</p>
        </div>
      </div>
    );
  }

  // Check if we have valid data
  const hasValidData = userStats && (
    (userStats.totalPurchases && userStats.totalPurchases > 0) || 
    (userStats.totalSales && userStats.totalSales > 0) || 
    (userStats.activeProducts && userStats.activeProducts > 0) ||
    (purchaseHistory && purchaseHistory.length > 0) || 
    (salesHistory && salesHistory.length > 0)
  );

  if (!hasValidData) {
    return (
      <div className="overview-content">
        <div className="empty-state">
          <p>No activity yet</p>
          <p>Start buying or selling to see your activity here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{userStats.activeProducts || 0}</h3>
            <p>Active Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{userStats.totalSales || 0}</h3>
            <p>Products Sold</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{userStats.totalPurchases || 0}</h3>
            <p>Items Bought</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{userStats.totalEarned || '0'} ETH</h3>
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
                <div className="activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
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
                <div className="activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
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
  );
};

export default Overview;