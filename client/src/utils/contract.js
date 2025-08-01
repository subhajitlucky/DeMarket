import { ethers } from 'ethers'

// Contract address from .env
export const CONTRACT_ADDRESS = "0xcB6D8270fA5433cC22964c5ddcc3Fb7ED28f922F"

// Contract ABI for DeMarketplace
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "platformFee",
        "type": "uint256"
      }
    ],
    "name": "ProductBought",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeesWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "buyProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFeePercent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Helper function to get contract instance
export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider)
}

// Helper function to get all active products
export const getAllProducts = async (provider) => {
  try {
    const contract = getContract(provider)
    const productCount = await contract.productCount()
    const products = []

    for (let i = 1; i <= productCount; i++) {
      const product = await contract.products(i)
      if (product.isActive && product.quantity > 0) {
        products.push({
          id: product.id.toString(),
          name: product.name,
          price: ethers.formatEther(product.price),
          quantity: product.quantity.toString(),
          seller: product.seller,
          isActive: product.isActive
        })
      }
    }

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Helper function to get user's products
export const getUserProducts = async (provider, userAddress) => {
  try {
    const contract = getContract(provider)
    const productCount = await contract.productCount()
    const userProducts = []

    for (let i = 1; i <= productCount; i++) {
      const product = await contract.products(i)
      if (product.seller.toLowerCase() === userAddress.toLowerCase()) {
        userProducts.push({
          id: product.id.toString(),
          name: product.name,
          price: ethers.formatEther(product.price),
          quantity: product.quantity.toString(),
          seller: product.seller,
          isActive: product.isActive,
          status: product.isActive && product.quantity > 0 ? 'active' : 'sold-out'
        })
      }
    }

    return userProducts
  } catch (error) {
    console.error('Error fetching user products:', error)
    return []
  }
}

// Helper function to add a product
export const addProduct = async (signer, name, priceInEth, quantity) => {
  try {
    const contract = getContract(signer)
    const priceInWei = ethers.parseEther(priceInEth.toString())
    
    const tx = await contract.addProduct(name, priceInWei, quantity)
    await tx.wait()
    
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Error adding product:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to buy a product
export const buyProduct = async (signer, productId, quantity, totalPriceInEth) => {
  try {
    const contract = getContract(signer)
    const totalPriceInWei = ethers.parseEther(totalPriceInEth.toString())
    
    const tx = await contract.buyProduct(productId, quantity, { 
      value: totalPriceInWei 
    })
    await tx.wait()
    
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Error buying product:', error)
    return { success: false, error: error.message }
  }
}
