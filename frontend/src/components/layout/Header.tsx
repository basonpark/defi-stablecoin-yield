import React from "react";
import Link from "next/link";
import { WalletConnectButton } from "@/components/web3/WalletConnectButton"; // Changed path to use @ alias
import { Coins } from "lucide-react"; // Example icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Coins className="h-6 w-6 text-primary" /> {/* Or your logo */}
            <span className="font-bold inline-block">
              Lumina Finance
            </span>
          </Link>
          {/* --- Add Navigation Links --- */}
          <nav className="flex items-center gap-6 text-sm ml-6">
            <Link
              href="/" 
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/how-it-works" 
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              How It Works
            </Link>
             {/* Example for future links 
            <Link
              href="/governance" 
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Governance
            </Link> */}
          </nav>
          {/* --- End Navigation Links --- */}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
