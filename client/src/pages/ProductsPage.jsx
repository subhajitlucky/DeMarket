import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { BrowserProvider } from 'ethers'
import { getAllProducts, buyProduct, getDefaultProvider } from '../utils/contract'
import '../styles/ProductsPage.css'

const ProductsPage = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [buyingProduct, setBuyingProduct] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadProducts()
  }, [isConnected])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const loadProducts = async () => {
    setLoading(true)
    setErrorMessage('') // Clear any previous error messages
    
    try {
      // Always use default provider for reading products (no wallet needed)
      console.log('🌐 Loading products with default provider...')
      const currentProvider = await getDefaultProvider()
      
      const allProducts = await getAllProducts(currentProvider)
      setProducts(allProducts.filter(product => !product.sold))
    } catch (err) {
      setErrorMessage('Failed to load products. Please try again.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch && product.isActive
  })

  const handleBuyProduct = async (product, quantity = 1) => {
    // Clear previous messages
    setSuccessMessage('')
    setErrorMessage('')

    if (!isConnected || !walletClient) {
      setErrorMessage('Please connect your wallet to buy products')
      return
    }

    if (product.seller.toLowerCase() === address.toLowerCase()) {
      setErrorMessage('You cannot buy your own product')
      return
    }

    setBuyingProduct(product.id)
    try {
      // Get signer from walletClient
      const provider = new BrowserProvider(walletClient)
      const signer = await provider.getSigner()
      
      const totalPrice = parseFloat(product.price) * quantity
      const result = await buyProduct(signer, product.id, quantity, totalPrice)
      
      if (result.success) {
        setSuccessMessage(`Product purchased successfully! Transaction: ${result.txHash}`)
        loadProducts()
      } else {
        setErrorMessage(`Error purchasing product: ${result.error}`)
      }
    } catch (error) {
      setErrorMessage(`Error purchasing product: ${error.message}`)
    } finally {
      setBuyingProduct(null)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="products-page">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products from blockchain...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="products-page">
        <div className="products-header">
          <div className="container">
            <div className="header-content">
              <div className="header-text">
                <h1>Fresh Products</h1>
                <p>Discover products from local sellers on the blockchain</p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">{filteredProducts.length}</span>
                  <span className="stat-label">Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products-filters">
          <div className="container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        <div className="container">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h3>No products found</h3>
              <p>
                {products.length === 0 
                  ? "No products are currently listed on the marketplace. Be the first to sell something!"
                  : "No products match your search criteria. Try a different search term."
                }
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => {
                const isOwnProduct = address && product.seller.toLowerCase() === address.toLowerCase();
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <div className="product-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="product-content">
                      <div className="product-header">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">{product.price} ETH</p>
                      </div>
                      <div className="product-details">
                        <div className="detail-row">
                          <span className="detail-label">Available:</span>
                          <span className="detail-value">{product.quantity}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Seller:</span>
                          <span className="detail-value seller-address" title={product.seller}>
                            {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                          </span>
                        </div>
                      </div>
                      <div className="product-actions">
                        {isOwnProduct ? (
                          <button className="btn btn-secondary" disabled>
                            Your Product
                          </button>
                        ) : !isConnected ? (
                          <button className="btn btn-primary">
                            Connect Wallet to Buy
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleBuyProduct(product)}
                            disabled={buyingProduct === product.id}
                          >
                            {buyingProduct === product.id ? (
                              <>
                                <span className="loading-spinner"></span>
                                Purchasing...
                              </>
                            ) : (
                              'Buy Now'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
