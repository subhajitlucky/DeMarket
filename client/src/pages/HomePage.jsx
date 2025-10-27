import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/HomePage.css'
import { CONTRACT_ADDRESS, getAllProducts } from '../utils/contract'

const capabilities = [
  {
    title: 'Browse live listings',
    description:
      'Connect your wallet to view produce posted directly by farmers. All listings are fetched from the DeMarket smart contract on Sepolia.',
  },
  {
    title: 'List a new harvest',
    description:
      'Set a name, quantity, and price for your produce. Once the transaction is confirmed, the listing is instantly available to buyers.',
  },
  {
    title: 'Track your activity',
    description:
      'Keep an eye on purchases and sales through the profile dashboard. Data is read from on-chain events so it matches your wallet history.',
  },
]

const gettingStartedSteps = [
  {
    title: 'Connect your wallet',
    description:
      'Use RainbowKit to link MetaMask, WalletConnect, or Coinbase Wallet. We support desktop and mobile flows.',
  },
  {
    title: 'Review the marketplace',
    description:
      'Head to the Products page to see the current inventory. Listings load directly from the contract—no placeholder data.',
  },
  {
    title: 'Create or fulfil orders',
    description:
      'List your own harvest or purchase from others with a single confirmation. Settlement happens on-chain in ETH.',
  },
]

const formatAddress = (address) => {
  if (!address || address.length < 10) {
    return address || '—'
  }

  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

const formatEth = (value) => {
  const parsed = Number.parseFloat(value)

  if (Number.isNaN(parsed)) {
    return `${value} ETH`
  }

  if (parsed === 0) {
    return '0 ETH'
  }

  if (parsed < 0.01) {
    return `${parsed.toFixed(4)} ETH`
  }

  if (parsed < 1) {
    return `${parsed.toFixed(3)} ETH`
  }

  return `${parsed.toFixed(2)} ETH`
}

const HomePage = () => {
  const [snapshot, setSnapshot] = useState({
    activeProducts: null,
    latestProduct: null,
  })
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true)
  const [snapshotError, setSnapshotError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadSnapshot = async () => {
      try {
        setIsLoadingSnapshot(true)
        const products = await getAllProducts()

        if (cancelled) {
          return
        }

        const latestProduct = products.length > 0 ? products[products.length - 1] : null

        setSnapshot({
          activeProducts: products.length,
          latestProduct,
        })
        setSnapshotError(null)
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error('Unable to load marketplace snapshot:', error)
        setSnapshot({ activeProducts: null, latestProduct: null })
        setSnapshotError('Unable to load marketplace data right now.')
      } finally {
        if (!cancelled) {
          setIsLoadingSnapshot(false)
        }
      }
    }

    loadSnapshot()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page-container">
      <div className="homepage">
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-copy">
              <span className="hero-eyebrow">Community marketplace</span>
              <h1>Fresh produce with transparent settlement</h1>
              <p className="hero-description">
                DeMarket connects growers and buyers on Ethereum. Listings, purchases, and payouts
                are recorded on-chain so everyone sees the same source of truth.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary">
                  Explore marketplace
                </Link>
                <Link to="/sell" className="btn btn-secondary">
                  List produce
                </Link>
              </div>
              <ul className="hero-points">
                <li>Connect your wallet to get started.</li>
                <li>Browse live data pulled directly from the DeMarket smart contract.</li>
                <li>Track your purchases and sales inside the profile dashboard.</li>
              </ul>
            </div>
            <aside className="hero-panel">
              <div className="panel-card">
                <span className="panel-label">Marketplace snapshot</span>
                <div className="panel-metric">
                  <span className="metric-number">
                    {isLoadingSnapshot ? 'Loading…' : snapshot.activeProducts ?? '—'}
                  </span>
                  <span className="metric-caption">Active listings</span>
                </div>
                {snapshotError && <p className="panel-message">{snapshotError}</p>}
                {!snapshotError && !isLoadingSnapshot && snapshot.activeProducts === 0 && (
                  <p className="panel-message">
                    No active listings yet. Connect your wallet to add the first product.
                  </p>
                )}
                {!snapshotError && snapshot.latestProduct && (
                  <div className="panel-latest">
                    <span className="panel-latest-label">Most recent product</span>
                    <div className="panel-latest-name">{snapshot.latestProduct.name}</div>
                    <div className="panel-latest-meta">
                      <span>{snapshot.latestProduct.quantity} units</span>
                      <span>{formatEth(snapshot.latestProduct.price)}</span>
                    </div>
                  </div>
                )}
                <div className="panel-footer">
                  <span>Contract</span>
                  <code>{formatAddress(CONTRACT_ADDRESS)}</code>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="actions">
          <div className="container">
            <div className="actions-header">
              <h2>What you can do today</h2>
              <p>
                Everything below is live in this app. Connect your wallet to interact with the
                DeMarket contract on Sepolia.
              </p>
            </div>
            <div className="actions-grid">
              {capabilities.map((item) => (
                <div key={item.title} className="action-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="steps">
          <div className="container">
            <div className="steps-header">
              <h2>Get started in a few minutes</h2>
            </div>
            <div className="steps-grid">
              {gettingStartedSteps.map((step, index) => (
                <div key={step.title} className="step-card">
                  <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to explore the marketplace?</h2>
            <p>
              Connect your wallet, browse live listings, and help shape a transparent food supply
              chain.
            </p>
            <div className="cta-actions">
              <Link to="/products" className="btn btn-primary">
                View products
              </Link>
              <Link to="/sell" className="btn btn-outline">
                Add a listing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage
