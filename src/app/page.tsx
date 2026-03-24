"use client";

import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Package,
  Pencil,
  Mail,
  Heart,
  Mailbox,
  Star,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import FeaturesSection from "@/components/FeaturesSection";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";


const Squiggle = ({ className }: { className?: string }) => (
  <svg
    width="45"
    height="22"
    viewBox="0 0 45 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2.68652 10.4998C6.91501 10.4998 8.8778 3.01831 12.8778 3.01831C16.8778 3.01831 18.8242 18.4998 23.0039 18.4998C27.1836 18.4998 29.4795 3.01831 32.8778 3.01831C36.276 3.01831 38.6865 10.4998 42.6865 10.4998"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Dashes = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 6H12M14 6H20M4 12H20M4 18H10M12 18H20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg
    width="48"
    height="60"
    viewBox="0 0 48 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="2"
      y="2"
      width="44"
      height="56"
      rx="4"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M12 16H36M12 28H36M12 40H24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const FloatingIcon = ({ children, className, delay = 0 }: { children: React.ReactNode, className: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      y: [0, -10, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1],
      delay,
      opacity: { duration: 1, delay },
      scale: { duration: 1, delay }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { userId } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[85vh] flex flex-col items-center justify-center -mt-8">
        {/* Dynamic Background Glow Spots */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
            className="absolute top-[5%] left-[5%] w-[50vw] h-[50vw] bg-[#88AB8E]/5 dark:bg-[#88AB8E]/10 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -60, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: [0.42, 0, 0.58, 1], delay: 1 }}
            className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] bg-[#AFC8AD]/3 dark:bg-[#AFC8AD]/5 blur-[130px] rounded-full" 
          />
        </div>

        {/* Floating Background Illustrations */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none max-w-300 mx-auto overflow-visible z-1 opacity-60 dark:opacity-100">
          {/* Top Left Area */}
          <FloatingIcon className="absolute top-[18%] left-[18%]" delay={0.2}>
            <Star className="text-amber-400 w-8 h-8 rotate-15 stroke-2 fill-amber-400/20" />
          </FloatingIcon>
          <FloatingIcon className="absolute top-[22%] left-[28%]" delay={0.5}>
            <Pencil className="text-[#88AB8E] w-7 h-7 -rotate-12 stroke-2" />
          </FloatingIcon>

          {/* Mid Left Area */}
          <FloatingIcon className="absolute top-[45%] left-[8%]" delay={1}>
            <Package className="text-[#88AB8E] w-20 h-20 rotate-6 stroke-[1.5]" />
          </FloatingIcon>
          <FloatingIcon className="absolute top-[58%] left-[22%]" delay={0.8}>
            <Squiggle className="text-[#88AB8E] -rotate-6" />
          </FloatingIcon>

          {/* Bottom Left Area */}
          <FloatingIcon className="absolute bottom-[28%] left-[14%]" delay={1.2}>
            <div className="w-3 h-3 rounded-full bg-[#88AB8E]" />
          </FloatingIcon>
          <FloatingIcon className="absolute bottom-[15%] left-[25%]" delay={0.4}>
            <DocumentIcon className="text-[#88AB8E] -rotate-12" />
          </FloatingIcon>
          <FloatingIcon className="absolute bottom-[12%] left-[38%]" delay={0.7}>
            <Star className="text-amber-400 w-5 h-5 -rotate-6 stroke-[2.5]" />
          </FloatingIcon>

          {/* Top Right Area */}
          <FloatingIcon className="absolute top-[20%] right-[28%]" delay={0.9}>
            <div className="w-3 h-3 rounded-full bg-[#88AB8E]" />
          </FloatingIcon>
          <FloatingIcon className="absolute top-[18%] right-[10%]" delay={1.1}>
            <Dashes className="text-[#88AB8E] rotate-12 w-10 h-10" />
          </FloatingIcon>
          <FloatingIcon className="absolute top-[32%] right-[15%]" delay={0.3}>
            <Mail className="text-[#88AB8E] w-20 h-20 rotate-12 stroke-[1.5]" />
          </FloatingIcon>

          {/* Mid Right Area */}
          <FloatingIcon className="absolute top-[55%] right-[22%]" delay={1.4}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#88AB8E]" />
          </FloatingIcon>
          <FloatingIcon className="absolute top-[50%] right-[8%]" delay={0.6}>
            <Heart className="text-[#F94144] w-12 h-12 -rotate-12 stroke-2 fill-white dark:fill-[#0B0B0B]" />
          </FloatingIcon>

          {/* Bottom Right Area */}
          <FloatingIcon className="absolute bottom-[20%] right-[18%]" delay={0.5}>
            <Mailbox className="text-[#88AB8E] w-24 h-24 rotate-6 stroke-[1.5]" />
          </FloatingIcon>
          <FloatingIcon className="absolute bottom-[10%] right-[12%]" delay={1.3}>
            <Star className="text-amber-400 w-7 h-7 rotate-45 stroke-[2.5]" />
          </FloatingIcon>
        </div>

        {/* Full-Background Glassmorphic Layer */}
        <div className="absolute inset-0 bg-white/5 dark:bg-white/1 backdrop-blur-[2px] z-5 pointer-events-none" />

        {/* Transition Gradient to Features Section */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

        {/* Hero Content */}
        <motion.div 
          className="relative z-20 flex flex-col items-center px-8 md:px-12 py-10 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#88AB8E]/10 border border-[#88AB8E]/20 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#88AB8E]" />
            <span className="text-[10px] md:text-sm font-extrabold tracking-[0.2em] uppercase text-[#88AB8E]">
              OPENSHEET IS LIVE
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-[5rem] font-serif text-foreground dark:text-white mb-8 leading-[1.05] tracking-tight"
          >
            Track DSA practice lists, <span className="text-[#88AB8E] italic">minus the hassle.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground dark:text-neutral-400 mb-12 max-w-2xl leading-relaxed"
          >
            Merge popular problem sheets, get a deduplicated combined view, and
            regain the momentum of your interview prep.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            {userId ? (
              <Button
                asChild
                className="rounded-full px-10 py-7 text-lg font-bold bg-[#88AB8E] hover:bg-[#6E8E75] text-white transition-all shadow-[0_8px_30px_rgba(136,171,142,0.3)] hover:scale-105 active:scale-95 border-none"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Go to Dashboard <LayoutDashboard className="w-5 h-5 text-white/80" />
                </Link>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="rounded-full px-10 py-7 text-lg font-bold bg-[#88AB8E] hover:bg-[#6E8E75] text-white transition-all shadow-[0_8px_30px_rgba(136,171,142,0.3)] hover:scale-105 active:scale-95 border-none">
                  <span className="flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></span>
                </Button>
              </SignInButton>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <FeaturesSection />


    </div>
  );
}
