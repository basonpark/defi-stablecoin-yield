// /Users/basonpark/Desktop/defi-stablecoin-yield/frontend/src/components/HowItWorksContent.tsx
"use client";

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
import { Lightbulb, Library, Calculator, Coins, TrendingUp, Terminal, ShieldCheck, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

// Function to render math formulas (simple version)
const MathFormula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-3 p-3 bg-muted rounded font-mono text-sm overflow-x-auto">
    {children}
  </div>
);

export function HowItWorksContent() {
  // Example values (replace with actual contract values if dynamically fetched)
  const liquidationThresholdPercent = 150;
  const minHealthFactor = 1.0;

  return (
    <motion.div
      className="mt-12 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Change color to slate-100 */}
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-slate-100">
        <Lightbulb className="w-7 h-7" /> How Lumina Works
      </h2>
      {/* Change color to slate-300 */}
      <p className="text-md text-slate-300 mb-8 text-center">
        A quick dive into the mechanics behind the magic.
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4 mb-10">
        {/* === Overview === */}
        <AccordionItem value="item-1">
          {/* Change trigger color to slate-200 */}
          <AccordionTrigger className="text-lg font-semibold text-slate-200 hover:text-slate-100">
            <Library className="w-5 h-5 mr-2" /> What's the Big Idea?
          </AccordionTrigger>
          {/* Change content color to slate-300 */}
          <AccordionContent className="space-y-3 pl-8 text-base text-slate-300">
            <p>
              Lumina Finance lets you deposit ETH as collateral to borrow our stablecoin, LuminaCoin (LMC).
              You can also stake ETH directly to earn rewards.
            </p>
            <p>
              It's powered by transparent smart contracts: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">LuminaCoin</code> (the token),
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">CollateralManager</code> (handles borrowing/lending),
              and <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">StakingPool</code> (manages staking & rewards).
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* === Calculations: Health Factor === */}
        <AccordionItem value="item-3">
          {/* Change trigger color to slate-200 */}
          <AccordionTrigger className="text-lg font-semibold text-slate-200 hover:text-slate-100">
            <Calculator className="w-5 h-5 mr-2" /> The Health Factor
          </AccordionTrigger>
          {/* Change content color to slate-300 */}
          <AccordionContent className="space-y-3 pl-8 text-base text-slate-300">
            <p>
              This number shows the safety of your loan. Keep it above <strong className="font-semibold text-slate-100">{minHealthFactor.toFixed(1)}</strong> to avoid liquidation risk!
            </p>
            <MathFormula>
              HF = (Collateral Value * Liquidation Threshold) / Debt Value
            </MathFormula>
            {/* Ensure list items inherit slate-300 */}
            <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
              <li><strong className="font-semibold text-slate-100">Collateral Value (USD) =</strong> ETH Deposited * ETH Price</li>
              <li><strong className="font-semibold text-slate-100">Liquidation Threshold =</strong> {liquidationThresholdPercent}% (or {liquidationThresholdPercent / 100})</li>
              <li><strong className="font-semibold text-slate-100">Debt Value (USD) =</strong> LMC Borrowed</li>
            </ul>
             <Alert variant="default" className="bg-blue-900/30 border-blue-700 text-slate-300 mt-4"> {/* Adjusted Alert styling */}
               <ShieldCheck className="h-4 w-4 text-blue-400" /> {/* Adjusted icon color */}
               <AlertTitle className="text-slate-100">Stay Healthy!</AlertTitle> {/* Adjusted title color */}
               <AlertDescription>
                 If ETH price drops, your HF falls. Repay LMC or add ETH to boost it.
               </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>

        {/* === Staking === */}
        <AccordionItem value="item-4">
          {/* Change trigger color to slate-200 */}
          <AccordionTrigger className="text-lg font-semibold text-slate-200 hover:text-slate-100">
            <TrendingUp className="w-5 h-5 mr-2" /> Staking Rewards
          </AccordionTrigger>
          {/* Change content color to slate-300 */}
          <AccordionContent className="space-y-3 pl-8 text-base text-slate-300">
            <p>
              Deposit ETH into the <strong className="font-semibold text-slate-100">StakingPool</strong> contract to earn passive rewards.
              Your reward share depends on how much you stake and for how long, relative to the total pool.
            </p>
             <Alert variant="default" className="bg-muted/50 border-slate-700 text-slate-300 mt-4"> {/* Adjusted Alert styling */}
               <AlertTitle className="text-slate-100">Note on APY</AlertTitle> {/* Adjusted title color */}
               <AlertDescription>
                 The dashboard shows raw earned rewards, not a projected APY, as it depends on variable factors.
               </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* === Glossary === */}
      <Card className="mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Library className="w-5 h-5"/> Quick Glossary</CardTitle>
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
                <TableCell>Max borrowing % ({liquidationThresholdPercent}%) vs collateral value.</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-semibold">Staking</TableCell>
                <TableCell>Depositing ETH to earn rewards.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Oracle</TableCell>
                <TableCell>Provides real-time price data (e.g., ETH/USD).</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
