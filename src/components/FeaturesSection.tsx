"use client";

import React from "react";
import { Sparkles, Merge } from "lucide-react";
import { motion } from "framer-motion";



const FeatureCard = ({
  title,
  description,
  graphic,
  index,
}: {
  title: string;
  description: string;
  graphic: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col items-start p-8 rounded-3xl bg-card dark:bg-[#030303] border border-border dark:border-white/10 hover:border-[#88AB8E]/50 transition-all duration-500 overflow-hidden h-full shadow-[0_0_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)]"
    >
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#88AB8E]/5 blur-[100px] group-hover:bg-[#88AB8E]/10 transition-colors duration-500" />
      
      {/* Graphic Container */}
      <div className="relative w-full aspect-4/3 mb-8 rounded-xl bg-linear-to-b from-foreground/5 to-transparent border border-foreground/5 flex items-center justify-center overflow-hidden">
        {graphic}
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-foreground dark:text-white mb-3 group-hover:text-[#88AB8E] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// --- Custom SVG Graphics ---

const MergingGraphic = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4">
    {/* Source List 1 - Striver */}
    <div className="absolute left-[8%] top-[25%] flex flex-col gap-1.5 w-[30%] opacity-40 scale-75 group-hover:scale-90 group-hover:opacity-60 transition-all duration-700">
       <div className="text-[9px] font-black text-foreground/50 mb-1 uppercase tracking-widest italic">Striver</div>
       {[...Array(3)].map((_, i) => (
         <div key={i} className="h-2.5 w-full bg-foreground/10 rounded-sm border border-foreground/5" />
       ))}
    </div>

    {/* Source List 2 - Babbar */}
    <div className="absolute right-[8%] top-[25%] flex flex-col gap-1.5 w-[30%] opacity-40 scale-75 group-hover:scale-90 group-hover:opacity-60 transition-all duration-700">
       <div className="text-[9px] font-black text-foreground/50 mb-1 uppercase tracking-widest italic text-right">Babbar</div>
       {[...Array(3)].map((_, i) => (
         <div key={i} className="h-2.5 w-full bg-foreground/10 rounded-sm border border-foreground/5" />
       ))}
    </div>

    {/* Merging Flow (SVG Paths) */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
       {/* Left Path */}
       <path 
         d="M 90 100 Q 120 160 180 160" 
         fill="none" 
         stroke="rgba(136,171,142,0.3)" 
         strokeWidth="1.5" 
         strokeDasharray="4 4" 
         className="animate-[dash_8s_linear_infinite]"
       />
       {/* Right Path */}
       <path 
         d="M 290 100 Q 260 160 200 160" 
         fill="none" 
         stroke="rgba(136,171,142,0.3)" 
         strokeWidth="1.5" 
         strokeDasharray="4 4" 
         className="animate-[dash_8s_linear_infinite]"
       />
       {/* Bottom Path */}
       <path 
         d="M 190 200 L 190 240" 
         fill="none" 
         stroke="rgba(136,171,142,0.4)" 
         strokeWidth="2" 
         strokeDasharray="6 3"
       />
    </svg>

    {/* Unified Center List */}
    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[55%] h-[45%] rounded-2xl border border-[#88AB8E]/40 bg-card shadow-[0_0_50px_rgba(136,171,142,0.1)] dark:shadow-[0_0_50px_rgba(136,171,142,0.2)] p-4 z-10 transform group-hover:translate-y-2 transition-all duration-700 flex flex-col gap-2.5">
       <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
          <div className="flex items-center gap-1.5">
             <Merge className="w-3 h-3 text-[#88AB8E]" />
             <span className="text-[10px] font-bold text-foreground tracking-tight uppercase tracking-widest">Unified</span>
          </div>
          <div className="px-1.5 py-0.5 rounded bg-[#88AB8E]/20 text-[6px] text-[#88AB8E] font-black uppercase tracking-tighter shadow-sm">Deduplicated</div>
       </div>
       
       <div className="space-y-2 overflow-hidden">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#88AB8E]/30" />
                <div className="h-1.5 w-full bg-[#88AB8E]/10 rounded-sm" />
             </div>
          ))}
       </div>
    </div>

    {/* Decorative Info Pills */}
    <div className="absolute bottom-[8%] left-[10%] px-2 py-1 bg-foreground/5 border border-foreground/5 rounded-full text-[8px] font-bold text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
       75 Unique Problems
    </div>
    <div className="absolute bottom-[8%] right-[10%] px-2 py-1 bg-[#88AB8E]/10 border border-[#88AB8E]/20 rounded-full text-[8px] font-bold text-[#88AB8E] opacity-60 group-hover:opacity-100 transition-opacity">
       21 Duplicates Handled
    </div>
  </div>
);




const HeatmapGraphic = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }).map((_, i) => {
          const intensities = ['bg-foreground/5', 'bg-[#88AB8E]/20', 'bg-[#88AB8E]/40', 'bg-[#88AB8E]/60', 'bg-[#88AB8E]/80', 'bg-[#88AB8E]'];
          const intensity = i > 12 && i < 22 ? intensities[(i % 3) + 3] : intensities[i % 2];
          return (
            <div 
              key={i} 
              className={`w-6 h-6 rounded-sm border border-foreground/5 transition-all duration-700 ${intensity}`}
            />
          );
        })}
      </div>
      
      {/* Dynamic Streak Info */}
      <div className="absolute top-[15%] right-[10%] group-hover:scale-110 transition-transform duration-500">
        <div className="bg-card/90 backdrop-blur-md border border-[#88AB8E]/30 rounded-full py-2 px-4 flex items-center gap-2 shadow-[0_0_20px_rgba(136,171,142,0.1)] dark:shadow-[0_0_20px_rgba(136,171,142,0.2)]">
          <div className="relative shrink-0">
             <div className="w-3 h-3 bg-orange-500 blur-sm animate-pulse rounded-full" />
             <div className="absolute inset-0 flex items-center justify-center text-[10px]">🔥</div>
          </div>
          <span className="text-[12px] font-black text-foreground pr-1">15</span>
          <span className="text-[8px] font-bold text-[#88AB8E] uppercase tracking-tighter">Day Streak</span>
        </div>
      </div>

      <div className="absolute bottom-[10%] left-[10%] opacity-60 group-hover:opacity-100 transition-opacity duration-500">
         <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
            <div className="w-2 h-2 rounded-full border border-foreground/20" />
            <span>March Activity</span>
         </div>
      </div>
    </div>
);


