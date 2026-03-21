"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  BrainCog,
  FolderHeart,
  LayoutDashboard,
  Plus,
  FileText,
  Pin,
  Trash,
  Pencil,
  MoreVertical,
  PanelLeft,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreateSheetDialog } from "@/components/CreateSheetDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { togglePinUserSheet, deleteUserSheet, renameUserSheet } from "@/app/custom-sheet-actions";

export function AppSidebar({ children, customSheets = [] }: { children: React.ReactNode, customSheets?: any[] }) {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  
  const [renameOpen, setRenameOpen] = useState(false);
  const [sheetToRename, setSheetToRename] = useState<any>(null);
  const [newName, setNewName] = useState("");

  const pathname = usePathname();
  const popularLists = [
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

  const customLists = (customSheets || []).map(sheet => ({
    id: sheet.id,
    label: sheet.name,
    href: `/sheet/${sheet.slug}`,
    icon: sheet.isPinned ? (
      <Pin className="text-[#666666] dark:text-neutral-400 h-[18px] w-[18px] flex-shrink-0" />
    ) : (
      <FileText className="text-[#666666] dark:text-neutral-400 h-[18px] w-[18px] flex-shrink-0" />
    ),
    isPinned: sheet.isPinned,
  }));

  return (
    <>
    <div
      className={cn(
        "flex flex-col md:flex-row dark:bg-[#030303] w-full flex-1 overflow-x-hidden md:overflow-hidden h-auto md:h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-4">
              {/* Popular Lists Section */}
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="wait">
                  {open && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 px-3 mb-1"
                    >
                      Popular Sheets
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex flex-col gap-1">
                  {popularLists.map((link, idx) => (
                    <SidebarLink
                      key={idx}
                      link={link}
                      active={pathname === link.href}
                    />
                  ))}
                </div>
              </div>

              {/* Your Lists Section */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between px-3 mb-1 group/header">
                  <AnimatePresence mode="wait">
                    {open && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500"
                      >
                        Your Sheets
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    {open && (
                      <motion.button
                        onClick={() => setCreateOpen(true)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="p-1 rounded-md hover:bg-neutral-200/50 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-col gap-1">
                  {customLists.map((link) => (
                    <div key={link.id} className="relative group/custom">
                      <SidebarLink
                        link={link}
                        active={pathname === link.href}
                        className={open ? "pr-8" : ""}
                      />
                      {open && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/custom:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => togglePinUserSheet(link.id, !link.isPinned)}>
                                <Pin className="mr-2 h-4 w-4" /> {link.isPinned ? "Unpin Sheet" : "Pin Sheet"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => {
                                setSheetToRename(link);
                                setNewName(link.label);
                                setRenameOpen(true);
                              }}>
                                <Pencil className="mr-2 h-4 w-4" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                onClick={() => deleteUserSheet(link.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  ))}
                  {open && customLists.length === 0 && (
                    <p className="px-3 text-[11px] text-neutral-400/60 dark:text-neutral-500/50 italic py-1">
                      No custom sheets yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200/50 dark:border-white/10">
            <UserSection />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 p-1 md:p-2 bg-[#e9efea]/50 dark:bg-[#262626] min-h-0">
        <div className="flex flex-col w-full h-full bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-white/10 rounded-2xl md:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>

    <CreateSheetDialog open={createOpen} onOpenChange={setCreateOpen} />

    <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Rename Sheet</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            placeholder="Sheet name..." 
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button className="bg-[#4361EE] hover:bg-[#324BCC] text-white" onClick={() => {
            if (newName.trim()) renameUserSheet(sheetToRename.id, newName.trim());
            setRenameOpen(false);
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
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

  return (
    <div className="flex flex-col gap-2 w-full">
      <ThemeToggle expanded={open} />
      {!isSignedIn ? (
        <div className="w-full">
          {open ? (
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-sm font-medium">Sign in</span>
              </Button>
            </SignInButton>
          ) : (
            <div className="flex justify-center w-full">
              <SignInButton mode="modal">
                <button className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors">
                  <LogIn className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center rounded-full transition-all duration-300",
            open
              ? "w-full p-2.5 bg-neutral-200/50 dark:bg-white/5 gap-3"
              : "h-11 w-11 justify-center",
          )}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-9 w-9 border border-black/5 dark:border-white/10 shadow-sm",
              },
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
                <p className="text-sm font-semibold text-neutral-800 dark:text-white truncate leading-tight">
                  {user?.fullName || user?.username || "Learner"}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate leading-tight mt-0.5">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
