"use client"; // Enable client-side rendering for framer-motion

import Image from "next/image";
import { DepositBorrowCard } from "@/components/dashboard/DepositBorrowCard";
import { StakingCard } from "@/components/dashboard/StakingCard";
import { UserStats } from "@/components/dashboard/UserStats";
import { HowItWorksContent } from '@/components/HowItWorksContent';
import { motion } from 'framer-motion'; // Import motion

// Simple animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <motion.div 
      className="container mx-auto py-8 px-4" 
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

      {/* Grid layout for dashboard cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ staggerChildren: 0.2, delayChildren: 0.2 }} // Stagger card animation
      >
        {/* User Overall Stats - Spans full width on mobile, 2 cols on medium+ */}
        <UserStats />

        {/* Deposit/Borrow Card */}
        <DepositBorrowCard />

        {/* Staking Card */}
        <StakingCard />
      </motion.div>

      {/* How It Works Section */}
      <motion.section 
        className="w-full max-w-5xl" 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.4 }} // Delay this section slightly
      >
        <HowItWorksContent />
      </motion.section>

       {/* TODO: Add component for displaying user's open positions/loans */}
       {/* TODO: Add component for transaction history? */}
    </motion.div>
  );
}
