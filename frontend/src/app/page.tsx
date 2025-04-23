"use client"; // Enable client-side rendering for framer-motion

import Image from "next/image";
import { DepositBorrowCard } from "@/components/dashboard/DepositBorrowCard";
import { StakingCard } from "@/components/dashboard/StakingCard";
import { UserStats } from "@/components/dashboard/UserStats";
import { HowItWorksContent } from "@/components/HowItWorksContent";
import { LampContainer } from "@/components/ui/lamp"; // Import LampContainer
import { motion } from "framer-motion"; // Import motion
import { Card } from "@/components/ui/card"; // Import Card
import { cn } from "@/lib/utils"; // Import cn

// Simple animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  // Define common card classes with transparent gradient
  const cardClasses = cn(
    "border border-white/15 backdrop-blur-lg", // Keep border and blur
    "bg-gradient-to-br from-transparent via-slate-950/30 to-black", // Darker transparent gradient,
    "shadow-lg shadow-slate-950/30 dark:shadow-[0_10px_30px_-10px_rgba(0,220,255,0.30)]"
  );

  return (
    // Apply main background and padding
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white p-4 md:p-8">
      {/* LampContainer remains the same */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8, // Keep original duration for main title
            ease: "easeInOut",
          }}
          className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-7xl font-medium tracking-tight text-transparent md:text-8xl"
        >
          Lumina Finance <br /> {/* Keep the line break */}
          <motion.span // Wrap "Yield Optimized" in its own motion element
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7, // Delay this part
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-3 block text-4xl md:text-5xl" // Smaller font size, make it a block to respect line break
          >
            Yield Optimized
          </motion.span>
        </motion.h1>
        {/* Add the tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.0, // Delay tagline appearance even more
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-6 text-center text-lg font-normal text-neutral-300 max-w-lg mx-auto"
        >
          Maximize your stablecoin returns effortlessly with automated DeFi
          strategies.
        </motion.p>
      </LampContainer>

      {/* Existing Content - adjust positioning and add card styling */}
      {/* Adjusted negative margin slightly, review if needed */}
      <div className="relative z-10 -mt-16 md:-mt-32 px-4">
        {/* Removed the h1 "Dashboard" title, assuming components have titles */}
        {/* <h1 className="text-center text-3xl font-bold text-slate-200 mb-6 pt-16 md:pt-24">
          Dashboard
        </h1> */}
        {/* Add padding top here instead and use space-y for vertical spacing */}
        <div className="pt-16 md:pt-24 space-y-10 max-w-4xl mx-auto">
          {/* UserStats Card - Apply specific styles */}

          {/* Deposit/Borrow and Staking Cards - Apply specific styles */}
          <div className="flex flex-col md:flex-row gap-10 justify-center">
            <Card
              className={cn(
                cardClasses,
                "border border-slate-700 bg-gradient-to-br from-slate-600/70 to-slate-800 shadow-[inset_0_2px_3px_0_rgba(255,255,255,0.08)]",
                "flex-1"
              )}
            >
              <DepositBorrowCard />
            </Card>
            <Card
              className={cn(
                cardClasses,
                "border border-slate-700 bg-gradient-to-br from-slate-600/70 to-slate-800 shadow-[inset_0_2px_3px_0_rgba(255,255,255,0.08)]",
                "flex-1"
              )}
            >
              <StakingCard />
            </Card>
          </div>
          <Card
            className={cn(
              cardClasses,
              "max-w-4xlborder border-slate-700 bg-gradient-to-br from-slate-600/70 to-slate-800 shadow-[inset_0_2px_3px_0_rgba(255,255,255,0.08)]"
            )}
          >
            <UserStats />
          </Card>
        </div>
      </div>

      {/* HowItWorks section - Use standard cardClasses */}
      <Card
        className={cn(
          cardClasses,
          "w-full max-w-3xl mx-auto mt-24 p-6 md:p-8 bg-transparent bg-gradient-to-br from-slate-600/40 to-slate-800"
        )}
      >
        <HowItWorksContent />
      </Card>
      {/* <motion.section 
        className="w-full max-w-3xl mx-auto mt-24"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.4 }}
      >
        <HowItWorksContent />
      </motion.section> */}
    </div>
  );
}
