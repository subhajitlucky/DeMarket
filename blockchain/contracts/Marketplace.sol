// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DeMarketplace is Ownable, ReentrancyGuard {
    uint public platformFeePercent = 2;
    uint public productCount;

    constructor() Ownable(msg.sender) {
    }

    struct Product {
        uint id;
        string name;
        uint price; // in wei
        uint quantity;
        address seller;
        bool isActive;
    }

    // CORE DATA: Only store what we MUST have on-chain
    mapping(uint => Product) public products;

    // EVENTS: These are our "free receipt book" for dashboard data
    // Events are stored on blockchain but FREE to read!
    event ProductAdded(
        uint indexed id,           // indexed = easy to search by this field
        address indexed seller,    // indexed = easy to search by seller
        string name,
        uint price,
        uint quantity,
        uint timestamp            // when it was added
    );

    event ProductBought(
        uint indexed productId,   // indexed = easy to search by product
        address indexed buyer,    // indexed = easy to search by buyer  
        address indexed seller,   // indexed = easy to search by seller
        string productName,       // we include name so we don't need another query
        uint quantity,
        uint totalPrice,
        uint platformFee,
        uint timestamp           // when it was bought
    );

    event FeesWithdrawn(
        address indexed owner, 
        uint amount,
        uint timestamp
    );

    // Add a new product for sale
    function addProduct(string calldata name, uint price, uint quantity) external {
        require(price > 0, "Price must be greater than 0");
        require(quantity > 0, "Quantity must be greater than 0");

        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: name,
            price: price,
            quantity: quantity,
            seller: msg.sender,
            isActive: true
        });

        // 📝 EMIT EVENT: This is our "receipt" that frontend will read for FREE
        emit ProductAdded(
            productCount, 
            msg.sender, 
            name, 
            price, 
            quantity,
            block.timestamp    // current time when product was added
        );
    }

    // Buy a product
    function buyProduct(uint productId, uint quantityToBuy) external payable nonReentrant {
        Product storage product = products[productId];
        require(product.isActive, "Product is not active");
        require(product.seller != msg.sender, "Seller cannot buy own product");
        require(product.quantity >= quantityToBuy, "Not enough quantity");
        uint totalPrice = product.price * quantityToBuy;
        require(msg.value >= totalPrice, "Not enough ETH sent");

        // Calculate platform fee
        uint fee = (totalPrice * platformFeePercent) / 100;
        uint sellerAmount = totalPrice - fee;

        // Update product quantity
        product.quantity -= quantityToBuy;
        if (product.quantity == 0) {
            product.isActive = false;
        }

        // Transfer ETH to seller using call() for security
        (bool success, ) = payable(product.seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");

        // Refund excess ETH to buyer
        uint excess = msg.value - totalPrice;
        if (excess > 0) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }

        // 📝 EMIT RICH EVENT: All the data needed for dashboard, FREE to read!
        emit ProductBought(
            productId,
            msg.sender,        // buyer
            product.seller,    // seller  
            product.name,      // product name (so UI doesn't need another call)
            quantityToBuy,
            totalPrice,
            fee,
            block.timestamp    // when purchase happened
        );
    }

    // 📊 SIMPLE GETTER: Get a specific product (this is cheap!)
    function getProduct(uint productId) external view returns (Product memory) {
        return products[productId];
    }

    // 📊 SIMPLE GETTER: Get total number of products ever created
    function getTotalProductCount() external view returns (uint) {
        return productCount;
    }

    // Withdraw accumulated platform fees
    function withdrawFees() external onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");

        // 📝 EMIT EVENT: Track when fees are withdrawn
        emit FeesWithdrawn(owner(), amount, block.timestamp);
    }
}
