import { useState, useEffect } from 'react'
import '../styles/ProductsPage.css'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data for now - will be replaced with blockchain data
  const mockProducts = [
    {
      id: 1,
      name: "Fresh Apples",
      price: "0.1",
      quantity: 10,
      category: "fruits",
      seller: "0x742d35Cc6634C0532925a3b8D32f",
      image: "🍎",
      isActive: true
    },
    {
      id: 2,
      name: "Organic Carrots",
      price: "0.05",
      quantity: 20,
      category: "vegetables",
      seller: "0x742d35Cc6634C0532925a3b8D32f",
      image: "🥕",
      isActive: true
    },
    {
      id: 3,
      name: "Fresh Tomatoes",
      price: "0.08",
      quantity: 15,
      category: "vegetables",
      seller: "0x742d35Cc6634C0532925a3b8D32f",
      image: "🍅",
      isActive: true
    },
    {
      id: 4,
      name: "Sweet Bananas",
      price: "0.06",
      quantity: 25,
      category: "fruits",
      seller: "0x742d35Cc6634C0532925a3b8D32f",
      image: "🍌",
      isActive: true
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.isActive
  })

  const handleBuyProduct = (productId) => {
    // TODO: Implement blockchain purchase logic
    alert(`Buying product ${productId} - Blockchain integration coming soon!`)
  }

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
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
            <p>Discover the best fruits and vegetables from local farmers</p>
          </div>
        </header>

        <div className="products-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </div>
        </div>

        <div className="container">
          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <span className="product-emoji">{product.image}</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price} ETH</p>
                    <p className="product-quantity">Available: {product.quantity}</p>
                    <p className="product-seller">
                      Seller: {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                    </p>
                  </div>
                  <div className="product-actions">
                    <div className="quantity-selector">
                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        defaultValue="1"
                        className="quantity-input"
                      />
                    </div>
                    <button
                      onClick={() => handleBuyProduct(product.id)}
                      className="buy-button"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
