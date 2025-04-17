"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { getContractConfig, SEPOLIA_CHAIN_ID } from '@/lib/web3/contracts';
import { motion } from 'framer-motion'; // Import motion

export function UserStats() {
  const { address: userAddress, chainId, isConnected } = useAccount();

  // Get contract configuration based on the connected chain
  const contracts = getContractConfig(chainId);

  // --- Read CollateralManager Data ---
  const { data: collateralBalance, isLoading: isLoadingCollateral, error: errorCollateral } = useReadContract({
    ...contracts?.collateralManager,
    functionName: 'collateralBalances',
    args: [userAddress!], // Fetch only if address exists
    query: {
      enabled: isConnected && !!userAddress && !!contracts, // Only run query when connected and address/config available
    },
  });

  const { data: debtBalance, isLoading: isLoadingDebt, error: errorDebt } = useReadContract({
    ...contracts?.collateralManager,
    functionName: 'debtBalances',
    args: [userAddress!],
    query: {
      enabled: isConnected && !!userAddress && !!contracts,
    },
  });

  const { data: collateralValueUsd, isLoading: isLoadingCollateralValue, error: errorCollateralValue } = useReadContract({
    ...contracts?.collateralManager,
    functionName: 'getAccountCollateralValue',
    args: [userAddress!],
    query: {
      enabled: isConnected && !!userAddress && !!contracts,
    },
  });

  const { data: healthFactor, isLoading: isLoadingHealthFactor, error: errorHealthFactor } = useReadContract({
    ...contracts?.collateralManager,
    functionName: 'getHealthFactor',
    args: [userAddress!],
    query: {
      enabled: isConnected && !!userAddress && !!contracts,
    },
  });

  // --- Read StakingPool Data ---
  const { data: stakedBalance, isLoading: isLoadingStaked, error: errorStaked } = useReadContract({
    ...contracts?.stakingPool,
    functionName: 'stakedBalances',
    args: [userAddress!],
    query: {
      enabled: isConnected && !!userAddress && !!contracts,
    },
  });

  const { data: earnedRewards, isLoading: isLoadingRewards, error: errorRewards } = useReadContract({
    ...contracts?.stakingPool,
    functionName: 'earned',
    args: [userAddress!],
    query: {
      enabled: isConnected && !!userAddress && !!contracts,
    },
  });

  // --- Aggregate Loading/Error States ---
  const isLoading = isLoadingCollateral || isLoadingDebt || isLoadingCollateralValue || isLoadingHealthFactor || isLoadingStaked || isLoadingRewards;
  const hasError = errorCollateral || errorDebt || errorCollateralValue || errorHealthFactor || errorStaked || errorRewards;

  // --- Helper function for formatting BigInt to string with fallback ---
  const formatValue = (value: bigint | undefined | null, decimals = 18, suffix = '', precision = 4) => {
    if (value === undefined || value === null) return 'N/A';
    try {
      const formatted = formatUnits(value, decimals);
      // Show more precision for small numbers, less for large
      const num = parseFloat(formatted);
      const effectivePrecision = num < 1 ? 6 : precision;
      return `${num.toFixed(effectivePrecision)}${suffix}`;
    } catch (e) {
      console.error("Formatting error:", e);
      return 'Error';
    }
  };

  // --- Health Factor Formatting (special case, scaled by 1e18) ---
  const formatHealthFactor = (hf: bigint | undefined | null) => {
     if (hf === undefined || hf === null) return 'N/A';
     if (hf === BigInt(0) && debtBalance === BigInt(0)) return '∞'; // Handle zero debt case
     return formatValue(hf, 18, '', 2); // HF is scaled by 1e18, show 2 decimal places
  }

  const getHealthFactorColor = (hf: bigint | undefined | null) => {
      if (!isConnected || isLoading || hf === undefined || hf === null) return 'text-muted-foreground';
      const hfValue = Number(hf) / 1e18; // Adjust divisor if needed
      if (hfValue < 1.2) return 'text-destructive';
      if (hfValue < 1.8) return 'text-yellow-500';
      return 'text-green-500';
  };

  return (
    <motion.div // Wrap Card with motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="col-span-1 lg:col-span-2 shadow-lg"> { /* Add shadow */}
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <p className="text-muted-foreground">Connect your wallet to view your stats.</p>
          ) : !contracts ? (
            <p className="text-red-500">Unsupported network. Please switch to Sepolia.</p>
          ) : isLoading ? (
            <p className="text-muted-foreground">Loading stats...</p>
          ) : hasError ? (
            <p className="text-red-500">Error fetching stats. Please try again.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium">Total Collateral (ETH):</div>
              <div>{formatValue(collateralBalance as bigint)} ETH</div>

              <div className="font-medium">Collateral Value (USD):</div>
              <div>$ {formatValue(collateralValueUsd as bigint)}</div>

              <div className="font-medium">Borrowed (LMC):</div>
              {/* Assuming LMC also uses 18 decimals */}
              <div>{formatValue(debtBalance as bigint)} LMC</div>

              <div className="font-medium">Health Factor:</div>
              {/* HF color remains dynamic */}
              <div className={getHealthFactorColor(healthFactor as bigint)}>
                {formatHealthFactor(healthFactor as bigint)}
              </div>

              <div className="font-medium">Total Staked (ETH):</div>
              <div>{formatValue(stakedBalance as bigint)} ETH</div>

              <div className="font-medium">Earned Rewards (ETH):</div>
              <div>{formatValue(earnedRewards as bigint)} ETH</div>

            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
