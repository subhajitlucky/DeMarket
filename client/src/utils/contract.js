import { ethers } from 'ethers'

// 🌐 SEPOLIA TESTNET DEPLOYMENT
export const CONTRACT_ADDRESS = "0x643E4F63049ed820f1373AE6a82c01E4d1b6580c"

// 📋 COMPLETE ABI FOR DEPLOYED DEMARKET CONTRACT
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FeesWithdrawn",
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
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
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
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
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
        "name": "productName",
        "type": "string"
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
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProductBought",
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
        "name": "quantityToBuy",
        "type": "uint256"
      }
    ],
    "name": "buyProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
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
        "internalType": "struct DeMarketplace.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProductCount",
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

// 🔧 HELPER FUNCTIONS

// Get contract instance
export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider)
}

// 🌐 GET DEFAULT PROVIDER (for read-only operations without wallet)
export const getDefaultProvider = () => {
  // Use reliable public Sepolia RPC endpoints with fallback
  const rpcUrls = [
    'https://rpc.sepolia.org',
    'https://sepolia.gateway.tenderly.co',
    'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
    'https://rpc2.sepolia.org'
  ]
  
  // Try first RPC, can add fallback logic later
  return new ethers.JsonRpcProvider(rpcUrls[0])
}

// 📊 GET ALL ACTIVE PRODUCTS (Uses direct contract calls)
export const getAllProducts = async (provider) => {
  try {
    console.log('🔍 Fetching products with provider:', provider.connection?.url || 'Unknown RPC')
    
    const contract = getContract(provider)
    console.log('📋 Contract instance created, getting product count...')
    
    const productCount = await contract.productCount()
    console.log(`📊 Total products found: ${productCount}`)
    
    if (productCount === 0n) {
      console.log('⚠️ No products in contract')
      return []
    }
    
    const products = []

    for (let i = 1; i <= productCount; i++) {
      console.log(`📦 Fetching product ${i}/${productCount}`)
      const product = await contract.products(i)
      
      if (product.isActive && product.quantity > 0) {
        const formattedProduct = {
          id: product.id.toString(),
          name: product.name,
          price: ethers.formatEther(product.price),
          quantity: product.quantity.toString(),
          seller: product.seller,
          isActive: product.isActive
        }
        console.log(`✅ Active product found:`, formattedProduct)
        products.push(formattedProduct)
      } else {
        console.log(`❌ Product ${i} is inactive or sold out`)
      }
    }

    console.log(`🎉 Returning ${products.length} active products`)
    return products
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    console.error('Contract address:', CONTRACT_ADDRESS)
    console.error('Provider:', provider)
    return []
  }
}

// 🏪 GET USER'S PRODUCTS (Uses direct contract calls)
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

// 🛒 GET USER'S PURCHASES (Using Events - FREE!)
export const getUserPurchases = async (provider, userAddress) => {
  try {
    const contract = getContract(provider)
    
    // Query ProductBought events where user is the buyer
    const filter = contract.filters.ProductBought(null, userAddress, null)
    const events = await contract.queryFilter(filter)
    
    const purchases = events.map(event => ({
      productId: event.args.productId.toString(),
      productName: event.args.productName,
      quantity: event.args.quantity.toString(),
      totalPrice: ethers.formatEther(event.args.totalPrice),
      platformFee: ethers.formatEther(event.args.platformFee),
      seller: event.args.seller,
      timestamp: new Date(Number(event.args.timestamp) * 1000).toLocaleDateString(),
      txHash: event.transactionHash
    }))

    return purchases.reverse() // Most recent first
  } catch (error) {
    console.error('Error fetching user purchases:', error)
    return []
  }
}

// 💰 GET USER'S SALES (Using Events - FREE!)
export const getUserSales = async (provider, userAddress) => {
  try {
    const contract = getContract(provider)
    
    // Query ProductBought events where user is the seller
    const filter = contract.filters.ProductBought(null, null, userAddress)
    const events = await contract.queryFilter(filter)
    
    const sales = events.map(event => ({
      productId: event.args.productId.toString(),
      productName: event.args.productName,
      quantity: event.args.quantity.toString(),
      totalPrice: ethers.formatEther(event.args.totalPrice),
      platformFee: ethers.formatEther(event.args.platformFee),
      buyer: event.args.buyer,
      sellerEarned: ethers.formatEther(event.args.totalPrice - event.args.platformFee),
      timestamp: new Date(Number(event.args.timestamp) * 1000).toLocaleDateString(),
      txHash: event.transactionHash
    }))

    return sales.reverse() // Most recent first
  } catch (error) {
    console.error('Error fetching user sales:', error)
    return []
  }
}

// 🎯 ADD PRODUCT
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

// 🛒 BUY PRODUCT
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

// 📊 GET DASHBOARD STATS (Using Events - FREE!)
export const getDashboardStats = async (provider, userAddress) => {
  try {
    const [purchases, sales, products] = await Promise.all([
      getUserPurchases(provider, userAddress),
      getUserSales(provider, userAddress),
      getUserProducts(provider, userAddress)
    ])

    const totalSpent = purchases.reduce((sum, p) => sum + parseFloat(p.totalPrice), 0)
    const totalEarned = sales.reduce((sum, s) => sum + parseFloat(s.sellerEarned), 0)
    const activeProducts = products.filter(p => p.status === 'active').length

    return {
      totalPurchases: purchases.length,
      totalSales: sales.length,
      totalSpent: totalSpent.toFixed(4),
      totalEarned: totalEarned.toFixed(4),
      activeProducts,
      recentPurchases: purchases.slice(0, 5),
      recentSales: sales.slice(0, 5)
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalPurchases: 0,
      totalSales: 0,
      totalSpent: '0',
      totalEarned: '0',
      activeProducts: 0,
      recentPurchases: [],
      recentSales: []
    }
  }
}
