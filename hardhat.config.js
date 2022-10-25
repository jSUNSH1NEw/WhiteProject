require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require("@nomiclabs/hardhat-etherscan")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  paths: {
    artifacts: './client/src/artifacts',
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 40000,
  },
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    // rinkeby: {
    //   url: process.env.INFURA,
    //   accounts: [process.env.PRIVATE_KEY_TEST],
    //   allowUnlimitedContractSize: true
    // },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY_TEST]
    },
    // bscmainnet: {
    //   url: "https://bsc-dataseed.binance.org/",
    //   chainId: 56,
    //   gasPrice: 20000000000,
    //   accounts: [process.env.PRIVATE_KEY]
    // }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN,
      rinkeby: process.env.ETHERSCAN,
      bsc: process.env.BSCSCAN,
      bscTestnet: process.env.BSCSCAN,
    }
  }
}