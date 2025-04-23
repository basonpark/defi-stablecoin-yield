"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the structure for Vault data
export interface VaultData {
  id: string;
  name: string;
  description: string;
  apy: number;
  apyHistory?: number[]; // Optional for chart
  tvl: number;
  assets: string[]; // Asset symbols like "USDC", "DAI"
  riskLevel: "Low" | "Medium" | "High";
  contractAddress: string; // Placeholder for contract interaction
}

interface VaultCardProps {
  vault: VaultData;
}

// Basic chart placeholder component (replace with actual Recharts later)
const MiniApyChart = ({ data }: { data?: number[] }) => {
  if (!data || data.length < 2) {
    return <div className="h-10 text-xs text-muted-foreground flex items-center justify-center">APY trend unavailable</div>;
  }
  // Basic visual representation (non-functional chart)
  const isTrendingUp = data[data.length - 1] > data[0];
  return (
    <div className="h-10 flex items-center space-x-1 text-xs text-muted-foreground">
      <TrendingUp size={14} className={cn(isTrendingUp ? "text-green-500" : "text-red-500", !isTrendingUp && "rotate-90")} />
      <span>{isTrendingUp ? "Trending Up" : "Trending Down"}</span>
    </div>
  );
};

export function VaultCard({ vault }: VaultCardProps) {
  const handleDeposit = () => {
    console.log("Deposit action triggered for vault:", vault.id, vault.contractAddress);
    // TODO: Implement deposit logic (e.g., open modal, interact with contract)
  };

  const handleWithdraw = () => {
    console.log("Withdraw action triggered for vault:", vault.id, vault.contractAddress);
    // TODO: Implement withdraw logic
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskBadgeVariant = (): "default" | "secondary" | "destructive" => {
    switch (vault.riskLevel) {
      case "Low": return "default"; // Consider green/blue if theme allows
      case "Medium": return "secondary"; // Consider yellow
      case "High": return "destructive";
      default: return "default";
    }
  };

  return (
    <Card className="bg-background/10 border-border/30 backdrop-blur-sm flex flex-col h-full hover:border-cyan-500/50 transition-colors duration-300 shadow-xl shadow-black/20 dark:shadow-cyan-950/30">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg text-white">{vault.name}</CardTitle>
          <Badge variant={getRiskBadgeVariant()} className="capitalize">
            {vault.riskLevel} Risk
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {vault.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {/* APY Section */}
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">Est. APY</p>
          <p className="text-2xl font-semibold text-cyan-400">{vault.apy.toFixed(2)}%</p>
          <MiniApyChart data={vault.apyHistory} />
        </div>

        {/* TVL & Assets Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">TVL</p>
            <p className="text-lg font-medium text-white">{formatCurrency(vault.tvl)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Assets</p>
            {/* Basic asset display - could use icons later */}
            <div className="flex flex-wrap gap-1">
              {vault.assets.map((asset) => (
                <Badge key={asset} variant="outline" className="text-xs text-neutral-300 border-neutral-600">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3 pt-4">
        <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400" onClick={handleDeposit}>
          Deposit
        </Button>
        <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700/30 hover:text-neutral-200" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </CardFooter>
    </Card>
  );
}
