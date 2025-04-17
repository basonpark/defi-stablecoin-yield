"use client"; // Needed for CodeBlock interactivity if not static

import React from 'react';
import { motion } from 'framer-motion'; // Import motion
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CodeBlock } from '@/components/CodeBlock'; // Import the new component
import { Lightbulb, Library, Calculator, Coins, TrendingUp, ShieldCheck, Scale, Zap, Settings, Network, Handshake, Feather } from 'lucide-react';

// --- Code Snippets (Extracted & Simplified from Contract Code) ---
const CODE = {
  collateralManager: {
    deposit: `
function deposit() external payable nonReentrant {
    uint256 amount = msg.value;
    require(amount > 0, "Deposit amount must be positive");
    collateralBalances[msg.sender] += amount;
    emit CollateralDeposited(msg.sender, amount);
}
    `,
    borrowLmc: `
function borrowLmc(uint256 _amount) external nonReentrant {
    require(_amount > 0, "Borrow amount must be positive");
    require(getHealthFactor(msg.sender) > PRECISION, "Health factor too low"); // Check HF > 1.0

    uint256 collateralValueUsd = getCollateralValueUSD(msg.sender);
    uint256 maxBorrowableUsd = (collateralValueUsd * LTV_RATIO_PERCENT) / 100;
    uint256 currentDebtUsd = getDebtValueUSD(msg.sender);
    uint256 requestedDebtUsd = (_amount * getLmcPriceUSD()) / PRECISION; // Assuming LMC price = $1

    require(currentDebtUsd + requestedDebtUsd <= maxBorrowableUsd, "Exceeds LTV ratio");

    debtBalances[msg.sender] += _amount;
    bool success = luminaCoin.mint(msg.sender, _amount); // Mint LMC to user
    require(success, "Minting LMC failed");

    emit LoanBorrowed(msg.sender, _amount);
}
    `,
    repayLmc: `
function repayLmc(uint256 _amount) external nonReentrant {
    require(_amount > 0, "Repay amount must be positive");
    uint256 currentDebt = debtBalances[msg.sender];
    require(_amount <= currentDebt, "Repay amount exceeds debt");

    debtBalances[msg.sender] = currentDebt - _amount;

    // Transfer LMC from user, then burn
    bool sent = luminaCoin.transferFrom(msg.sender, address(this), _amount);
    require(sent, "LMC transfer failed");
    bool burned = luminaCoin.burn(_amount); // Burn the repaid LMC
    require(burned, "LMC burn failed");

    emit LoanRepaid(msg.sender, _amount);
}
    `,
    withdrawCollateral: `
function withdrawCollateral(uint256 _amount) external nonReentrant {
    require(_amount > 0, "Withdraw amount must be positive");
    uint256 currentCollateral = collateralBalances[msg.sender];
    require(_amount <= currentCollateral, "Withdraw amount exceeds collateral");

    collateralBalances[msg.sender] = currentCollateral - _amount;

    // Check health factor AFTER hypothetical withdrawal
    require(getHealthFactor(msg.sender) > PRECISION, "Withdrawal would drop HF below 1.0");

    (bool success, ) = payable(msg.sender).call{value: _amount}("");
    require(success, "ETH transfer failed");

    emit CollateralWithdrawn(msg.sender, _amount);
}
    `,
    getHealthFactor: `
function getHealthFactor(address _user) public view returns (uint256) {
    uint256 collateralValue = getCollateralValueUSD(_user);
    uint256 debtValue = getDebtValueUSD(_user);

    if (debtValue == 0) return type(uint256).max; // Infinite HF if no debt

    // HF = (Collateral * Liquidation Threshold) / Debt
    uint256 thresholdCollateral = (collateralValue * LIQUIDATION_THRESHOLD_PERCENT) / 100;
    return (thresholdCollateral * PRECISION) / debtValue;
}
    `,
    liquidate: `
function liquidate(address _user) external nonReentrant {
    require(getHealthFactor(_user) < PRECISION, "Health factor is not below 1.0");

    uint256 debtToCover = debtBalances[_user];
    uint256 collateralToSeize = calculateCollateralToSeize(debtToCover);

    require(collateralBalances[_user] >= collateralToSeize, "Not enough user collateral");

    // Liquidator pays the debt in LMC
    bool sent = luminaCoin.transferFrom(msg.sender, address(this), debtToCover);
    require(sent, "Liquidator LMC transfer failed");
    bool burned = luminaCoin.burn(debtToCover);
    require(burned, "LMC burn failed");

    // Clear user's debt and reduce their collateral
    debtBalances[_user] = 0;
    collateralBalances[_user] -= collateralToSeize;

    // Transfer seized collateral (ETH) to liquidator
    (bool success, ) = payable(msg.sender).call{value: collateralToSeize}("");
    require(success, "Collateral transfer to liquidator failed");

    emit PositionLiquidated(_user, msg.sender, debtToCover, collateralToSeize);
}
    `,
  },
  luminaCoin: {
    mint: `
function mint(address _to, uint256 _amount) external override returns (bool) {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    _mint(_to, _amount);
    return true;
}
    `,
    burn: `
function burn(uint256 _amount) external override returns (bool) {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter"); // Usually the manager contract
    _burn(msg.sender, _amount); // Contract burns its own tokens
    return true;
}
    `,
  },
  stakingPool: {
    stake: `
function stake() external payable nonReentrant {
    uint256 amount = msg.value;
    require(amount > 0, "Stake amount must be positive");

    // Update reward tracking *before* changing balance
    _updateReward(msg.sender);

    stakedBalances[msg.sender] += amount;
    totalStaked += amount;

    emit Staked(msg.sender, amount);
}
    `,
    unstake: `
function unstake(uint256 _amount) external nonReentrant {
    require(_amount > 0, "Unstake amount must be positive");
    uint256 currentStake = stakedBalances[msg.sender];
    require(_amount <= currentStake, "Unstake amount exceeds stake");

    // Claim rewards first, then update balance & transfer
    _claimRewardInternal(msg.sender); // Implicit claim on unstake

    stakedBalances[msg.sender] = currentStake - _amount;
    totalStaked -= _amount;

    // Transfer ETH back to user
    (bool success, ) = payable(msg.sender).call{value: _amount}("");
    require(success, "ETH transfer failed");

    emit Unstaked(msg.sender, _amount);
}
    `,
    claimReward: `
function claimReward() external nonReentrant {
    _claimRewardInternal(msg.sender);
}

function _claimRewardInternal(address _user) internal {
    uint256 reward = earned(_user);
    if (reward > 0) {
        rewards[_user] = 0; // Reset earned amount
        _payReward(_user, reward); // Pay out the reward (internal ETH transfer)
    }
    // Update reward tracking point regardless of payout
    _updateReward(_user);
}
    `,
  }
};

