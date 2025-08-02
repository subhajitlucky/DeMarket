const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🏪 DeMarketplace - Core Functionality", function () {
  let marketplace;
  let owner, seller, buyer, otherUser;

  beforeEach(async function () {
    [owner, seller, buyer, otherUser] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory("DeMarketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();
  });

  describe("📦 Product Management", function () {
    it("Should add products with correct data", async function () {
      const tx = await marketplace.connect(seller).addProduct("Fresh Apples", ethers.parseEther("1"), 5);
      const receipt = await tx.wait();
      
      // Check event was emitted
      expect(receipt.logs).to.have.lengthOf(1);
      const event = receipt.logs[0];
      
      // Parse the event
      const parsedEvent = marketplace.interface.parseLog(event);
      expect(parsedEvent.name).to.equal("ProductAdded");
      expect(parsedEvent.args[0]).to.equal(1); // id
      expect(parsedEvent.args[1]).to.equal(seller.address); // seller
      expect(parsedEvent.args[2]).to.equal("Fresh Apples"); // name
      expect(parsedEvent.args[3]).to.equal(ethers.parseEther("1")); // price
      expect(parsedEvent.args[4]).to.equal(5); // quantity
      expect(parsedEvent.args[5]).to.be.a('bigint'); // timestamp

      const product = await marketplace.products(1);
      expect(product.name).to.equal("Fresh Apples");
      expect(product.price).to.equal(ethers.parseEther("1"));
      expect(product.seller).to.equal(seller.address);
      expect(product.isActive).to.equal(true);
    });

    it("Should reject products with zero price", async function () {
      await expect(
        marketplace.connect(seller).addProduct("Apple", 0, 10)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should reject products with zero quantity", async function () {
      await expect(
        marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 0)
      ).to.be.revertedWith("Quantity must be greater than 0");
    });

    it("Should track multiple products from seller", async function () {
      await marketplace.connect(seller).addProduct("Fresh Apples", ethers.parseEther("1"), 5);
      await marketplace.connect(seller).addProduct("Fresh Oranges", ethers.parseEther("2"), 3);

      const product1 = await marketplace.products(1);
      const product2 = await marketplace.products(2);
      
      expect(product1.name).to.equal("Fresh Apples");
      expect(product1.price).to.equal(ethers.parseEther("1"));
      expect(product1.seller).to.equal(seller.address);
      
      expect(product2.name).to.equal("Fresh Oranges");
      expect(product2.price).to.equal(ethers.parseEther("2"));
      expect(product2.seller).to.equal(seller.address);
    });
  });

  describe("🛒 Product Purchase", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).addProduct("Fresh Apples", ethers.parseEther("0.1"), 10);
    });

    it("Should allow buying products with correct events", async function () {
      await expect(
        marketplace.connect(buyer).buyProduct(1, 2, { value: ethers.parseEther("0.2") })
      ).to.emit(marketplace, "ProductBought");

      const product = await marketplace.products(1);
      expect(product.quantity).to.equal(8); // 10 - 2 = 8
      expect(product.isActive).to.equal(true); // Still active since quantity > 0
    });

    it("Should deactivate product when quantity becomes zero", async function () {
      await marketplace.connect(buyer).buyProduct(1, 10, { value: ethers.parseEther("1") });

      const product = await marketplace.products(1);
      expect(product.quantity).to.equal(0);
      expect(product.isActive).to.equal(false); // Should be deactivated
    });

    it("Should prevent seller from buying own product", async function () {
      await expect(
        marketplace.connect(seller).buyProduct(1, 1, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Seller cannot buy own product");
    });

    it("Should reject purchase with insufficient payment", async function () {
      await expect(
        marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWith("Not enough ETH sent");
    });

    it("Should reject purchase of inactive product", async function () {
      // First, buy all quantity to deactivate
      await marketplace.connect(buyer).buyProduct(1, 10, { value: ethers.parseEther("1") });
      
      await expect(
        marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Product is not active");
    });

    it("Should reject purchase with insufficient quantity", async function () {
      await expect(
        marketplace.connect(buyer).buyProduct(1, 15, { value: ethers.parseEther("1.5") })
      ).to.be.revertedWith("Not enough quantity");
    });

    it("Should refund excess ETH", async function () {
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      
      const tx = await marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("1") });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      
      // Should only deduct 0.1 ETH + gas, not the full 1 ETH
      const actualLoss = buyerBalanceBefore - buyerBalanceAfter;
      const expectedLoss = ethers.parseEther("0.1") + gasUsed;
      
      expect(actualLoss).to.be.closeTo(expectedLoss, ethers.parseEther("0.001"));
    });
  });

  describe("💰 Platform Fee Management", function () {
    it("Should collect 2% platform fee correctly", async function () {
      await marketplace.connect(seller).addProduct("Fresh Apples", ethers.parseEther("1"), 5);
      
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      const contractBalanceBefore = await ethers.provider.getBalance(marketplace.target);
      
      await marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("1") });
      
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const contractBalanceAfter = await ethers.provider.getBalance(marketplace.target);
      
      // Seller should receive 98% (100% - 2% platform fee)
      const expectedSellerIncrease = ethers.parseEther("0.98"); // 1 ETH - 2% fee
      const actualSellerIncrease = sellerBalanceAfter - sellerBalanceBefore;
      
      expect(actualSellerIncrease).to.equal(expectedSellerIncrease);
      
      // Contract should receive 2% platform fee
      const expectedContractIncrease = ethers.parseEther("0.02");
      const actualContractIncrease = contractBalanceAfter - contractBalanceBefore;
      
      expect(actualContractIncrease).to.equal(expectedContractIncrease);
    });

    it("Should allow owner to withdraw fees", async function () {
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("1"), 1);
      await marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("1") });
      
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const contractBalance = await ethers.provider.getBalance(marketplace.target);
      
      const tx = await marketplace.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      
      // Check event was emitted
      expect(receipt.logs).to.have.lengthOf(1);
      const event = receipt.logs[0];
      const parsedEvent = marketplace.interface.parseLog(event);
      expect(parsedEvent.name).to.equal("FeesWithdrawn");
      expect(parsedEvent.args[0]).to.equal(owner.address); // owner
      expect(parsedEvent.args[1]).to.equal(contractBalance); // amount
      expect(parsedEvent.args[2]).to.be.a('bigint'); // timestamp
      
      const finalContractBalance = await ethers.provider.getBalance(marketplace.target);
      expect(finalContractBalance).to.equal(0);
    });

    it("Should reject withdrawal by non-owner", async function () {
      await expect(
        marketplace.connect(seller).withdrawFees()
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });

    it("Should reject withdrawal when no fees available", async function () {
      await expect(
        marketplace.connect(owner).withdrawFees()
      ).to.be.revertedWith("No fees to withdraw");
    });
  });

  describe("📊 Contract State", function () {
    it("Should have correct platform fee percentage", async function () {
      const feePercent = await marketplace.platformFeePercent();
      expect(feePercent).to.equal(2);
    });

    it("Should track product count correctly", async function () {
      expect(await marketplace.productCount()).to.equal(0);
      
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 10);
      expect(await marketplace.productCount()).to.equal(1);
      
      await marketplace.connect(seller).addProduct("Orange", ethers.parseEther("0.2"), 5);
      expect(await marketplace.productCount()).to.equal(2);
    });

    it("Should return correct product data via getProduct", async function () {
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 10);
      
      const product = await marketplace.getProduct(1);
      expect(product.id).to.equal(1);
      expect(product.name).to.equal("Apple");
      expect(product.price).to.equal(ethers.parseEther("0.1"));
      expect(product.quantity).to.equal(10);
      expect(product.seller).to.equal(seller.address);
      expect(product.isActive).to.equal(true);
    });
  });

  describe("🔄 Event System Verification", function () {
    it("Should emit rich ProductAdded events with timestamp", async function () {
      const tx = await marketplace.connect(seller).addProduct("Fresh Apples", ethers.parseEther("0.1"), 10);
      const receipt = await tx.wait();
      
      expect(receipt.logs).to.have.lengthOf(1);
      const event = receipt.logs[0];
      const parsedEvent = marketplace.interface.parseLog(event);
      
      expect(parsedEvent.name).to.equal("ProductAdded");
      expect(parsedEvent.args[0]).to.equal(1); // id
      expect(parsedEvent.args[1]).to.equal(seller.address); // seller
      expect(parsedEvent.args[2]).to.equal("Fresh Apples"); // name
      expect(parsedEvent.args[3]).to.equal(ethers.parseEther("0.1")); // price
      expect(parsedEvent.args[4]).to.equal(10); // quantity
      expect(parsedEvent.args[5]).to.be.a('bigint'); // timestamp
    });

    it("Should emit rich ProductBought events with all data", async function () {
      await marketplace.connect(seller).addProduct("Fresh Apples", ethers.parseEther("0.1"), 10);
      
      const tx = await marketplace.connect(buyer).buyProduct(1, 3, { value: ethers.parseEther("0.3") });
      const receipt = await tx.wait();
      
      expect(receipt.logs).to.have.lengthOf(1);
      const event = receipt.logs[0];
      const parsedEvent = marketplace.interface.parseLog(event);
      
      expect(parsedEvent.name).to.equal("ProductBought");
      expect(parsedEvent.args[0]).to.equal(1); // productId
      expect(parsedEvent.args[1]).to.equal(buyer.address); // buyer
      expect(parsedEvent.args[2]).to.equal(seller.address); // seller
      expect(parsedEvent.args[3]).to.equal("Fresh Apples"); // productName
      expect(parsedEvent.args[4]).to.equal(3); // quantity
      expect(parsedEvent.args[5]).to.equal(ethers.parseEther("0.3")); // totalPrice
      expect(parsedEvent.args[6]).to.equal(ethers.parseEther("0.006")); // platformFee (2%)
      expect(parsedEvent.args[7]).to.be.a('bigint'); // timestamp
    });
  });
});
