import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lightbulb, Library, Calculator, Coins, TrendingUp, Terminal, ShieldCheck, Scale } from 'lucide-react'; // Added more icons

// Function to render math formulas (simple version)
const MathFormula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-3 p-3 bg-muted rounded font-mono text-sm overflow-x-auto">
    {children}
  </div>
);

export default function HowItWorksPage() {
  // Example values (replace with actual contract values if dynamically fetched)
  const liquidationThresholdPercent = 150;
  const minHealthFactor = 1.0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <Lightbulb className="w-8 h-8" /> How Lumina Finance Works ✨
      </h1>
      <p className="text-lg text-muted-foreground mb-10 text-center">
        Ready for a peek behind the curtain? Discover how Lumina turns your crypto into yield-generating magic!
        We'll break down the smart contracts and number-crunching involved. Don't worry, it's cooler than it sounds.
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4 mb-10">

        {/* === Overview === */}
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold">
            <Library className="w-5 h-5 mr-2" /> What's the Big Idea?
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pl-8 text-base">
            <p>
              Lumina Finance is a decentralized lending platform built on Ethereum (specifically, the Sepolia testnet for now!).
              Our mission? To let you leverage your ETH holdings in exciting new ways.
            </p>
            <p>
              Think of it like this: You deposit your ETH as collateral, and in return, you can borrow our native stablecoin, <strong className="font-semibold">LuminaCoin (LMC)</strong>.
              But wait, there's more! You can also stake your ETH directly to earn yield generated by the protocol.
            </p>
            <p>
              It's all powered by a set of transparent, automated smart contracts working together like a well-oiled (digital) machine.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* === The Contracts === */}
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-semibold">
            <Terminal className="w-5 h-5 mr-2" /> The Trio of Trust: Our Smart Contracts
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pl-8 text-base">
            <p className="mb-4">Lumina runs on three core smart contracts. Let's meet the crew:</p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5 text-primary"/> LuminaCoin (LMC)</CardTitle>
                <CardDescription>The Stable Heartbeat</CardDescription>
              </CardHeader>
              <CardContent>
                LMC is our very own ERC20 token, designed to maintain a stable value (pegged 1:1 to USD, notionally).
                It's the currency you borrow and repay within the system. Crucially, LMC is only <strong className="font-semibold">minted</strong> when users borrow against their collateral and <strong className="font-semibold">burned</strong> when loans are repaid, ensuring its value is always backed.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5 text-primary"/> CollateralManager</CardTitle>
                <CardDescription>The Brains of the Operation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>This contract is the central hub, managing all the core lending functions:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li><strong className="font-semibold">Deposits:</strong> Securely holds your deposited ETH collateral.</li>
                  <li><strong className="font-semibold">Borrows:</strong> Calculates how much LMC you can borrow based on your collateral and the current ETH price (fetched from a Chainlink Price Feed oracle!). It then mints the LMC for you.</li>
                  <li><strong className="font-semibold">Repayments:</strong> Accepts your LMC, burns it (removing it from circulation), and updates your debt balance.</li>
                  <li><strong className="font-semibold">Withdrawals:</strong> Allows you to retrieve your deposited ETH, provided your loan is sufficiently collateralized (more on Health Factor below!).</li>
                  <li><strong className="font-semibold">Price Oracle Integration:</strong> Constantly checks the real-time ETH/USD price to accurately value collateral and debt.</li>
                  <li><strong className="font-semibold">Liquidation Logic:</strong> Monitors the 'Health Factor' of loans. If it drops too low, this contract handles the liquidation process to protect the protocol (though liquidations aren't fully implemented in this version yet!).</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/> StakingPool</CardTitle>
                <CardDescription>The Yield Engine</CardDescription>
              </CardHeader>
              <CardContent>
                Want to earn some passive income on your ETH? This is the place! The Staking Pool allows users to directly stake their ETH.
                In return, they earn a share of rewards distributed to the pool (these rewards might come from protocol fees or external funding in different versions).
                You can <strong className="font-semibold">stake</strong>, <strong className="font-semibold">unstake</strong>, and <strong className="font-semibold">claim</strong> your earned ETH rewards through this contract.
                Your reward share is calculated based on how much you've staked relative to the total amount in the pool.
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* === Calculations: Health Factor === */}
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-semibold">
            <Calculator className="w-5 h-5 mr-2" /> Math Magic: The Health Factor
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pl-8 text-base">
            <p>
              Okay, let's talk numbers! The most crucial calculation in Lumina is the <strong className="font-semibold">Health Factor (HF)</strong>.
              It's a single number that represents the safety of your loan. Think of it as a buffer protecting you (and the protocol) from liquidation if the value of your collateral drops.
            </p>
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
              <ShieldCheck className="h-4 w-4 !text-blue-600" />
              <AlertTitle>Why is Health Factor Important?</AlertTitle>
              <AlertDescription>
                If your Health Factor drops below <strong className="font-semibold">{minHealthFactor.toFixed(1)}</strong>, your position becomes eligible for liquidation.
                Keeping your HF healthy (above {minHealthFactor.toFixed(1)}) is key to avoiding this!
              </AlertDescription>
            </Alert>
            <p>Here's the magic formula:</p>
            <MathFormula>
              Health Factor = (Total Collateral Value in USD * Liquidation Threshold) / Total Debt Value in USD
            </MathFormula>
            <p>Let's break it down:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong className="font-semibold">Total Collateral Value (USD):</strong> This is the current market value of your deposited ETH.
                <MathFormula>ETH Deposited * Current ETH/USD Price</MathFormula>
              </li>
              <li>
                <strong className="font-semibold">Liquidation Threshold:</strong> This is a safety parameter set by the protocol (currently <strong className="font-semibold">{liquidationThresholdPercent}%</strong>).
                It represents the maximum percentage of your collateral's value that can be covered by debt before liquidation risk increases significantly. It's applied as a multiplier (e.g., {liquidationThresholdPercent}% = {liquidationThresholdPercent / 100}).
              </li>
              <li>
                <strong className="font-semibold">Total Debt Value (USD):</strong> This is the total amount of LMC you've borrowed. Since LMC aims for a 1 USD peg, this is simply:
                <MathFormula>LMC Borrowed Amount</MathFormula>
              </li>
            </ul>
            <p>
              <strong className="font-semibold">Example:</strong> You deposit 1 ETH when ETH = $3000. Your Collateral Value is $3000.
              You borrow 1000 LMC. Your Debt Value is $1000.
            </p>
            <MathFormula>
              HF = ($3000 * {liquidationThresholdPercent / 100}) / $1000 = ${(3000 * (liquidationThresholdPercent / 100) / 1000).toFixed(2)}
            </MathFormula>
            <p>
              Since ${(3000 * (liquidationThresholdPercent / 100) / 1000).toFixed(2)} is comfortably above {minHealthFactor.toFixed(1)}, your position is healthy!
              If the ETH price dropped significantly, your Collateral Value would decrease, lowering your Health Factor.
              You can improve your HF by repaying LMC or depositing more ETH.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* === Staking === */}
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-semibold">
            <TrendingUp className="w-5 h-5 mr-2" /> Staking: Earning While You HODL
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pl-8 text-base">
            <p>
              Beyond borrowing, Lumina offers a way to put your ETH to work directly through the <strong className="font-semibold">StakingPool</strong> contract.
              It's simple: you lock up some ETH in the pool, and you start earning rewards.
            </p>
            <p>
              <strong className="font-semibold">How do rewards work?</strong> The pool accumulates ETH rewards over time (these could be sourced from protocol fees in the future, but for now, they might be added manually for testing).
              The contract keeps track of a <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">rewardPerToken</code> metric, which increases as more rewards are added.
              Your claimable reward is calculated based on your staked amount and the change in <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">rewardPerToken</code> since you last interacted (staked, unstaked, or claimed).
            </p>
            <p>Essentially, the more you stake and the longer you stake for, the larger your share of the distributed rewards will be.</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li><strong className="font-semibold">Stake:</strong> Deposit ETH into the pool to start earning.</li>
              <li><strong className="font-semibold">Unstake:</strong> Withdraw your deposited ETH (you'll stop earning rewards on the withdrawn amount).</li>
              <li><strong className="font-semibold">Claim Reward:</strong> Collect the ETH rewards you've earned so far.</li>
            </ul>
            <Alert variant="warning">
               <AlertTitle>Note on APY</AlertTitle>
               <AlertDescription>
                 Calculating a precise Annual Percentage Yield (APY) can be complex and depends on the rate rewards are added to the pool and the total amount staked.
                 The dashboard currently shows your raw earned rewards, not a projected APY.
               </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* === Glossary === */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Library className="w-5 h-5"/> Quick Glossary</CardTitle>
          <CardDescription>DeFi Jargon Demystified!</CardDescription>
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
              <TableRow>
                <TableCell className="font-semibold">Collateral</TableCell>
                <TableCell>An asset (like ETH) you pledge to secure a loan.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">LMC</TableCell>
                <TableCell>LuminaCoin, the native stablecoin of the Lumina Finance platform, which you borrow and repay.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Health Factor</TableCell>
                <TableCell>A number representing the safety of your borrowed position against your collateral. Below {minHealthFactor.toFixed(1)} means liquidation risk.</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-semibold">Liquidation Threshold</TableCell>
                <TableCell>The percentage ({liquidationThresholdPercent}%) of your collateral value that determines the maximum borrowing capacity before hitting the minimum Health Factor.</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-semibold">Staking</TableCell>
                <TableCell>Depositing assets (ETH in this case) into a pool to earn rewards.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Price Oracle</TableCell>
                <TableCell>A secure source (like Chainlink) that provides real-world data (like ETH/USD price) to smart contracts.</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-semibold">Minting / Burning</TableCell>
                <TableCell>Creating new tokens (minting) or destroying existing tokens (burning), typically used to manage the supply of stablecoins like LMC.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
