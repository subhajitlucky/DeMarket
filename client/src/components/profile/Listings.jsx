import React from 'react';
import '../../styles/ProfilePage.css';

const Listings = ({ isConnected, connectWallet, loading, userProducts }) => {
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
    );
  }

  if (loading) {
    return (
      <div className="listings-content">
        <div className="loading-state">
          <p>Loading your listings...</p>
        </div>
      </div>
    );
  }

  // Check if we have valid user products data
  const hasValidProducts = userProducts && userProducts.length > 0;

  return (
    <div className="listings-content">
      <div className="section-header">
        <h3>My Listings</h3>
        <p>Manage your products on the marketplace</p>
      </div>
      {!hasValidProducts ? (
        <div className="empty-state">
          <p>You haven't listed any products yet.</p>
          <p>Start selling by creating your first listing!</p>
        </div>
      ) : (
        <div className="items-grid">
          {userProducts.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                <div className="item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
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
  );
};

export default Listings;