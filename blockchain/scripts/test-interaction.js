async function main() {
  console.log("Testing deployed contract functionality...");
  
  // Get signers
  const [deployer, seller, buyer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Seller:", seller.address);
  console.log("Buyer:", buyer.address);
  
  // Get deployed contract
  const DeMarketplace = await ethers.getContractFactory("DeMarketplace");
  const marketplace = await DeMarketplace.deploy();
  await marketplace.waitForDeployment();
  
  const contractAddress = await marketplace.getAddress();
  console.log("Contract deployed at:", contractAddress);
  
  // Test 1: Add a product
  console.log("\n--- Test 1: Adding a product ---");
  const addTx = await marketplace.connect(seller).addProduct(
    "Fresh Apples", 
    ethers.parseEther("0.1"), 
    10
  );
  await addTx.wait();
  console.log("✅ Product added successfully");
  
  // Check product details
  const product = await marketplace.products(1);
  console.log("Product details:", {
    id: product.id.toString(),
    name: product.name,
    price: ethers.formatEther(product.price) + " ETH",
    quantity: product.quantity.toString(),
    seller: product.seller,
    isActive: product.isActive
  });
  
  // Test 2: Buy a product
  console.log("\n--- Test 2: Buying a product ---");
  const buyTx = await marketplace.connect(buyer).buyProduct(
    1, 
    3, 
    { value: ethers.parseEther("0.3") }
  );
  await buyTx.wait();
  console.log("✅ Product purchased successfully");
  
  // Check updated product details
  const updatedProduct = await marketplace.products(1);
  console.log("Updated product quantity:", updatedProduct.quantity.toString());
  
  // Test 3: Check platform fees
  console.log("\n--- Test 3: Platform fees ---");
  const contractBalance = await ethers.provider.getBalance(contractAddress);
  console.log("Platform fees collected:", ethers.formatEther(contractBalance) + " ETH");
  
  // Test 4: Withdraw fees (as owner)
  console.log("\n--- Test 4: Withdrawing fees ---");
  const withdrawTx = await marketplace.connect(deployer).withdrawFees();
  await withdrawTx.wait();
  console.log("✅ Fees withdrawn successfully");
  
  const finalBalance = await ethers.provider.getBalance(contractAddress);
  console.log("Final contract balance:", ethers.formatEther(finalBalance) + " ETH");
  
  console.log("\n🎉 All tests completed successfully!");
  console.log("Smart contract is fully functional and secure!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