// Helper for styling sections
const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
  <Card className={`mb-8 shadow-md border-l-4 border-primary ${className}`}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-2xl">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-base pl-6">
      {children}
    </CardContent>
  </Card>
);

export default function HowItWorksPage() {
  const minHealthFactor = 1.0;
  const liquidationThresholdPercent = 80;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div // Add animation to the main container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-primary">
          <Feather className="w-8 h-8" /> The Lumina Lowdown 
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center">
          Curious how Lumina turns your crypto into more crypto? Let's pull back the curtain and explore the smart contract magic!
          Think of it as a backstage tour of decentralized finance.
        </p>

        {/* --- Philosophy --- */}
        <SectionCard title="Our Philosophy: Simple & Secure DeFi" icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}>
          <p>
            DeFi can feel like a maze. Lumina aims to be a clear path. Our goal is to provide straightforward ways to leverage your ETH – either as collateral for stablecoin loans (LMC) or by staking it directly for rewards.
          </p>
          <p>
            We believe in transparency (hence this page!), security (audits are key!), and user control. Your keys, your crypto, your decisions.
          </p>
        </SectionCard>

        {/* --- Core Contracts Overview --- */}
        <SectionCard title="The Core Trio: Our Smart Contract Stars" icon={<Network className="w-6 h-6 text-blue-500" />}>
          <p>
            Three main contracts run the show:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong className="font-semibold">LuminaCoin (LMC):</strong> Our very own stablecoin, pegged to USD. It's minted when you borrow and burned when you repay.</li>
            <li><strong className="font-semibold">CollateralManager:</strong> The central hub! Handles your ETH deposits, LMC borrowing/repaying, and keeps an eye on loan health (the famous Health Factor!).</li>
            <li><strong className="font-semibold">StakingPool:</strong> Simple and sweet. Stake ETH here, earn more ETH as rewards based on pool performance.</li>
          </ul>
        </SectionCard>

        {/* --- CollateralManager Deep Dive --- */}
        <SectionCard title="CollateralManager: The Engine Room" icon={<Settings className="w-6 h-6 text-gray-600" />} className="border-green-500">
          <p>
            This contract is where most of the borrowing action happens. Let's see how it works.
          </p>

          <h3 className="font-semibold text-lg mt-6 mb-2">Depositing ETH (Your Collateral)</h3>
          <p>To borrow, you first need to provide collateral. Sending ETH to the contract's `deposit` function locks it up as backing for your future loan.</p>
          <CodeBlock language="solidity" code={CODE.collateralManager.deposit} />

          <h3 className="font-semibold text-lg mt-6 mb-2">Borrowing LuminaCoin (LMC)</h3>
          <p>Once you have collateral, you can borrow LMC using `borrowLmc`. The contract checks two crucial things: your Loan-to-Value (LTV) ratio (can't borrow more than ~66% of your collateral's value) and your Health Factor (must be above 1.0).</p>
          <CodeBlock language="solidity" code={CODE.collateralManager.borrowLmc} />

          <h3 className="font-semibold text-lg mt-6 mb-2">The Health Factor: Your Loan's Lifeline</h3>
          <p>Think of this as a safety score for your loan. It compares the value of your collateral (adjusted by the liquidation threshold) to the value of your debt. </p>
          <MathFormula>
            HF = (Collateral Value * Liquidation Threshold %) / Debt Value
          </MathFormula>
          <p>A Health Factor <strong className='text-red-600'>below 1.0</strong> means your position is undercollateralized and at risk of liquidation! Keep it healthy by adding collateral or repaying debt.</p>
          <CodeBlock language="solidity" code={CODE.collateralManager.getHealthFactor} />
          <Alert variant="destructive" className="mt-4">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Liquidation Risk!</AlertTitle>
            <AlertDescription>
              If your Health Factor drops below {minHealthFactor.toFixed(1)}, anyone can call the `liquidate` function to repay your debt in exchange for your collateral (plus a bonus!). Don't let this happen!
            </AlertDescription>
          </Alert>

          <h3 className="font-semibold text-lg mt-6 mb-2">Repaying Your LMC Loan</h3>
          <p>Ready to pay back? The `repayLmc` function takes LMC from you (you'll need to approve the contract first!), reduces your debt balance, and burns the repaid LMC to maintain the supply balance.</p>
          <CodeBlock language="solidity" code={CODE.collateralManager.repayLmc} />

          <h3 className="font-semibold text-lg mt-6 mb-2">Withdrawing Your ETH Collateral</h3>
          <p>Need your ETH back? Use `withdrawCollateral`. The contract ensures you don't withdraw so much that your Health Factor drops below 1.0.</p>
          <CodeBlock language="solidity" code={CODE.collateralManager.withdrawCollateral} />

           <h3 className="font-semibold text-lg mt-6 mb-2">Liquidation: The Safety Net</h3>
          <p>If a user's Health Factor falls below 1.0, the `liquidate` function allows anyone (a liquidator) to repay that user's LMC debt. In return, the liquidator receives a portion of the user's ETH collateral, worth slightly more than the debt paid (the liquidation bonus). This keeps the system solvent.</p>
          <CodeBlock language="solidity" code={CODE.collateralManager.liquidate} />
        </SectionCard>

        {/* --- LuminaCoin Deep Dive --- */}
        <SectionCard title="LuminaCoin (LMC): The Stable Heart" icon={<Coins className="w-6 h-6 text-yellow-600" />} className="border-yellow-500">
          <p>LMC is the stablecoin you borrow and repay. It aims to hold a steady value (e.g., $1 USD). Its supply is controlled directly by borrowing and repayment.</p>

          <h3 className="font-semibold text-lg mt-6 mb-2">Minting LMC</h3>
          <p>New LMC is created (`minted`) only when someone borrows it through the `CollateralManager`. Only authorized contracts (like the `CollateralManager`) have the `MINTER_ROLE` required to call `mint`.</p>
          <CodeBlock language="solidity" code={CODE.luminaCoin.mint} />

          <h3 className="font-semibold text-lg mt-6 mb-2">Burning LMC</h3>
          <p>When you repay your loan via the `CollateralManager`, the received LMC is destroyed (`burned`) by the manager contract calling the `burn` function. This removes it from circulation, balancing the supply.</p>
          <CodeBlock language="solidity" code={CODE.luminaCoin.burn} />
        </SectionCard>

        {/* --- StakingPool Deep Dive --- */}
        <SectionCard title="StakingPool: Earn While You Hodl" icon={<TrendingUp className="w-6 h-6 text-purple-500" />} className="border-purple-500">
          <p>Want to earn yield on your ETH without borrowing? The `StakingPool` is your friend. Deposit ETH, get rewards.</p>

          <h3 className="font-semibold text-lg mt-6 mb-2">Staking ETH</h3>
          <p>Send ETH to the `stake` function. The contract records your balance and adds your ETH to the total pool, increasing your share of future rewards.</p>
          <CodeBlock language="solidity" code={CODE.stakingPool.stake} />

          <h3 className="font-semibold text-lg mt-6 mb-2">Unstaking ETH</h3>
          <p>Use `unstake` to withdraw your deposited ETH. Before transferring your ETH back, it automatically calculates and pays out any pending rewards you've earned (`_claimRewardInternal`).</p>
          <CodeBlock language="solidity" code={CODE.stakingPool.unstake} />

          <h3 className="font-semibold text-lg mt-6 mb-2">Claiming Rewards</h3>
          <p>Want your rewards without unstaking? Call `claimReward`. It calculates your `earned` rewards based on your stake duration and share, pays them out, and resets your internal reward counter.</p>
          <CodeBlock language="solidity" code={CODE.stakingPool.claimReward} />
        </SectionCard>

         {/* --- Interactions --- */}
        <SectionCard title="How It All Connects" icon={<Handshake className="w-6 h-6 text-pink-500" />} className="border-pink-500">
          <p>
            These contracts don't live in isolation! They collaborate:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>User deposits ETH into `CollateralManager`.</li>
            <li>User borrows LMC via `CollateralManager`, which triggers `LuminaCoin` to `mint` new LMC for the user.</li>
            <li>User repays LMC to `CollateralManager`, which calls `LuminaCoin`'s `transferFrom` and then `burn` to destroy the repaid LMC.</li>
            <li>`CollateralManager` uses a Price Feed (like Chainlink's `IPriceFeed`) to get the current ETH/USD price for Health Factor calculations.</li>
            <li>`StakingPool` operates independently for direct ETH staking rewards.</li>
           </ul>
           <Alert className="mt-4 bg-indigo-50 border-indigo-200 text-indigo-800">
            <Zap className="h-4 w-4 !text-indigo-600" />
            <AlertTitle>Key Interaction</AlertTitle>
            <AlertDescription>
              The tight link between `CollateralManager` borrowing/repaying and `LuminaCoin` minting/burning is crucial for managing the LMC supply based on real collateralized debt.
            </AlertDescription>
          </Alert>
        </SectionCard>

        {/* --- Glossary --- */}
        <Card className="mt-10 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl"><Library className="w-6 h-6"/> Quick Glossary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Term</TableHead>
                  <TableHead>Definition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {/* (Keep the existing TableRows from previous version) */}
                 <TableRow>
                    <TableCell className="font-semibold">Collateral</TableCell>
                    <TableCell>Asset (ETH) pledged to secure a loan.</TableCell>
                 </TableRow>
                 <TableRow>
                    <TableCell className="font-semibold">LMC</TableCell>
                    <TableCell>LuminaCoin stablecoin (borrow/repay).</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">Health Factor</TableCell>
                    <TableCell>Loan safety score (keep &gt; {minHealthFactor.toFixed(1)}).</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">Liq. Threshold</TableCell>
                    <TableCell>Max borrowing % ({liquidationThresholdPercent}%) vs collateral value before liquidation risk.</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">LTV Ratio</TableCell>
                    <TableCell>Loan-to-Value: Max borrow amount relative to collateral value (e.g., 66%).</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">Staking</TableCell>
                    <TableCell>Depositing ETH in the StakingPool to earn rewards.</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">Minting</TableCell>
                    <TableCell>Creating new LMC tokens (happens during borrowing).</TableCell>
                 </TableRow>
                  <TableRow>
                   <TableCell className="font-semibold">Burning</TableCell>
                    <TableCell>Destroying LMC tokens (happens during repayment).</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">Oracle</TableCell>
                    <TableCell>Provides real-time price data (e.g., ETH/USD via Chainlink).</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-semibold">Liquidation</TableCell>
                    <TableCell>Process of repaying an unhealthy loan using its collateral.</TableCell>
                 </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Simple Math Formula Component (re-added for clarity)
const MathFormula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-3 p-3 bg-muted/50 rounded border font-mono text-sm overflow-x-auto shadow-inner">
    {children}
  </div>
);
