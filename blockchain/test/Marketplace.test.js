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

  it("Should create a market item", async function () {
    await expect(
      marketplace.connect(seller).createMarketItem("tokenURI1", ethers.parseEther("1"))
    ).to.emit(marketplace, "MarketItemCreated");

    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(1);
    expect(items[0].price.toString()).to.equal(ethers.parseEther("1").toString());
    expect(items[0].seller).to.equal(seller.address);
  });

  it("Should let buyer purchase an item", async function () {
    await marketplace.connect(seller).createMarketItem("tokenURI1", ethers.parseEther("1"));
    await expect(
      marketplace.connect(buyer).createMarketSale(1, { value: ethers.parseEther("1") })
    ).to.emit(marketplace, "MarketItemSold");

    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(0);
  });

  it("Should fetch seller's items", async function () {
    await marketplace.connect(seller).createMarketItem("tokenURI1", ethers.parseEther("1"));
    await marketplace.connect(seller).createMarketItem("tokenURI2", ethers.parseEther("2"));

    const myItems = await marketplace.connect(seller).fetchMyItems();
    expect(myItems.length).to.equal(2);
    expect(myItems[0].price.toString()).to.equal(ethers.parseEther("1").toString());
    expect(myItems[1].price.toString()).to.equal(ethers.parseEther("2").toString());
  });

  it("Should allow seller to remove items", async function () {
    await marketplace.connect(seller).createMarketItem("tokenURI1", ethers.parseEther("1"));
    
    await expect(
      marketplace.connect(seller).removeMarketItem(1)
    ).to.emit(marketplace, "MarketItemRemoved");

    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(0);
  });

  it("Should allow seller to update items", async function () {
    await marketplace.connect(seller).createMarketItem("tokenURI1", ethers.parseEther("1"));
    
    await expect(
      marketplace.connect(seller).updateMarketItem(1, "newTokenURI", ethers.parseEther("2"))
    ).to.emit(marketplace, "MarketItemUpdated");

    const item = await marketplace.getMarketItem(1);
    expect(item.tokenURI).to.equal("newTokenURI");
    expect(item.price).to.equal(ethers.parseEther("2"));
  });
});
