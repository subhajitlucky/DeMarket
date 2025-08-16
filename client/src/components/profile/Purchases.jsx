import React from 'react';
import '../../styles/ProfilePage.css';

const Purchases = ({ isConnected, connectWallet, loading, purchaseHistory }) => {
  if (!isConnected) {
    return (
      <div className="purchases-content">
        <div className="connect-prompt">
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to view your purchase history</p>
          <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="purchases-content">
        <div className="loading-state">
          <p>Loading your purchase history...</p>
        </div>
      </div>
    );
  }

  // Check if we have valid purchase data
  const hasValidPurchases = purchaseHistory && purchaseHistory.length > 0;

  return (
    <div className="purchases-content">
      <div className="section-header">
        <h3>My Purchases</h3>
        <p>Items you've bought from the marketplace</p>
      </div>
      {!hasValidPurchases ? (
        <div className="empty-state">
          <p>No purchases yet</p>
          <p>Start shopping to see your purchase history here</p>
        </div>
      ) : (
        <div className="history-list">
          {purchaseHistory.map(purchase => (
            <div key={purchase.txHash} className="history-item">
              <div className="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
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
  );
};

export default Purchases;