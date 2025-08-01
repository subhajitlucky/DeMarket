import React from 'react'
import { useWallet } from '../contexts/WalletContext'
import '../styles/WalletConnect.css'

const WalletConnect = () => {
  const { 
    account, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
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
    if (isConnecting) {
      console.log('⚠️ Already connecting, user clicked again - this might indicate a stuck state')
      // Allow user to reset if they click again while connecting
      const userConfirmed = window.confirm('Connection is in progress. Click OK to reset and try again.')
      if (userConfirmed) {
        console.log('🔄 User requested reset')
        // This will force a reset
        window.location.reload()
        return
      }
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
      <button 
        className={`wallet-connect-btn ${isConnecting ? 'connecting' : ''}`}
        onClick={handleConnectClick}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {isConnecting && (
        <button 
          className="wallet-reset-btn"
          onClick={() => window.location.reload()}
          title="Reset if stuck"
        >
          Reset
        </button>
      )}
    </div>
  )
}

export default WalletConnect
