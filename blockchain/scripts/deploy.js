async function main() {
  console.log("Deploying DeMarketplace contract...");
  
  // Get the contract factory
  const DeMarketplace = await ethers.getContractFactory("DeMarketplace");
  
  // Deploy the contract
  const marketplace = await DeMarketplace.deploy();
  await marketplace.waitForDeployment();
  
  const address = await marketplace.getAddress();
  console.log("DeMarketplace deployed to:", address);
  
  // Verify deployment by calling a view function
  const platformFee = await marketplace.platformFeePercent();
  console.log("Platform fee percentage:", platformFee.toString() + "%");
  
  const productCount = await marketplace.productCount();
  console.log("Initial product count:", productCount.toString());
  
  console.log("Deployment completed successfully!");
  
  return {
    marketplace: marketplace,
    address: address
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
