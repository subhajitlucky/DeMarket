import { useState } from 'react'
import { useWallet } from '../wallet/contexts/WalletContext'
import { addProduct } from '../utils/contract'
import '../styles/SellPage.css'

const SellPage = () => {
  const { signer, isConnected } = useWallet()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'fruits',
    description: '',
    image: '🍎'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const categories = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' }
  ]

  const icons = [
    '🍎', '🥕', '🍇', '🥬', '🌽', '🍓', '🥔', '🥦',
    '🍊', '🥒', '🍒', '🍆', '🍑', '🍌', '🥝', '🥑'
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
    
    if (!isConnected || !signer) {
      setErrorMessage('Please connect your wallet to list products')
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const result = await addProduct(
        signer, 
        formData.name, 
        formData.price, 
        parseInt(formData.quantity)
      )
      
      if (result.success) {
        setSuccessMessage(`"${formData.name}" listed successfully on the blockchain! Transaction: ${result.txHash.slice(0, 10)}...`)
        
        // Reset form after success
        setFormData({
          name: '',
          price: '',
          quantity: '',
          category: 'fruits',
          description: '',
          image: '🍎'
        })
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setErrorMessage('Failed to list product: ' + result.error)
      }
    } catch (error) {
      setErrorMessage('Error listing product: ' + error.message)
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
                  {icons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`emoji-option ${formData.image === icon ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, image: icon }))}
                    >
                      {icon}
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

              {/* Success/Error Messages */}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Listing Product...
                  </>
                ) : (
                  'List Product'
                )}
              </button>
            </form>
          </div>

          <div className="sell-preview">
            <h3>Preview</h3>
            <div className="product-preview">
              <div className="preview-image">
                <div className="preview-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
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
