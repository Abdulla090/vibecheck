"use client";

import React, { useState } from "react";
import PromptScorer from "@/components/PromptScorer";
import VibeCraftPortal from "@/components/VibeCraftPortal";
import { 
  GitBranch, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  Server, 
  Zap, 
  Layers, 
  Users, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scorer" | "portal" | "pipeline">("scorer");

  return (
    <div className="min-h-screen bg-[#10110f] text-[#f2f3ed]">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-[#2e3029] bg-[#10110f]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Cohort status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#bce83e] text-[#101408] font-mono font-extrabold flex items-center justify-center text-sm shadow-[2px_2px_0_#f2f3ed]">
              V
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight font-mono text-[#f2f3ed]">
                VibeCheck
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#141512] border border-[#2e3029] text-[#bce83e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bce83e] animate-pulse" />
                Founding Cohort · 10 Seats
              </span>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("scorer")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                activeTab === "scorer"
                  ? "bg-[#bce83e] text-[#101408] border-[#bce83e] shadow-[3px_3px_0_#f2f3ed]"
                  : "bg-transparent text-[#b0b3aa] border-transparent hover:text-[#f2f3ed] hover:border-[#2e3029]"
              }`}
            >
              PromptScorer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("portal")}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                activeTab === "portal"
                  ? "bg-[#bce83e] text-[#101408] border-[#bce83e] shadow-[3px_3px_0_#f2f3ed]"
                  : "bg-transparent text-[#b0b3aa] border-transparent hover:text-[#f2f3ed] hover:border-[#2e3029]"
              }`}
            >
              DAO Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pipeline")}
              className={`hidden md:inline-flex px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                activeTab === "pipeline"
                  ? "bg-[#bce83e] text-[#101408] border-[#bce83e] shadow-[3px_3px_0_#f2f3ed]"
                  : "bg-transparent text-[#b0b3aa] border-transparent hover:text-[#f2f3ed] hover:border-[#2e3029]"
              }`}
            >
              CI/CD
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* TAB 1: PromptScorer (Interactive Evaluation Tool) */}
        {activeTab === "scorer" && (
          <div className="space-y-12">
            <PromptScorer />

            {/* Quick Banner to DAO Portal */}
            <div className="p-6 bg-[#191a17] border-2 border-[#2e3029] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-[#f2f3ed] font-mono">
                  Ready to test your prompt in the 30-Day Sprint?
                </h4>
                <p className="text-xs text-[#b0b3aa] font-mono mt-0.5">
                  Squad A (Product) and Squad B (Launch) are now accepting 4-hour micro-task submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("portal")}
                className="px-4 py-2 bg-[#f2f3ed] text-[#10110f] border border-[#f2f3ed] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#bce83e] transition-all"
              >
                View 30-Day Launch Roadmap →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: VibeCraft DAO Launch Portal */}
        {activeTab === "portal" && (
          <VibeCraftPortal onOpenScorer={() => setActiveTab("scorer")} />
        )}

        {/* TAB 3: CI/CD Pipeline Dashboard */}
        {activeTab === "pipeline" && (
          <div className="space-y-8">
            <div className="border-b border-[#2e3029] pb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[#f2f3ed]">
                Automated CI/CD Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-[#b0b3aa] font-mono mt-1">
                Continuous integration connected to GitHub &amp; Vercel edge deployment infrastructure
              </p>
            </div>

            {/* Pipeline Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#191a17] border-2 border-[#2e3029] space-y-3">
                <span className="text-xs font-mono text-[#b0b3aa] uppercase">Git Provider</span>
                <h3 className="text-lg font-bold font-mono text-[#f2f3ed] flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#bce83e]" />
                  Abdulla090/vibecheck
                </h3>
                <p className="text-xs text-[#b0b3aa] font-mono">
                  Tracked branch: <code className="text-[#f2f3ed]">main</code>
                </p>
                <div className="pt-2">
                  <a
                    href="https://github.com/Abdulla090/vibecheck"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#38bdf8] hover:underline"
                  >
                    Open GitHub Repo <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-6 bg-[#191a17] border-2 border-[#2e3029] space-y-3">
                <span className="text-xs font-mono text-[#b0b3aa] uppercase">Edge Hosting</span>
                <h3 className="text-lg font-bold font-mono text-[#f2f3ed] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#38bdf8]" />
                  Vercel Edge Network
                </h3>
                <p className="text-xs text-[#b0b3aa] font-mono">
                  Framework: Next.js 15 App Router
                </p>
                <div className="pt-2">
                  <a
                    href="https://vibecheck-gamma-nine.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#bce83e] hover:underline"
                  >
                    Open Live Deployment <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-6 bg-[#191a17] border-2 border-[#2e3029] space-y-3">
                <span className="text-xs font-mono text-[#b0b3aa] uppercase">Squad Dispatch</span>
                <h3 className="text-lg font-bold font-mono text-[#f2f3ed] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ff7055]" />
                  Auto-deploy on Push
                </h3>
                <p className="text-xs text-[#b0b3aa] font-mono">
                  Squad Alpha &amp; Squad Beta pull requests build instantly on merge.
                </p>
                <div className="pt-2 text-xs font-mono text-[#bce83e] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CI/CD Active
                </div>
              </div>
            </div>

            {/* Terminal Log Preview */}
            <div className="p-6 bg-[#0b0c0a] border-2 border-[#2e3029] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#b0b3aa] border-b border-[#2e3029] pb-3">
                <span className="flex items-center gap-2 text-[#f2f3ed]">
                  <Terminal className="w-4 h-4 text-[#bce83e]" />
                  Latest Verification Log
                </span>
                <span className="text-emerald-400">READY</span>
              </div>
              <pre className="text-[#e9ecdf] leading-relaxed overflow-x-auto">
{`▲ Next.js 15.5.26 production build
✓ Compiled successfully in 5.4s
✓ Prerendered static pages (4/4)
✓ Edge distribution: Washington, D.C., USA (iad1)
✓ Production alias: https://vibecheck-gamma-nine.vercel.app
✓ Attestation anchor: Base L2 (8453)`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2e3029] py-8 mt-16 bg-[#0b0c0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#b0b3aa]">
          <div>VibeCheck · Launch cycle 01 · Powered by Muse Spark &amp; META Muse</div>
          <div>Build small. Test early. Ship the proof.</div>
        </div>
      </footer>
    </div>
  );
}
