# DeMarket - Decentralized Local Marketplace

DeMarket is a decentralized local marketplace platform that enables users to buy and sell goods and services using cryptocurrencies (Sepolia ETH and Avalanche AVAX). The platform connects local sellers with buyers while leveraging blockchain technology to ensure secure, transparent, and trustless transactions.

## Features

- **Decentralized Marketplace**: Buy and sell items without intermediaries
- **Cryptocurrency Payments**: Support for Sepolia ETH and Avalanche AVAX
- **User Profiles**: Create and manage seller/buyer profiles
- **Product Listings**: Post items with descriptions, images, and prices
- **Search & Filter**: Find products by category, price, location, etc.
- **Transaction History**: View your buying and selling history
- **Secure Smart Contracts**: Escrow system for safe transactions
- **Rating System**: Build reputation through reviews

## Project Structure

```
DeMarket/
├── blockchain/       # Smart contracts and blockchain integration
└── client/           # Frontend React application
```

## Technologies

### Blockchain
- Solidity (Smart Contracts)
- Hardhat/Truffle (Development Framework)
- Ethers.js/Web3.js (Blockchain Interaction)
- Sepolia Testnet
- Avalanche AVAX

### Frontend
- React.js
- Vite
- Ethers.js/Web3.js
- CSS/SCSS

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/DeMarket.git
cd DeMarket
```

2. Install blockchain dependencies
```bash
cd blockchain
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

### Running the Application

1. Start the frontend
```bash
cd client
npm run dev
```

2. Deploy smart contracts (in a separate terminal)
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Connect your MetaMask wallet to the application
2. Browse listed items or create your own listing
3. Purchase items using Sepolia ETH or AVAX
4. Rate sellers after completing transactions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue or contact the project maintainers.
