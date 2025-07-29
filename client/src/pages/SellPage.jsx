import { useState } from 'react'
import '../styles/SellPage.css'

const SellPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'fruits',
    description: '',
    image: '🍎'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' }
  ]

  const emojis = [
    '🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒',
    '🥕', '🍅', '🥬', '🥒', '🌽', '🥔', '🍆', '🥦',
    '🥑', '🌶️', '🥜', '🥥'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement blockchain integration
      console.log('Product to list:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Product listed successfully! (Blockchain integration coming soon)')
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        quantity: '',
        category: 'fruits',
        description: '',
        image: '🍎'
      })
    } catch (error) {
      alert('Error listing product: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="sell-page">
        <header className="sell-header">
          <div className="container">
            <h1>List Your Products</h1>
            <p>Sell your fresh produce directly to customers on the blockchain</p>
          </div>
        </header>

        <div className="sell-info">
          <h3>How it works</h3>
          <div className="info-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Fill the form</h4>
                <p>Provide details about your product including name, price, and quantity</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Connect wallet</h4>
                <p>Connect your Web3 wallet to sign the transaction</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>List on blockchain</h4>
                <p>Your product gets listed on the smart contract</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Start selling</h4>
                <p>Customers can now buy your products directly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sell-content">
          <div className="container">
            <div className="sell-form-container">
            <form onSubmit={handleSubmit} className="sell-form">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Fresh Organic Apples"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (ETH) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.1"
                    step="0.001"
                    min="0"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="1"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Icon</label>
                <div className="emoji-selector">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-option ${formData.image === emoji ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell customers about your product..."
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Listing Product...' : 'List Product'}
              </button>
            </form>
          </div>

          <div className="sell-preview">
            <h3>Preview</h3>
            <div className="product-preview">
              <div className="preview-image">
                <span className="preview-emoji">{formData.image}</span>
              </div>
              <div className="preview-info">
                <h4>{formData.name || 'Product Name'}</h4>
                <p className="preview-price">{formData.price || '0'} ETH</p>
                <p className="preview-quantity">Available: {formData.quantity || '0'}</p>
                <p className="preview-category">Category: {formData.category}</p>
                {formData.description && (
                  <p className="preview-description">{formData.description}</p>
                )}
              </div>
            </div>
          </div>
                  </div>
        </div>
      </div>
    </div>
  )
}

export default SellPage
