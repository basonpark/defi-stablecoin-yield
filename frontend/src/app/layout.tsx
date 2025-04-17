import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css"; 
import { cn } from "@/lib/utils"
import { Web3Providers } from "@/lib/web3/providers"; 
import { Header } from "@/components/layout/Header"; 
import { Toaster } from "@/components/ui/sonner"; 
import { Footer } from "@/components/layout/Footer"; 
import 'prismjs/themes/prism-okaidia.css'; 

const fontSans = FontSans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina Finance - Decentralized Lending",
  description: "Deposit collateral, borrow LuminaCoin, and earn yield.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className={`${fontSans.className} bg-background text-foreground`}>
        <Web3Providers> 
          <div className="relative flex min-h-screen flex-col">
            <Header /> 
            <main className="flex-1">{children}</main>
            <Footer /> 
          </div>
          <Toaster /> 
        </Web3Providers>
      </body>
    </html>
  );
}
