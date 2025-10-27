import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, sepolia } from 'wagmi/chains';

// Get WalletConnect Project ID from environment or use a default
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

console.log('🔧 WalletConnect Project ID:', projectId);

export const config = getDefaultConfig({
  appName: 'DeMarket - Decentralized Marketplace',
  projectId: projectId,
  chains: [
    mainnet,
    polygon,
    sepolia,
    // Add more chains as needed
  ],
  ssr: false, // If using server-side rendering
});
