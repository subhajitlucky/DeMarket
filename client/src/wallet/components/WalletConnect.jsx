import React from 'react'
import { useWallet } from '../contexts/WalletContext'
import '../styles/WalletConnect.css'

const WalletConnect = () => {
  const { 
    account, 
    isConnecting, 
    walletError,
    connectWallet, 
    disconnectWallet, 
    clearWalletError,
    formatAddress,
    isConnected 
  } = useWallet()

  console.log('🖱️ WalletConnect Component State:', { 
    account, 
    isConnecting, 
    isConnected,
    hasConnectWallet: !!connectWallet 
  })

  const handleConnectClick = () => {
    console.log('🎯 Connect button clicked!')
    
    // Clear any existing errors
    if (clearWalletError) {
      clearWalletError()
    }
    
    if (isConnecting) {
      console.log('⚠️ Already connecting, user clicked again - this might indicate a stuck state')
      return
    }
    
    if (connectWallet) {
      connectWallet()
    } else {
      console.error('❌ connectWallet function not available')
    }
  }

  const handleDisconnectClick = () => {
    console.log('🎯 Disconnect button clicked!')
    if (disconnectWallet) {
      disconnectWallet()
    } else {
      console.error('❌ disconnectWallet function not available')
    }
  }

  if (isConnected) {
    console.log('✅ Rendering connected state')
    return (
      <div className="wallet-connected">
        <span className="wallet-address" title={account}>
          {formatAddress(account)}
        </span>
        <button 
          className="wallet-disconnect-btn"
          onClick={handleDisconnectClick}
          title="Disconnect Wallet"
        >
          Disconnect
        </button>
      </div>
    )
  }

  console.log('🔌 Rendering connect button state')
  return (
    <div className="wallet-connect-container">
      {/* Error Message Display */}
      {walletError && (
        <div className="wallet-error-message">
          <span>{walletError}</span>
          <button 
            className="error-close-btn"
            onClick={clearWalletError}
            title="Close error message"
          >
            ×
          </button>
        </div>
      )}
      
      <button 
        className={`wallet-connect-btn ${isConnecting ? 'connecting' : ''}`}
        onClick={handleConnectClick}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      {isConnecting && (
        <div className="connecting-status">
          <span className="loading-spinner"></span>
          <span>Please check MetaMask...</span>
        </div>
      )}
    </div>
  )
}

export default WalletConnect
