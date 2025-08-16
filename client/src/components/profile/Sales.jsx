import React from 'react';
import '../../styles/ProfilePage.css';

const Sales = ({ isConnected, connectWallet, loading, salesHistory }) => {
  if (!isConnected) {
    return (
      <div className="sales-content">
        <div className="connect-prompt">
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to view your sales history</p>
          <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sales-content">
        <div className="loading-state">
          <p>Loading your sales history...</p>
        </div>
      </div>
    );
  }

  // Check if we have valid sales data
  const hasValidSales = salesHistory && salesHistory.length > 0;

  return (
    <div className="sales-content">
      <div className="section-header">
        <h3>Sales History</h3>
        <p>Track your successful sales</p>
      </div>
      {!hasValidSales ? (
        <div className="empty-state">
          <p>No sales yet</p>
          <p>List products to start selling and track your sales here</p>
        </div>
      ) : (
        <div className="history-list">
          {salesHistory.map(sale => (
            <div key={sale.txHash} className="history-item">
              <div className="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
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
  );
};

export default Sales;