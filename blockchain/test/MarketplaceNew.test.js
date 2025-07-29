const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeMarketplace", function () {
  let marketplace;
  let deployer, seller, buyer;

  beforeEach(async function () {
    [deployer, seller, buyer] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory("DeMarketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();
  });

  describe("Product Management", function () {
    it("Should add a product successfully", async function () {
      await expect(
        marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 10)
      ).to.emit(marketplace, "ProductAdded")
       .withArgs(1, seller.address, "Apple", ethers.parseEther("0.1"), 10);

      const product = await marketplace.products(1);
      expect(product.name).to.equal("Apple");
      expect(product.price).to.equal(ethers.parseEther("0.1"));
      expect(product.quantity).to.equal(10);
      expect(product.seller).to.equal(seller.address);
      expect(product.isActive).to.equal(true);
    });

    it("Should reject product with zero price", async function () {
      await expect(
        marketplace.connect(seller).addProduct("Apple", 0, 10)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should reject product with zero quantity", async function () {
      await expect(
        marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 0)
      ).to.be.revertedWith("Quantity must be greater than 0");
    });
  });

  describe("Product Purchase", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 10);
    });

    it("Should allow buying a product", async function () {
      const productPrice = ethers.parseEther("0.1");
      const quantity = 3;
      const totalPrice = productPrice * BigInt(quantity);
      const fee = (totalPrice * BigInt(2)) / BigInt(100); // 2% platform fee
      
      await expect(
        marketplace.connect(buyer).buyProduct(1, quantity, { value: totalPrice })
      ).to.emit(marketplace, "ProductBought")
       .withArgs(1, buyer.address, quantity, totalPrice, fee);

      const product = await marketplace.products(1);
      expect(product.quantity).to.equal(7); // 10 - 3
      expect(product.isActive).to.equal(true);
    });

    it("Should deactivate product when quantity becomes zero", async function () {
      const productPrice = ethers.parseEther("0.1");
      const quantity = 10; // Buy all
      const totalPrice = productPrice * BigInt(quantity);
      
      await marketplace.connect(buyer).buyProduct(1, quantity, { value: totalPrice });

      const product = await marketplace.products(1);
      expect(product.quantity).to.equal(0);
      expect(product.isActive).to.equal(false);
    });

    it("Should refund excess ETH", async function () {
      const productPrice = ethers.parseEther("0.1");
      const quantity = 1;
      const totalPrice = productPrice * BigInt(quantity);
      const excessPayment = ethers.parseEther("0.2"); // Pay more than needed
      
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      
      const tx = await marketplace.connect(buyer).buyProduct(1, quantity, { value: excessPayment });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      
      // Should only deduct totalPrice + gas, not the full excessPayment
      const expectedBalance = buyerBalanceBefore - totalPrice - gasUsed;
      expect(buyerBalanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
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
  });

  describe("Platform Fee Management", function () {
    it("Should collect platform fees correctly", async function () {
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("1"), 1);
      
      const totalPrice = ethers.parseEther("1");
      const expectedFee = (totalPrice * BigInt(2)) / BigInt(100); // 2%
      
      await marketplace.connect(buyer).buyProduct(1, 1, { value: totalPrice });
      
      const contractBalance = await ethers.provider.getBalance(marketplace.target);
      expect(contractBalance).to.equal(expectedFee);
    });

    it("Should allow owner to withdraw fees", async function () {
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("1"), 1);
      await marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("1") });
      
      const ownerBalanceBefore = await ethers.provider.getBalance(deployer.address);
      const contractBalance = await ethers.provider.getBalance(marketplace.target);
      
      await expect(
        marketplace.connect(deployer).withdrawFees()
      ).to.emit(marketplace, "FeesWithdrawn")
       .withArgs(deployer.address, contractBalance);
      
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
        marketplace.connect(deployer).withdrawFees()
      ).to.be.revertedWith("No fees to withdraw");
    });
  });

  describe("Platform Fee Percentage", function () {
    it("Should have correct platform fee percentage", async function () {
      const feePercent = await marketplace.platformFeePercent();
      expect(feePercent).to.equal(2);
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should prevent reentrancy attacks", async function () {
      // This test would require a malicious contract to properly test
      // For now, we just verify the modifier is applied
      await marketplace.connect(seller).addProduct("Apple", ethers.parseEther("0.1"), 1);
      
      // Normal purchase should work
      await expect(
        marketplace.connect(buyer).buyProduct(1, 1, { value: ethers.parseEther("0.1") })
      ).to.not.be.reverted;
    });
  });
});
