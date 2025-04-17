"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getContractConfig } from "@/lib/web3/contracts";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import { motion } from 'framer-motion';

// TODO: Import contract ABI and address for StakingPool -> Done via getContractConfig

export function StakingCard() {
  const { address: userAddress, chainId, isConnected } = useAccount();
  const contracts = getContractConfig(chainId);

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  // Claim doesn't need an amount input

  // --- Read Staked Balance and Earned Rewards (for display and claim check) ---
  const { data: stakedBalance, refetch: refetchStakedBalance } =
    useReadContract({
      ...contracts?.stakingPool,
      functionName: "stakedBalances",
      args: [userAddress!],
      query: {
        enabled: isConnected && !!userAddress && !!contracts,
      },
    });

  const { data: earnedRewards, refetch: refetchEarnedRewards } =
    useReadContract({
      ...contracts?.stakingPool,
      functionName: "earned",
      args: [userAddress!],
      query: {
        enabled: isConnected && !!userAddress && !!contracts,
      },
    });

  // --- Wagmi Hooks for Write Actions ---
  const {
    data: stakeHash,
    writeContract: stake,
    isPending: isStaking,
    error: stakeError,
  } = useWriteContract();
  const {
    data: unstakeHash,
    writeContract: unstake,
    isPending: isUnstaking,
    error: unstakeError,
  } = useWriteContract();
  const {
    data: claimHash,
    writeContract: claimReward,
    isPending: isClaiming,
    error: claimError,
  } = useWriteContract();

  // --- Transaction Receipt Hooks ---
  const { isLoading: isConfirmingStake, isSuccess: isConfirmedStake } =
    useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isConfirmingUnstake, isSuccess: isConfirmedUnstake } =
    useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isLoading: isConfirmingClaim, isSuccess: isConfirmedClaim } =
    useWaitForTransactionReceipt({ hash: claimHash });

  // --- Handlers ---
  const handleStake = async () => {
    if (!isConnected || !contracts) {
      toast.error("Please connect wallet to Sepolia.");
      return;
    }
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid stake amount.");
      return;
    }
    try {
      const amount = parseEther(stakeAmount);
      stake({
        ...contracts.stakingPool,
        functionName: "stake",
        // No args for stake function itself
        value: amount, // Send ETH with the transaction
      });
    } catch (error) {
      console.error("Stake error:", error);
      toast.error("Failed to initiate stake. Invalid amount?");
    }
  };

  const handleUnstake = async () => {
    if (!isConnected || !contracts) {
      toast.error("Please connect wallet to Sepolia.");
      return;
    }
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error("Please enter a valid unstake amount.");
      return;
    }
    try {
      const amount = parseEther(unstakeAmount);
      unstake({
        ...contracts.stakingPool,
        functionName: "unstake",
        args: [amount],
      });
    } catch (error) {
      console.error("Unstake error:", error);
      toast.error("Failed to initiate unstake. Invalid amount?");
    }
  };

  const handleClaim = async () => {
    if (!isConnected || !contracts) {
      toast.error("Please connect wallet to Sepolia.");
      return;
    }
    // Check if there are rewards to claim
    if (!earnedRewards || (earnedRewards as bigint) <= BigInt(0)) {
      toast.info("No rewards to claim.");
      return;
    }

    try {
      claimReward({
        ...contracts.stakingPool,
        functionName: "claimReward",
        // No args needed
      });
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("Failed to initiate claim.");
    }
  };

  // --- Refetch data on successful transaction ---
  const refreshData = () => {
    refetchStakedBalance();
    refetchEarnedRewards();
    // Optionally refetch UserStats data if a central state/context is used
  };

  // --- Transaction Feedback Effects ---
  useEffect(() => {
    if (isStaking) toast.loading("Requesting stake...", { id: "stake-tx" });
    if (isConfirmingStake)
      toast.loading("Processing stake...", { id: "stake-tx" });
    if (isConfirmedStake) {
      toast.success("Stake successful!", { id: "stake-tx" });
      setStakeAmount("");
      refreshData();
    }
    if (stakeError)
      toast.error(`Stake failed: ${stakeError.message}`, { id: "stake-tx" });
  }, [isStaking, isConfirmingStake, isConfirmedStake, stakeError]);

  useEffect(() => {
    if (isUnstaking)
      toast.loading("Requesting unstake...", { id: "unstake-tx" });
    if (isConfirmingUnstake)
      toast.loading("Processing unstake...", { id: "unstake-tx" });
    if (isConfirmedUnstake) {
      toast.success("Unstake successful!", { id: "unstake-tx" });
      setUnstakeAmount("");
      refreshData();
    }
    if (unstakeError)
      toast.error(`Unstake failed: ${unstakeError.message}`, {
        id: "unstake-tx",
      });
  }, [isUnstaking, isConfirmingUnstake, isConfirmedUnstake, unstakeError]);

  useEffect(() => {
    if (isClaiming) toast.loading("Requesting claim...", { id: "claim-tx" });
    if (isConfirmingClaim)
      toast.loading("Processing claim...", { id: "claim-tx" });
    if (isConfirmedClaim) {
      toast.success("Rewards claimed successfully!", { id: "claim-tx" });
      refreshData();
    }
    if (claimError)
      toast.error(`Claim failed: ${claimError.message}`, { id: "claim-tx" });
  }, [isClaiming, isConfirmingClaim, isConfirmedClaim, claimError]);

  // Aggregate loading state
  const isProcessing =
    isStaking ||
    isConfirmingStake ||
    isUnstaking ||
    isConfirmingUnstake ||
    isClaiming ||
    isConfirmingClaim;

  // Format values for display
  const formattedStaked = stakedBalance
    ? formatEther(stakedBalance as bigint)
    : "0.0";
  const formattedRewards = earnedRewards
    ? formatEther(earnedRewards as bigint)
    : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          {/* Revert title color */}
          <CardTitle>ETH Staking</CardTitle>
          {/* Revert description color */}
          <CardDescription>Stake ETH to earn ETH rewards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display user stats */}
          <div>
            {/* Revert paragraph color */}
            <p className="text-sm text-muted-foreground">
              Your Staked ETH:{" "}
              {/* Revert value color */}
              <span className="font-medium text-foreground">
                {formattedStaked}
              </span>
            </p>
            {/* Revert paragraph color */}
            <p className="text-sm text-muted-foreground">
              Earned Rewards (ETH):{" "}
              {/* Revert value color */}
              <span className="font-medium text-foreground">
                {formattedRewards}
              </span>
            </p>
          </div>

          {/* Stake Section */}
          <div className="space-y-2">
            {/* Revert label color */}
            <label htmlFor="stake-amount" className="text-sm font-medium">
              Stake ETH
            </label>
            <div className="flex gap-2">
              <Input
                id="stake-amount"
                type="number"
                placeholder="0.0 ETH"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                disabled={isProcessing || !isConnected}
              />
              <Button
                onClick={handleStake}
                disabled={isProcessing || !isConnected || !stakeAmount}
              >
                {isStaking || isConfirmingStake ? "Staking..." : "Stake"}
              </Button>
            </div>
          </div>

          {/* Unstake Section */}
          <div className="space-y-2">
            {/* Revert label color */}
            <label htmlFor="unstake-amount" className="text-sm font-medium">
              Unstake ETH
            </label>
            <div className="flex gap-2">
              <Input
                id="unstake-amount"
                type="number"
                placeholder="0.0 ETH"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                disabled={isProcessing || !isConnected}
              />
              <Button
                onClick={handleUnstake}
                disabled={isProcessing || !isConnected || !unstakeAmount}
                variant="outline"
              >
                {isUnstaking || isConfirmingUnstake ? "Unstaking..." : "Unstake"}
              </Button>
            </div>
          </div>

          {/* Claim Rewards Section */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleClaim}
              disabled={
                isProcessing ||
                !isConnected ||
                !earnedRewards ||
                (earnedRewards as bigint) <= BigInt(0)
              }
              className="w-full"
            >
              {isClaiming || isConfirmingClaim
                ? "Claiming..."
                : `Claim ${formattedRewards} ETH Rewards`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
