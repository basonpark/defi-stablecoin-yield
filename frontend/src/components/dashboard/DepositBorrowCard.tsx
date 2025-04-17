"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAccount, useWriteContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, Address } from 'viem';
import { toast } from 'sonner';
import { getContractConfig, collateralManagerConfig, luminaCoinConfig } from '@/lib/web3/contracts';
import { motion } from 'framer-motion'; // Import motion

export function DepositBorrowCard() {
  const { address: userAddress, chainId, isConnected } = useAccount();
  const contracts = getContractConfig(chainId);

  // Input States
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Wagmi Hooks state management
  const { data: depositHash, sendTransaction, isPending: isDepositing, error: depositError } = useSendTransaction();
  const { data: borrowHash, writeContract: borrow, isPending: isBorrowing, error: borrowError } = useWriteContract();
  const { data: approveHash, writeContract: approve, isPending: isApproving, error: approveError } = useWriteContract();
  const { data: repayHash, writeContract: repay, isPending: isRepaying, error: repayError } = useWriteContract();
  const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawing, error: withdrawError } = useWriteContract();

  // Transaction Receipt Hooks
  const { isLoading: isConfirmingDeposit, isSuccess: isConfirmedDeposit } = useWaitForTransactionReceipt({ hash: depositHash });
  const { isLoading: isConfirmingBorrow, isSuccess: isConfirmedBorrow } = useWaitForTransactionReceipt({ hash: borrowHash });
  const { isLoading: isConfirmingApprove, isSuccess: isConfirmedApprove } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isConfirmingRepay, isSuccess: isConfirmedRepay } = useWaitForTransactionReceipt({ hash: repayHash });
  const { isLoading: isConfirmingWithdraw, isSuccess: isConfirmedWithdraw } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // State to track if approval is needed/done for repayment
  const [needsApproval, setNeedsApproval] = useState(false);

  // --- Handlers ---

  const handleDeposit = async () => {
    if (!isConnected || !contracts) {
      toast.error('Please connect your wallet to the correct network (Sepolia).');
      return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }
    try {
      const value = parseEther(depositAmount);
      sendTransaction({
        to: contracts.collateralManager.address,
        value: value,
      });
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error('Failed to initiate deposit. Invalid amount?');
    }
  };

  const handleBorrow = async () => {
    if (!isConnected || !contracts) {
      toast.error('Please connect wallet to Sepolia.');
      return;
    }
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast.error('Please enter a valid borrow amount.');
      return;
    }
    try {
      const amount = parseEther(borrowAmount); // Assuming LMC has 18 decimals
      borrow({
        ...contracts.collateralManager,
        functionName: 'borrowLuminaCoin',
        args: [amount],
      });
    } catch (error) {
      console.error("Borrow error:", error);
      toast.error('Failed to initiate borrow. Invalid amount?');
    }
  };

  const handleApproveRepay = async () => {
    if (!isConnected || !contracts) {
      toast.error('Please connect wallet to Sepolia.');
      return;
    }
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      toast.error('Please enter a valid repay amount.');
      return;
    }
    try {
      const amount = parseEther(repayAmount);
      approve({
        ...contracts.luminaCoin,
        functionName: 'approve',
        args: [contracts.collateralManager.address, amount],
      });
    } catch (error) {
      console.error("Approve error:", error);
      toast.error('Failed to initiate approval. Invalid amount?');
    }
  };

  const handleRepay = async () => {
    if (!isConnected || !contracts) {
      toast.error('Please connect wallet to Sepolia.');
      return;
    }
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      toast.error('Please enter a valid repay amount.');
      return;
    }
    try {
      const amount = parseEther(repayAmount);
      repay({
        ...contracts.collateralManager,
        functionName: 'repayLuminaCoin',
        args: [amount],
      });
    } catch (error) {
      console.error("Repay error:", error);
      toast.error('Failed to initiate repayment. Invalid amount?');
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !contracts) {
      toast.error('Please connect wallet to Sepolia.');
      return;
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdraw amount.');
      return;
    }
    try {
      const amount = parseEther(withdrawAmount);
      withdraw({
        ...contracts.collateralManager,
        functionName: 'withdrawCollateral',
        args: [amount],
      });
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error('Failed to initiate withdrawal. Invalid amount?');
    }
  };

  // --- Transaction Feedback Effects ---
  useEffect(() => {
    if (isConfirmingDeposit) toast.loading('Processing deposit...', { id: 'deposit-tx' });
    if (isConfirmedDeposit) {
        toast.success('Deposit successful!', { id: 'deposit-tx' });
        setDepositAmount(''); // Clear input on success
        // TODO: Trigger data refresh for UserStats
    }
    if (depositError) toast.error(`Deposit failed: ${depositError.message}`, { id: 'deposit-tx' });
  }, [isConfirmingDeposit, isConfirmedDeposit, depositError]);

   useEffect(() => {
    if (isBorrowing) toast.loading('Requesting borrow...', { id: 'borrow-tx' });
    if (isConfirmingBorrow) toast.loading('Processing borrow...', { id: 'borrow-tx' });
    if (isConfirmedBorrow) {
        toast.success('Borrow successful!', { id: 'borrow-tx' });
        setBorrowAmount('');
        // TODO: Refresh data
    }
    if (borrowError) toast.error(`Borrow failed: ${borrowError.message}`, { id: 'borrow-tx' });
  }, [isBorrowing, isConfirmingBorrow, isConfirmedBorrow, borrowError]);

  useEffect(() => {
    if (isApproving) toast.loading('Requesting approval...', { id: 'approve-tx' });
    if (isConfirmingApprove) toast.loading('Processing approval...', { id: 'approve-tx' });
    if (isConfirmedApprove) {
        toast.success('Approval successful! You can now repay.', { id: 'approve-tx' });
        setNeedsApproval(false); // Allow repay button
    }
    if (approveError) toast.error(`Approval failed: ${approveError.message}`, { id: 'approve-tx' });
  }, [isApproving, isConfirmingApprove, isConfirmedApprove, approveError]);

  useEffect(() => {
    if (isRepaying) toast.loading('Requesting repayment...', { id: 'repay-tx' });
    if (isConfirmingRepay) toast.loading('Processing repayment...', { id: 'repay-tx' });
    if (isConfirmedRepay) {
        toast.success('Repayment successful!', { id: 'repay-tx' });
        setRepayAmount('');
        setNeedsApproval(true); // Require approval again for next time
        // TODO: Refresh data
    }
    if (repayError) {
        // Check if it's likely an allowance error
        if (repayError.message.includes('insufficient allowance')) {
            toast.error('Repayment failed: Insufficient allowance. Please approve first.', { id: 'repay-tx' });
            setNeedsApproval(true);
        } else {
            toast.error(`Repayment failed: ${repayError.message}`, { id: 'repay-tx' });
        }
    }
  }, [isRepaying, isConfirmingRepay, isConfirmedRepay, repayError]);

  useEffect(() => {
    if (isWithdrawing) toast.loading('Requesting withdrawal...', { id: 'withdraw-tx' });
    if (isConfirmingWithdraw) toast.loading('Processing withdrawal...', { id: 'withdraw-tx' });
    if (isConfirmedWithdraw) {
        toast.success('Withdrawal successful!', { id: 'withdraw-tx' });
        setWithdrawAmount('');
        // TODO: Refresh data
    }
    if (withdrawError) toast.error(`Withdrawal failed: ${withdrawError.message}`, { id: 'withdraw-tx' });
  }, [isWithdrawing, isConfirmingWithdraw, isConfirmedWithdraw, withdrawError]);

  // --- Check Allowance on Repay Amount Change ---
  // Basic check: Assume approval is needed if amount > 0. A real app would check allowance via useReadContract.
  useEffect(() => {
    setNeedsApproval(!!repayAmount && parseFloat(repayAmount) > 0);
  }, [repayAmount]);

  const isProcessing = isDepositing || isConfirmingDeposit || isBorrowing || isConfirmingBorrow || isApproving || isConfirmingApprove || isRepaying || isConfirmingRepay || isWithdrawing || isConfirmingWithdraw;

  return (
    <motion.div // Wrap Card with motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg"> { /* Add shadow */}
        <CardHeader>
          {/* Revert title color */}
          <CardTitle>Deposit & Borrow</CardTitle>
          {/* Revert description color */}
          <CardDescription>Deposit ETH as collateral to borrow LuminaCoin (LMC).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deposit Section */}
          <div className="space-y-2">
            {/* Revert label color */}
            <label htmlFor="deposit-amount" className="text-sm font-medium">Deposit ETH</label>
            <div className="flex gap-2">
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.0 ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isProcessing || !isConnected}
              />
              <Button
                onClick={handleDeposit}
                disabled={isProcessing || !isConnected || !depositAmount}
                variant="outline"
              >
                {isDepositing || isConfirmingDeposit ? 'Depositing...' : 'Deposit'}
              </Button>
            </div>
          </div>

          {/* Borrow Section */}
          <div className="space-y-2">
            {/* Revert label color */}
            <label htmlFor="borrow-amount" className="text-sm font-medium">Borrow LMC</label>
            <div className="flex gap-2">
              <Input
                id="borrow-amount"
                type="number"
                placeholder="0.0 LMC"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                disabled={isProcessing || !isConnected}
              />
              <Button
                onClick={handleBorrow}
                disabled={isProcessing || !isConnected || !borrowAmount}
              >
                {isBorrowing || isConfirmingBorrow ? 'Borrowing...' : 'Borrow'}
              </Button>
            </div>
          </div>

          {/* Repay Section */}
          <div className="space-y-2">
            {/* Revert label color */}
            <label htmlFor="repay-amount" className="text-sm font-medium">Repay LMC</label>
            <div className="flex gap-2">
              <Input
                id="repay-amount"
                type="number"
                placeholder="0.0 LMC"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                disabled={isProcessing || !isConnected}
              />
               {needsApproval ? (
                  <Button
                    onClick={handleApproveRepay}
                    disabled={isProcessing || !isConnected || !repayAmount}
                    variant="secondary"
                  >
                    {isApproving || isConfirmingApprove ? 'Approving...' : 'Approve'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleRepay}
                    disabled={isProcessing || !isConnected || !repayAmount}
                  >
                   {isRepaying || isConfirmingRepay ? 'Repaying...' : 'Repay'}
                  </Button>
              )}
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="space-y-2 pt-4 border-t">
            {/* Revert label color */}
            <label htmlFor="withdraw-amount" className="text-sm font-medium">Withdraw ETH</label>
            <div className="flex gap-2">
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.0 ETH"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isProcessing || !isConnected}
              />
              <Button
                onClick={handleWithdraw}
                disabled={isProcessing || !isConnected || !withdrawAmount}
                variant="outline"
              >
                {isWithdrawing || isConfirmingWithdraw ? 'Withdrawing...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </CardContent>
        {/* Footer can show current collateral/debt or other info if needed */}
        {/* <CardFooter>
          <p className="text-xs text-muted-foreground">Manage your collateral and loans.</p>
        </CardFooter> */}
      </Card>
    </motion.div>
  );
}
