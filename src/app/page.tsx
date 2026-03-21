import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BrainCog,
  FolderHeart,
  ArrowRight,
  Package,
  Pencil,
  Mail,
  Heart,
  Mailbox,
  Star,
} from "lucide-react";

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

export default async function Home() {
  const { userId } = await auth();

  const sheets = [
    {
      title: "Striver A2Z",
      description:
        "Master the most frequently asked problems logically step-by-step.",
      href: "/sheet/striver-a2z",
      icon: <BookOpen className="w-8 h-8 text-[#88AB8E] dark:text-[#88AB8E]" />,
    },
    {
      title: "NeetCode 150",
      description:
        "A curated list of leetcode problems to ace your technical interviews.",
      href: "/sheet/neetcode-150",
      icon: <BrainCog className="w-8 h-8 text-[#88AB8E] dark:text-[#88AB8E]" />,
    },
    {
      title: "Blind 75",
      description:
        "The classic collection of 75 essential algorithmic problems.",
      href: "/sheet/blind-75",
      icon: (
        <FolderHeart className="w-8 h-8 text-[#88AB8E] dark:text-[#88AB8E]" />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[85vh] flex flex-col items-center justify-center -mt-8">
        {/* Floating Background Illustrations */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none max-w-300 mx-auto overflow-visible">
          {/* Top Left Area */}
          <Star className="absolute top-[18%] left-[18%] text-amber-400 w-8 h-8 rotate-15 stroke-2 fill-amber-400/20" />
          <Pencil className="absolute top-[22%] left-[28%] text-[#88AB8E] w-7 h-7 -rotate-12 stroke-2" />

          {/* Mid Left Area */}
          <Package className="absolute top-[45%] left-[8%] text-[#88AB8E] w-20 h-20 rotate-6 stroke-[1.5]" />
          <Squiggle className="absolute top-[58%] left-[22%] text-[#88AB8E] -rotate-6" />

          {/* Bottom Left Area */}
          <div className="absolute bottom-[28%] left-[14%] w-3 h-3 rounded-full bg-[#88AB8E]" />
          <DocumentIcon className="absolute bottom-[15%] left-[25%] text-[#88AB8E] -rotate-12" />
          <Star className="absolute bottom-[12%] left-[38%] text-amber-400 w-5 h-5 -rotate-6 stroke-[2.5]" />

          {/* Top Right Area */}
          <div className="absolute top-[20%] right-[28%] w-3 h-3 rounded-full bg-[#88AB8E]" />
          <Dashes className="absolute top-[18%] right-[10%] text-[#88AB8E] rotate-12 w-10 h-10" />
          <Mail className="absolute top-[32%] right-[15%] text-[#88AB8E] w-20 h-20 rotate-12 stroke-[1.5]" />

          {/* Mid Right Area */}
          <div className="absolute top-[55%] right-[22%] w-2.5 h-2.5 rounded-full bg-[#88AB8E]" />
          <Heart className="absolute top-[50%] right-[8%] text-[#F94144] w-12 h-12 -rotate-12 stroke-2 fill-white dark:fill-[#0B0B0B]" />

          {/* Bottom Right Area */}
          <Mailbox className="absolute bottom-[20%] right-[18%] text-[#88AB8E] w-24 h-24 rotate-6 stroke-[1.5]" />
          <Star className="absolute bottom-[10%] right-[12%] text-amber-400 w-7 h-7 rotate-45 stroke-[2.5]" />
        </div>

        {/* Full-Background Glassmorphic Layer */}
        <div className="absolute inset-0 bg-white/5 dark:bg-white/1 backdrop-blur-[1px] z-5 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-8 md:px-12 py-10 max-w-4xl text-center">
          <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase mb-10 text-neutral-900 dark:text-neutral-200">
            OPENSHEET
          </h2>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif text-neutral-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
            Track DSA practice lists, minus the hassle.
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl leading-relaxed">
            Merge popular problem sheets, get a deduplicated combined view, and
            regain the momentum of your interview prep.
          </p>

          <div className="flex flex-col items-center gap-4">
            {userId ? (
              <Button
                asChild
                className="rounded-full px-10 py-7 text-lg font-medium bg-[#88AB8E] hover:bg-[#6E8E75] text-white transition-all shadow-[0_8px_20px_rgba(136,171,142,0.3)] border-none"
              >
                <Link href="/sheet/striver-a2z">
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="rounded-full px-10 py-7 text-lg font-medium bg-[#88AB8E] hover:bg-[#6E8E75] text-white transition-all shadow-[0_8px_20px_rgba(136,171,142,0.3)] border-none">
                  Start Tracking <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignInButton>
            )}
            <span className="text-sm font-medium italic text-neutral-500 mt-2">
              It's free!
            </span>
          </div>
        </div>
      </section>

      {/* Sheets Grid Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-24 z-10 relative">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-3">
            Get Started
          </p>
          <h3 className="text-3xl font-serif text-neutral-900 dark:text-white">
            Popular Curated Sheets
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheets.map((sheet) => (
            <Link
              key={sheet.href}
              href={sheet.href}
              className="group p-8 rounded-[1.5rem] border border-neutral-200/60 dark:border-white/10 hover:border-[#88AB8E]/50 bg-white/70 dark:bg-[#0B0B0B]/80 backdrop-blur-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:-translate-y-1 content-start"
            >
              <div className="bg-neutral-100 dark:bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {sheet.icon}
              </div>
              <h3 className="text-2xl font-serif font-medium mb-3 text-neutral-900 dark:text-white">
                {sheet.title}
              </h3>
              <p className="text-[15px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {sheet.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
