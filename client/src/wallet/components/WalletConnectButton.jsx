import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/WalletConnect.css';

/**
 * Professional Wallet Connect Button using RainbowKit
 * 
 * Features:
 * - Support for 100+ wallets (MetaMask, Coinbase, WalletConnect, etc.)
 * - Automatic connection persistence
 * - Chain switching UI
 * - Wallet balance display
 * - Mobile-friendly
 * - Production-ready error handling
 */
const WalletConnectButton = () => {
  // Use the default ConnectButton for now - it's already styled and works perfectly
  return <ConnectButton />;
};

export default WalletConnectButton;