const StudioGraphic = () => (
  <div className="relative w-full h-full flex items-center justify-center p-6">
    {/* actual Dialog-like Container */}
    <div className="relative w-[85%] h-[85%] rounded-[1.8rem] border border-border dark:border-white/10 bg-card dark:bg-neutral-900 shadow-2xl p-5 overflow-hidden flex flex-col gap-4 transform group-hover:scale-105 transition-transform duration-700">
      {/* Soft Decorative Gradient (Matches Actual Dialog) */}
      <div className="absolute inset-0 bg-linear-to-br from-[#88AB8E]/10 via-transparent to-[#AFC8AD]/5 pointer-events-none" />
      
      {/* Header (Matches Actual Dialog) */}
      <div className="relative z-10 flex flex-col gap-1 pr-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#88AB8E]" />
          <div className="text-[13px] font-bold text-foreground leading-tight">Sheet Studio</div>
        </div>
        <div className="text-[9px] text-muted-foreground font-medium">Curate your personalized DSA practice sheets.</div>
      </div>

      {/* Topics Mockup (Step 1) */}
      <div className="relative z-10 space-y-3">
        {/* Input area */}
        <div className="p-1.5 rounded-xl border border-border bg-foreground/5 flex flex-wrap gap-1.5 h-10 overflow-hidden">
          {["Arrays", "DP"].map(t => (
            <div key={t} className="flex items-center gap-1 px-2 py-0.5 bg-[#88AB8E] text-white text-[8px] font-bold rounded-lg shadow-sm">
              {t}
            </div>
          ))}
          <div className="h-3 w-10 bg-foreground/5 rounded mt-1.5" />
        </div>

        {/* Popular Topics Quick Action (Matches Actual UI) */}
        <div className="flex flex-wrap gap-1.5">
          {["Trees", "Graphs", "Strings"].map(t => (
            <div key={t} className="text-[7px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-foreground/5 border border-border text-foreground/50">
              + {t}
            </div>
          ))}
        </div>
      </div>

      {/* Target Level & Count (Step 1) */}
      <div className="relative z-10 flex items-center justify-between gap-3 pt-1">
        <div className="flex-1 h-7 bg-foreground/5 border border-border rounded-xl flex items-center justify-around p-1 text-[8px] font-bold">
           <div className="text-muted-foreground">Beg</div>
           <div className="bg-[#88AB8E] text-white px-2 py-0.5 rounded-lg flex-1 text-center">Int</div>
           <div className="text-muted-foreground">Adv</div>
        </div>
        <div className="w-14 h-7 bg-foreground/5 border border-border rounded-xl flex items-center justify-between px-2 text-[8px] font-bold">
           <div className="text-muted-foreground">-</div>
           <div className="text-foreground">15</div>
           <div className="text-muted-foreground">+</div>
        </div>
      </div>

      {/* Generate Button (Matches Actual UI) */}
      <div className="relative z-10 mt-auto">
         <div className="w-full h-10 rounded-xl bg-[#88AB8E] shadow-[0_5px_15px_rgba(136,171,142,0.2)] flex items-center justify-center gap-2 group-hover:bg-[#6E8E75] transition-colors">
            <div className="text-[10px] font-bold text-white">Generate Practice Sheet</div>
            <Sparkles className="w-3 h-3 text-white/80" />
         </div>
      </div>
    </div>

    {/* Floating Elements (Decorative) */}
    <div className="absolute top-[10%] right-[10%] w-12 h-12 bg-[#88AB8E]/5 blur-2xl rounded-full" />
    <div className="absolute bottom-[10%] left-[10%] w-16 h-16 bg-[#88AB8E]/5 blur-3xl rounded-full" />
  </div>
);




export default function FeaturesSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20">
          <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase mb-4 text-[#88AB8E]">
            THE EXPERIENCE
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-foreground dark:text-white max-w-2xl leading-tight">
            Designed for those who take interview prep seriously.
          </h3>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard 
            index={0}
            title="Smart Sheet Merging"
            description="Automatically combine and deduplicate popular DSA sheets like Striver, Love Babbar, and Fraz into a single, unified practice list."
            graphic={<MergingGraphic />}
          />
          <FeatureCard 
            index={1}
            title="Activity Heatmaps"
            description="Build a visual legacy of your practice with a 30-day activity heatmap and streaks that keep your momentum alive every single day."
            graphic={<HeatmapGraphic />}
          />
          <FeatureCard 
            index={2}
            title="Custom Sheet Studio"
            description="Build and curate your own DSA playlists. Share your custom-made problem sets with the community and track progress together."
            graphic={<StudioGraphic />}
          />

        </div>
      </div>
    </section>
  );
}
