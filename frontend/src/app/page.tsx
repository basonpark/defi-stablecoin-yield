"use client"; // Enable client-side rendering for framer-motion

import Image from "next/image";
import { DepositBorrowCard } from "@/components/dashboard/DepositBorrowCard";
import { StakingCard } from "@/components/dashboard/StakingCard";
import { UserStats } from "@/components/dashboard/UserStats";
import { HowItWorksContent } from "@/components/HowItWorksContent";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion"; // Import motion

// Simple animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Lumina Finance
      </motion.h1>
      
      {/* Move the rest of the page content inside LampContainer */}
      {/* Increase margin-top further */}
      <motion.div
        className="container mx-auto px-4 py-8 mt-96" 
        initial="hidden"
        animate="visible"
        variants={sectionVariants} 
      >
        {/* Existing Content - now inside LampContainer */}
        {/* Change text color for better visibility */}
        <h1 className="text-center text-3xl font-bold text-slate-200 mb-6"> 
          Dashboard
        </h1>

        <motion.div
          className="flex flex-col justify-center gap-6 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
        >
          <UserStats />
          <div className="flex flex-col md:flex-row gap-10 justify-center mt-10">
            <DepositBorrowCard />

            <StakingCard />
          </div>
        </motion.div>

        {/* How It Works Section */}
        {/* Increase margin-top */}
        <motion.section
          className="w-full max-w-3xl mx-auto mt-24" 
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ delay: 0.4 }}
        >
          <HowItWorksContent />
        </motion.section>

        {/* TODO: Add component for displaying user's open positions/loans */}
        {/* TODO: Add component for transaction history? */}
      </motion.div>
    </LampContainer>
  );
}
