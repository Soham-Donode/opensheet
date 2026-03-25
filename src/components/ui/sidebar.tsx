"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div> & { brand?: React.ReactNode },
) => {
  const { brand, ...rest } = props;
  return (
    <>
      <DesktopSidebar {...rest} />
      <MobileSidebar brand={brand} {...(rest as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col bg-[#e9efea]/50 dark:bg-neutral-800 flex-shrink-0 overflow-hidden",
        open ? "px-3" : "px-[7.5px]",
        className,
      )}
      animate={{
        width: animate ? (open ? "250px" : "60px") : "250px",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  brand,
  ...props
}: React.ComponentProps<"div"> & { brand?: React.ReactNode }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#e9efea]/50 dark:bg-neutral-800 w-full",
        )}
        {...props}
      >
        <div className="flex justify-start z-20 w-fit">
          {brand}
        </div>
        <div className="flex justify-end z-20">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-[#e9efea]/50 backdrop-blur-xl dark:bg-neutral-900/90 p-10 z-[100] flex flex-col justify-between overflow-hidden",
                className,
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  active,
  ...props
}: {
  link: Links;
  className?: string;
  active?: boolean;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center group/sidebar rounded-full transition-all duration-300",
        active
          ? "bg-white/60 dark:bg-white/10 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-white/40 dark:border-white/5 text-neutral-900 dark:text-neutral-100"
          : "hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 text-[#666666] dark:text-neutral-400",
        "py-2 px-3 min-h-[44px] justify-start gap-3",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "shrink-0 transition-transform duration-300",
          active && "scale-105",
        )}
      >
        {link.icon}
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5, transition: { duration: 0.1 } }}
            className={cn(
              "text-[14px] font-medium transition duration-150 whitespace-pre inline-block !p-0 !m-0",
              active
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-inherit",
            )}
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};
