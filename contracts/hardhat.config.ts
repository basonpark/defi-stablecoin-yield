
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem"; // Use Viem toolbox
import "@nomicfoundation/hardhat-ethers"; // Still needed for some plugins potentially? Or remove if pure Viem
import "hardhat-gas-reporter";
import "solidity-coverage";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "[https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your_private_key_here"; // Placeholder - DO NOT COMMIT ACTUAL KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "your_etherscan_api_key"; // Placeholder

const config: HardhatUserConfig = {
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
    hardhat: { // Local development network
      chainId: 31337,
    },
    sepolia: { // Ethereum Testnet
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== "your_private_key_here" ? [PRIVATE_KEY] : [], // Use account only if key is provided
      chainId: 11155111,
    },
    // Add other networks like Goerli or Mainnet if needed
    // goerli: {
    //   url: process.env.GOERLI_RPC_URL || "YOUR_GOERLI_RPC_URL",
    //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    //   chainId: 5,
    // },
  },
  gasReporter: { // Optional: For gas usage analysis
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Uncomment if you have an API key
    // token: "ETH", // or "MATIC", etc.
    outputFile: "gas-report.txt",
    noColors: true,
  },
  etherscan: { // For contract verification
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000, // Increase timeout for potentially long tests/deployments
  },
};

export default config;