import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [walletError, setWalletError] = useState('')

  console.log('🔧 WalletProvider State:', { account, isConnecting, chainId })

  // Auto-clear wallet error after 5 seconds
  useEffect(() => {
    if (walletError) {
      const timer = setTimeout(() => setWalletError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [walletError])

  useEffect(() => {
    console.log('🚀 WalletProvider useEffect running...')
    checkConnection()
    if (window.ethereum) {
      console.log('✅ MetaMask detected, adding event listeners')
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    } else {
      console.log('❌ MetaMask not detected')
    }
    return () => {
      if (window.ethereum) {
        console.log('🧹 Cleaning up wallet event listeners')
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    console.log('🔍 Checking existing wallet connection...')
    try {
      if (window.ethereum) {
        console.log('✅ MetaMask found, creating provider...')
        const provider = new ethers.BrowserProvider(window.ethereum)
        
        // Try to get accounts without requesting permission
        const accounts = await provider.listAccounts()
        console.log('📋 Found accounts:', accounts.length)
        
        if (accounts.length > 0) {
          console.log('🔗 Found existing connection, setting up...')
          const signer = await provider.getSigner()
          const network = await provider.getNetwork()
          setProvider(provider)
          setSigner(signer)
          setAccount(accounts[0].address)
          setChainId(network.chainId.toString())
          console.log('✅ Connection restored:', accounts[0].address)
        } else {
          console.log('📭 No connected accounts found')
          // Try to check if we can access accounts via a different method
          try {
            const ethAccounts = await window.ethereum.request({ method: 'eth_accounts' })
            console.log('🔍 Alternative account check:', ethAccounts.length)
            if (ethAccounts.length > 0) {
              const signer = await provider.getSigner()
              const network = await provider.getNetwork()
              setProvider(provider)
              setSigner(signer)
              setAccount(ethAccounts[0])
              setChainId(network.chainId.toString())
              console.log('✅ Connection restored via eth_accounts:', ethAccounts[0])
            }
          } catch {
            console.log('ℹ️ No existing connection found (this is normal)')
          }
        }
      } else {
        console.log('❌ MetaMask not found in window.ethereum')
      }
    } catch (error) {
      console.error('❌ Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    console.log('🚀 Connect wallet button clicked!')
    
    // Clear previous errors
    setWalletError('')
    
    // Prevent multiple connection attempts
    if (isConnecting) {
      console.log('⚠️ Already connecting, ignoring click')
      return
    }
    
    try {
      if (!window.ethereum) {
        console.log('❌ MetaMask not installed')
        setWalletError('MetaMask is not installed. Please install MetaMask to use this dApp.')
        return
      }
      
      console.log('⏳ Setting isConnecting to true...')
      setIsConnecting(true)
      
      console.log('🔐 Requesting account access...')
      
      // Try a more direct approach first
      let accounts
      try {
        // Method 1: Direct request with shorter timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts',
          signal: controller.signal 
        })
        clearTimeout(timeoutId)
        console.log('✅ Got accounts via eth_requestAccounts:', accounts)
      } catch (requestError) {
        console.log('⚠️ eth_requestAccounts failed, trying alternative method:', requestError.message)
        
        // Method 2: Try enabling directly
        try {
          accounts = await window.ethereum.enable()
          console.log('✅ Got accounts via enable():', accounts)
        } catch (enableError) {
          console.log('⚠️ enable() also failed:', enableError.message)
          throw new Error('Unable to connect to MetaMask. Please check if MetaMask is unlocked and try again.')
        }
      }
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask')
      }
      
      console.log('🏗️ Creating provider and signer...')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      
      console.log('💾 Setting wallet state...', { address, chainId: network.chainId.toString() })
      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setChainId(network.chainId.toString())
      
      console.log('✅ Wallet connected successfully:', address)
    } catch (error) {
      console.error('❌ Error connecting wallet:', error)
      if (error.code === 4001) {
        console.log('🚫 User rejected connection request')
        setWalletError('Please connect to MetaMask.')
      } else if (error.name === 'AbortError') {
        console.log('⏰ Connection timed out')
        setWalletError('Connection timed out. Please make sure MetaMask is unlocked and try again.')
      } else {
        console.log('💥 Unknown error occurred:', error.message)
        setWalletError('An error occurred while connecting to the wallet: ' + error.message)
      }
    } finally {
      console.log('🏁 Setting isConnecting to false...')
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    console.log('🔌 Disconnecting wallet...')
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setWalletError('')
    console.log('✅ Wallet disconnected')
  }

  const clearWalletError = () => {
    setWalletError('')
  }

  const handleAccountsChanged = (accounts) => {
    console.log('🔄 Accounts changed:', accounts)
    if (accounts.length === 0) {
      console.log('📭 No accounts, disconnecting...')
      disconnectWallet()
    } else if (accounts[0] !== account) {
      console.log('🔄 Account changed to:', accounts[0])
      setAccount(accounts[0])
    }
  }

  const handleChainChanged = (chainId) => {
    console.log('🔗 Chain changed to:', chainId)
    setChainId(parseInt(chainId, 16).toString())
    console.log('🔄 Reloading page due to chain change...')
    window.location.reload()
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    walletError,
    connectWallet,
    disconnectWallet,
    clearWalletError,
    formatAddress,
    isConnected: !!account
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
