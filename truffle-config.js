require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = { 
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
  },
  compilers: {
    solc: {
      version: "^0.8.17",
      settings: {          
        optimizer: {
          runs: 2000,
          enabled: true,
        }
      }
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",     
      port: 7545,            // Standard Ethereum port (8545) - not necessary when provider is set
      network_id: 5777,       
      websocket: true,        // Enable EventEmitter interface for web3 (default: false)
      production: true   // Treats this network as if it was a public net. (default: false)
    },
    goerli: {
      provider: () => new HDWalletProvider({
        providerOrUrl: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
        websocket: true,        // Enable EventEmitter interface for web3 (default: false)
        privateKeys: [
          PRIVATE_KEY
        ]
      }),
      network_id: 5, // chain ID
    },
    mainnet: {
      provider: () => new HDWalletProvider({
        providerOrUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        privateKeys: [
          PRIVATE_KEY
        ]
      }),
      websocket: true,        // Enable EventEmitter interface for web3 (default: false)
      network_id: 1,
    }
  },
  mocha: {
    useColors: true,
    timeout: 100000
  },
}
