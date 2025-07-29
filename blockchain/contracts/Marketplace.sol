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

    mapping(uint => Product) public products;

    event ProductAdded(
        uint indexed id,
        address indexed seller,
        string name,
        uint price,
        uint quantity
    );

    event ProductBought(
        uint indexed id,
        address indexed buyer,
        uint quantity,
        uint totalPrice,
        uint platformFee
    );

    event FeesWithdrawn(address indexed owner, uint amount);

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

        emit ProductAdded(productCount, msg.sender, name, price, quantity);
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

        emit ProductBought(productId, msg.sender, quantityToBuy, totalPrice, fee);
    }

    // Withdraw accumulated platform fees
    function withdrawFees() external onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FeesWithdrawn(owner(), amount);
    }
}
