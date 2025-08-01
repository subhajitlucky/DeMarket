import { Link } from 'react-router-dom'
import WalletConnect from '../wallet/components/WalletConnect'
import '../styles/Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>🥕 DeMarket</h2>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">
            Home
          </Link>
          <Link to="/products" className="navbar-item">
            Products
          </Link>
          <Link to="/sell" className="navbar-item">
            Sell
          </Link>
          <Link to="/profile" className="navbar-item">
            Profile
          </Link>
        </div>

        <div className="navbar-wallet">
          <WalletConnect />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
