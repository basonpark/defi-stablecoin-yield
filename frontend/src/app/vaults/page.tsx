"use client";

import { VaultCard, VaultData } from "@/components/vaults/VaultCard";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";

// TODO: Replace with actual data fetching from contracts/API
const mockVaults: VaultData[] = [
  {
    id: "usdc-stable-yield",
    name: "USDC Stable Yield",
    description:
      "Optimized yield strategy for USDC deposits using Aave and Compound.",
    apy: 5.25, // Percentage
    apyHistory: [4.8, 5.0, 5.1, 5.3, 5.2, 5.25], // Sample data for potential chart
    tvl: 12500000, // Total Value Locked in USD
    assets: ["USDC"],
    riskLevel: "Low",
    contractAddress: "0x...", // Placeholder
  },
  {
    id: "dai-aggressive",
    name: "DAI Aggressive Growth",
    description:
      "Higher risk strategy involving liquidity provision and yield farming.",
    apy: 12.8,
    apyHistory: [10.5, 11.2, 13.5, 12.0, 12.5, 12.8],
    tvl: 5500000,
    assets: ["DAI"],
    riskLevel: "Medium",
    contractAddress: "0x...",
  },
  {
    id: "mixed-stable-balancer",
    name: "Mixed Stable Balancer",
    description:
      "Balanced pool strategy with USDC, DAI, and USDT for diversified yield.",
    apy: 6.1,
    apyHistory: [5.9, 6.0, 6.2, 6.15, 6.1, 6.1],
    tvl: 8000000,
    assets: ["USDC", "DAI", "USDT"],
    riskLevel: "Low",
    contractAddress: "0x...",
  },
  // Add more mock vaults as needed
];

export default function VaultsPage() {
  return (
    // Add min-h-screen and bg-black to ensure this div takes full height and has a dark background
    <div className="min-h-screen bg-black">
      {/* Use LampContainer for the background and title */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-8xl"
        >
          Available Vaults
        </motion.h1>
      </LampContainer>

      {/* Vaults Grid - Increase bottom padding significantly */}
      <div className="relative z-10 -mt-40 md:-mt-60 pb-48">
        {" "}
        {/* Increased padding-bottom */}
        <div className="container mx-auto px-4 pt-16 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVaults.map((vault) => (
              <VaultCard key={vault.id} vault={vault} />
            ))}
          </div>
        </div>
      </div>
      <div className="h-50"></div>
    </div>
  );
}
