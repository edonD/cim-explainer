"use client";

import HeroSection from "./components/HeroSection";
import Chapter1 from "./components/chapters/Chapter1";
import Chapter2 from "./components/chapters/Chapter2";
import Chapter3 from "./components/chapters/Chapter3";
import Chapter4 from "./components/chapters/Chapter4";
import Chapter5 from "./components/chapters/Chapter5";
import Chapter6 from "./components/chapters/Chapter6";
import Chapter7 from "./components/chapters/Chapter7";
import Chapter8 from "./components/chapters/Chapter8";
import Chapter9 from "./components/chapters/Chapter9";
import ChapterNav from "./components/ChapterNav";

export default function Home() {
  return (
    <main className="relative">
      <ChapterNav />
      <HeroSection />

      <div className="h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

      <Chapter1 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#10b981]/20 to-transparent" />

      <Chapter2 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

      <Chapter3 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#a855f7]/20 to-transparent" />

      <Chapter4 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#10b981]/20 to-transparent" />

      <Chapter5 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#f59e0b]/20 to-transparent" />

      <Chapter6 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

      <Chapter7 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent" />

      <Chapter8 />

      <div className="h-px bg-gradient-to-r from-transparent via-[#10b981]/20 to-transparent" />

      <Chapter9 />
    </main>
  );
}
