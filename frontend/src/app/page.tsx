"use client"; // Enable client-side rendering for framer-motion

import Image from "next/image";
import { DepositBorrowCard } from "@/components/dashboard/DepositBorrowCard";
import { StakingCard } from "@/components/dashboard/StakingCard";
import { UserStats } from "@/components/dashboard/UserStats";
import { HowItWorksContent } from "@/components/HowItWorksContent";
import { LampContainer } from "@/components/ui/lamp"; // Import LampContainer
import { motion } from "framer-motion"; // Import motion

// Simple animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div>
      {/* Wrap content with LampContainer */}
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
          Lumina Finance <br /> Yield Optimized
        </motion.h1>
      </LampContainer>

      {/* Existing Content - positioned below the Lamp effect */}
      {/* Use relative positioning and z-index to ensure it appears above the lamp background */}
      <div className="relative z-10 -mt-20 md:-mt-40"> {/* Adjust vertical position */}
        {/* Add padding top to space it from the Lamp title */}
        <h1 className="text-center text-3xl font-bold text-slate-200 mb-6 pt-16 md:pt-24">
          Dashboard
        </h1>
        <UserStats />
        <div className="flex flex-col md:flex-row gap-10 justify-center mt-10">
          <DepositBorrowCard />

          <StakingCard />
        </div>
      </div>

      {/* HowItWorks section */}
      <motion.section
        className="w-full max-w-3xl mx-auto mt-24"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.4 }}
      >
        <HowItWorksContent />
      </motion.section>
    </div>
  );
}
