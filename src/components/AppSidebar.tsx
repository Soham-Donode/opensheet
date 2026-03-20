"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { BookOpen, BrainCog, FolderHeart, LayoutDashboard, PanelLeft, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-[#666666] dark:text-neutral-400 h-[18px] w-[18px] flex-shrink-0" />
      ),
    },
    {
      label: "Striver A2Z",
      href: "/sheet/striver-a2z",
      icon: (
        <BookOpen className="text-[#666666] dark:text-neutral-400 h-[18px] w-[18px] flex-shrink-0" />
      ),
    },
    {
      label: "NeetCode 150",
      href: "/sheet/neetcode-150",
      icon: (
        <BrainCog className="text-[#666666] dark:text-neutral-400 h-[18px] w-[18px] flex-shrink-0" />
      ),
    },
    {
      label: "Blind 75",
      href: "/sheet/blind-75",
      icon: (
        <FolderHeart className="text-[#666666] dark:text-neutral-400 h-[18px] w-[18px] flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-10 flex flex-col gap-2 ">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  active={pathname === link.href}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
            <UserSection />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 p-1 md:p-2 bg-gray-100 dark:bg-neutral-800">
        <div className="flex flex-col w-full h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl md:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  const { setOpen } = useSidebar();
  return (
    <div className="flex items-center justify-between w-full h-12 pr-0">
      <Link
        href="/"
        className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
      >
        <Image
          src="/logo.svg"
          alt="Opensheet"
          width={190}
          height={50}
          className="dark:invert h-11 w-auto transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <button 
        onClick={() => setOpen(false)}
        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
      >
        <PanelLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
      </button>
    </div>
  );
};

export const LogoIcon = () => {
  const { setOpen } = useSidebar();
  return (
    <div className="flex items-center justify-center w-full h-12">
      <button 
        onClick={() => setOpen(true)}
        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
      >
        <PanelLeft className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
      </button>
    </div>
  );
};

export const UserSection = () => {
  const { user, isSignedIn } = useUser();
  const { open } = useSidebar();

  if (!isSignedIn) {
    return (
      <div className="w-full">
        {open ? (
          <SignInButton mode="modal">
            <Button variant="ghost" className="w-full justify-start gap-3 h-11 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400">
              <LogIn className="h-5 w-5" />
              <span className="text-sm font-medium">Sign in</span>
            </Button>
          </SignInButton>
        ) : (
          <div className="flex justify-center w-full">
            <SignInButton mode="modal">
              <button className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors">
                <LogIn className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center rounded-full transition-all duration-300", 
      open ? "w-full p-2.5 bg-neutral-200/50 dark:bg-neutral-800/50 gap-3" : "h-11 w-11 justify-center")}>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "h-9 w-9 border border-black/5 dark:border-white/5 shadow-sm"
          }
        }}
      />
      <AnimatePresence mode="wait">
        {open && (
          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5, transition: { duration: 0.1 } }}
            className="flex flex-col min-w-0"
          >
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
              {user?.fullName || user?.username || "Learner"}
            </p>
            <p className="text-[11px] text-neutral-500 truncate leading-tight mt-0.5">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
