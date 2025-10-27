import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { BrowserProvider } from 'ethers'
import { addProduct } from '../utils/contract'
import '../styles/SellPage.css'

const categories = [
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
]

const listingChecklist = [
  {
    title: 'Harvest details',
    description: 'Buyers will see the product name, category, and quantity exactly as you submit it.',
  },
  {
    title: 'Transparent pricing',
    description: 'Set the ETH price you want to receive. Platform fees are calculated automatically.',
  },
  {
    title: 'Wallet ready',
    description: 'Confirm the listing transaction from your connected wallet to publish on-chain.',
  },
]

const supportTips = [
  {
    title: 'Write clearly',
    copy: 'Share how the produce was grown, when it was harvested, and any storage notes buyers should know.',
  },
  {
    title: 'Quantities matter',
    copy: 'Quantity is the number of units buyers can purchase in total. Update it through your profile when stock changes.',
  },
  {
    title: 'Keep receipts',
    copy: 'Transactions are recorded on the DeMarket contract. Download receipts from your profile for bookkeeping.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Submit listing',
    copy: 'Fill out the form and confirm the transaction. The contract saves the details immediately after it is mined.',
  },
  {
    step: '02',
    title: 'Listing goes live',
    copy: 'Your product appears on the Products page. Buyers can discover it instantly without manual approval.',
  },
  {
    step: '03',
    title: 'Receive purchases',
    copy: 'When a buyer confirms a purchase, funds are escrowed and released to your wallet after settlement.',
  },
  {
    step: '04',
    title: 'Track performance',
    copy: 'Visit the profile dashboard to monitor sales, earnings, and remaining inventory.',
  },
]

const icons = [
  '🍎',
  '🥕',
  '🍇',
  '🥬',
  '🌽',
  '🍓',
  '🥔',
  '🥦',
  '🍊',
  '🥒',
  '🍒',
  '🍆',
  '🍑',
  '🍌',
  '🥝',
  '🥑',
]

const categoryLabel = (value) => categories.find((category) => category.value === value)?.label || value

const formatAddress = (value) => {
  if (!value) {
    return null
  }

  if (value.length <= 10) {
    return value
  }

  return `${value.slice(0, 6)}…${value.slice(-4)}`
}

const SellPage = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'fruits',
    description: '',
    image: '🍎',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isConnected || !walletClient) {
      setErrorMessage('Please connect your wallet to list products.')
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const provider = new BrowserProvider(walletClient)
      const signer = await provider.getSigner()

      const result = await addProduct(
        signer,
        formData.name,
        formData.price,
        Number.parseInt(formData.quantity, 10)
      )

      if (result.success) {
        setSuccessMessage(
          `"${formData.name}" listed successfully on the blockchain. Transaction: ${result.txHash.slice(0, 10)}…`
        )

        setFormData({
          name: '',
          price: '',
          quantity: '',
          category: 'fruits',
          description: '',
          image: '🍎',
        })

        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setErrorMessage(`Failed to list product: ${result.error}`)
      }
    } catch (error) {
      setErrorMessage(`Error listing product: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="sell-page">
        <section className="sell-hero">
          <div className="container sell-hero-content">
            <div className="sell-hero-text">
              <span className="sell-hero-eyebrow">List on-chain</span>
              <h1>Share your harvest with verified buyers</h1>
              <p>
                DeMarket listings live on Ethereum. Every detail you submit is written to the smart
                contract, making it easy for buyers to trust and trace your produce.
              </p>
              <div className="sell-hero-status">
                <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                  {isConnected ? 'Wallet connected' : 'Wallet not connected'}
                </span>
                <span className="status-detail">
                  {isConnected ? formatAddress(address) : 'Connect a wallet to list products.'}
                </span>
              </div>
              <ul className="sell-hero-points">
                <li>Listings post directly to the DeMarket smart contract on Sepolia.</li>
                <li>Buyers settle in ETH with escrow, ensuring on-time payment for farmers.</li>
                <li>Update inventory or pricing anytime from the Profile page.</li>
              </ul>
            </div>
            <aside className="sell-hero-panel">
              <div className="sell-checklist">
                <h3>Before you publish</h3>
                <ul>
                  {listingChecklist.map((item) => (
                    <li key={item.title}>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="sell-body">
          <div className="container sell-layout">
            <div className="sell-form-panel">
              <header className="sell-form-header">
                <span className="form-eyebrow">Product details</span>
                <h2>Create your listing</h2>
                <p>These fields appear exactly as buyers see them on the Products page.</p>
              </header>
              <form onSubmit={handleSubmit} className="sell-form">
                <div className="form-group">
                  <label htmlFor="name">Product name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Alphonso mango crates"
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
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                      placeholder="0.15"
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
                      placeholder="25"
                      min="1"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Choose an icon</label>
                  <div className="emoji-selector">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`emoji-option ${formData.image === icon ? 'selected' : ''}`}
                        onClick={() => setFormData((previous) => ({ ...previous, image: icon }))}
                        aria-label={`Select ${icon}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description (optional)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Share harvest notes, storage requirements, or logistics expectations."
                    rows="4"
                    className="form-textarea"
                  />
                </div>

                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner" />
                      Listing product…
                    </>
                  ) : (
                    'List product'
                  )}
                </button>
              </form>
            </div>

            <aside className="sell-sidebar">
              <div className="sell-preview">
                <h3>Live preview</h3>
                <div className="preview-card">
                  <div className="preview-header">
                    <span className="preview-emoji" role="img" aria-label="Product icon">
                      {formData.image}
                    </span>
                    <div className="preview-header-copy">
                      <h4>{formData.name || 'Product name'}</h4>
                      <span className="preview-price">{formData.price || '0'} ETH</span>
                    </div>
                  </div>
                  <div className="preview-details">
                    <div className="preview-row">
                      <span className="preview-label">Category</span>
                      <span className="preview-value">{categoryLabel(formData.category)}</span>
                    </div>
                    <div className="preview-row">
                      <span className="preview-label">Quantity</span>
                      <span className="preview-value">{formData.quantity || '0'} units</span>
                    </div>
                    <div className="preview-row">
                      <span className="preview-label">Seller address</span>
                      <span className="preview-value preview-address">
                        {isConnected ? formatAddress(address) : 'Connect wallet'}
                      </span>
                    </div>
                  </div>
                  <div className="preview-description">
                    {formData.description || 'Add a short description so buyers know what makes this harvest special.'}
                  </div>
                </div>
              </div>

              <div className="sell-tips">
                <h3>Listing tips</h3>
                <ul>
                  {supportTips.map((tip) => (
                    <li key={tip.title}>
                      <h4>{tip.title}</h4>
                      <p>{tip.copy}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="sell-steps">
          <div className="container">
            <div className="steps-header">
              <span className="steps-eyebrow">After you submit</span>
              <h2>Understand the end-to-end flow</h2>
            </div>
            <div className="steps-grid">
              {processSteps.map((step) => (
                <div key={step.step} className="steps-card">
                  <span className="steps-index">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SellPage
