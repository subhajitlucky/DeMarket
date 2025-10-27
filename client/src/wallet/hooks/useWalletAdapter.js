import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { BrowserProvider } from 'ethers';
import { useMemo } from 'react';

/**
 * Custom hook to bridge wagmi with ethers.js for existing contract code
 * This allows you to keep using your existing contract.js utilities
 */
export const useEthersProvider = () => {
  const { data: walletClient } = useWalletClient();
  
  return useMemo(() => {
    if (!walletClient) return null;
    
    // Create a proper Web3Provider from walletClient
    return new BrowserProvider(walletClient);
  }, [walletClient]);
};

/**
 * Custom hook to get ethers.js signer from wagmi
 */
export const useEthersSigner = () => {
  const { data: walletClient } = useWalletClient();
  const provider = useEthersProvider();
  
  return useMemo(() => {
    if (!provider || !walletClient) return null;
    
    // Return a promise that resolves to the signer
    return provider.getSigner();
  }, [provider, walletClient]);
};

/**
 * Hook to get account, provider, and signer - compatible with your existing WalletContext
 */
export const useWalletAdapter = () => {
  const { address, isConnected, chainId } = useAccount();
  const provider = useEthersProvider();
  const publicClient = usePublicClient();
  
  // Format address like your old implementation
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    account: address,
    isConnected,
    chainId: chainId?.toString(),
    provider,
    publicClient,
    formatAddress,
  };
};
