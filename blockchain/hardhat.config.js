require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
    // Sepolia network configuration removed as contract is already deployed
    // Contract Address: 0x643E4F63049ed820f1373AE6a82c01E4d1b6580c
  }
};
