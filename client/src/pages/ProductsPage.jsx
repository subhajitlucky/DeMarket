import { useState, useEffect } from 'react'
import { useWallet } from '../wallet/contexts/WalletContext'
import { getAllProducts, buyProduct } from '../utils/contract'
import '../styles/ProductsPage.css'

const ProductsPage = () => {
  const { provider, signer, isConnected, account } = useWallet()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [buyingProduct, setBuyingProduct] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [provider])

  const loadProducts = async () => {
    setLoading(true)
    try {
      if (provider) {
        const blockchainProducts = await getAllProducts(provider)
        setProducts(blockchainProducts)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch && product.isActive
  })

  const handleBuyProduct = async (product, quantity = 1) => {
    if (!isConnected || !signer) {
      alert('Please connect your wallet to buy products')
      return
    }

    if (product.seller.toLowerCase() === account.toLowerCase()) {
      alert('You cannot buy your own product')
      return
    }

    setBuyingProduct(product.id)
    try {
      const totalPrice = parseFloat(product.price) * quantity
      const result = await buyProduct(signer, product.id, quantity, totalPrice)
      
      if (result.success) {
        alert('Product purchased successfully!')
        loadProducts()
      } else {
        alert('Error purchasing product: ' + result.error)
      }
    } catch (error) {
      alert('Error purchasing product: ' + error.message)
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
        <header className="products-header">
          <div className="container">
            <h1>Fresh Products</h1>
            <p>Discover products from local sellers on the blockchain</p>
          </div>
        </header>

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

        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
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
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <span className="product-emoji">📦</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price} ETH</p>
                    <p className="product-quantity">Available: {product.quantity}</p>
                    <p className="product-seller">
                      Seller: {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                    </p>
                    <button 
                      className="buy-button"
                      onClick={() => handleBuyProduct(product)}
                      disabled={
                        buyingProduct === product.id || 
                        !isConnected || 
                        product.seller.toLowerCase() === account?.toLowerCase()
                      }
                    >
                      {buyingProduct === product.id 
                        ? 'Purchasing...' 
                        : product.seller.toLowerCase() === account?.toLowerCase()
                        ? 'Your Product'
                        : !isConnected 
                        ? 'Connect Wallet'
                        : 'Buy Now'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
