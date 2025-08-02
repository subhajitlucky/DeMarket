const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying DeMarketplace to Sepolia Testnet...");
  console.log("================================================");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying with account: ${deployer.address}`);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance! You need at least 0.01 ETH for deployment");
    console.log("💡 Get Sepolia ETH from: https://sepoliafaucet.com/");
  }

  // Deploy contract
  console.log("\n🏭 Deploying contract...");
  const Marketplace = await ethers.getContractFactory("DeMarketplace");
  const marketplace = await Marketplace.deploy();
  
  console.log("⏳ Waiting for deployment...");
  await marketplace.waitForDeployment();
  
  const contractAddress = await marketplace.getAddress();
  console.log(`✅ DeMarketplace deployed to: ${contractAddress}`);

  // Verify contract configuration
  console.log("\n🔍 Verifying contract configuration...");
  const platformFee = await marketplace.platformFeePercent();
  const productCount = await marketplace.productCount();
  const owner = await marketplace.owner();
  
  console.log(`📊 Platform fee: ${platformFee}%`);
  console.log(`📦 Initial product count: ${productCount}`);
  console.log(`👤 Contract owner: ${owner}`);

  // Display important information
  console.log("\n📋 DEPLOYMENT SUMMARY:");
  console.log("=====================");
  console.log(`🌐 Network: Sepolia Testnet`);
  console.log(`📄 Contract Address: ${contractAddress}`);
  console.log(`👤 Owner: ${owner}`);
  console.log(`💰 Platform Fee: ${platformFee}%`);
  console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  
  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Update frontend contract address");
  console.log("2. Add Sepolia network to MetaMask");
  console.log("3. Get test ETH from faucet");
  console.log("4. Test the application");
  
  console.log("\n✅ Deployment completed successfully!");
  
  return {
    contractAddress,
    owner,
    platformFee: platformFee.toString(),
    productCount: productCount.toString()
  };
}

main()
  .then((result) => {
    console.log("\n📝 Save this information:");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
