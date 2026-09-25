"use client";

import React, { useState } from "react";
import { Check, Copy, ArrowUpRight, DollarSign, MessageSquare, Clock } from "lucide-react";

interface VibeCraftPortalProps {
  onOpenScorer?: () => void;
}

export default function VibeCraftPortal({ onOpenScorer }: VibeCraftPortalProps) {
  const [filter, setFilter] = useState<"all" | "build" | "launch">("all");
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedApplication, setCopiedApplication] = useState(false);

  // Customizable payment and channel settings
  const [paymentAmount, setPaymentAmount] = useState("$250 USDC");
  const [recruitmentChannel, setRecruitmentChannel] = useState("#vibecraft-trials (Discord / Farcaster)");

  const memoText = `VIBECRAFT DAY 1 MEMO

Mission: reduce the distance between an idea and a useful thing.

Today we will:
1. Lock the user, problem, and 30-day outcome.
2. Agree on squad working rules and decision owners.
3. Confirm access to every tool and workspace.
4. Map the shortest complete VibeCheck user path.
5. Build and demo the first end-to-end slice.

Before leaving: record blockers, decisions, owners, and the first task for tomorrow.`;

  const applicationTemplate = `NAME / HANDLE:
THE ROLE I CAN OWN:
BEST THING I HAVE SHIPPED: [link]
MY 30-DAY AVAILABILITY:
TRIAL TASK LINK: [link]
TARGET PAYMENT: ${paymentAmount}
RECRUITMENT CHANNEL: ${recruitmentChannel}`;

  const copyText = (text: string, type: "memo" | "app") => {
    navigator.clipboard.writeText(text);
    if (type === "memo") {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    } else {
      setCopiedApplication(true);
      setTimeout(() => setCopiedApplication(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-16">
      {/* Hero Section */}
      <section className="pt-6 pb-12 border-b border-[#f2f3ed]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#b0b3aa] mb-4">
              Launch cycle 01 / VibeCheck · Powered by Muse Spark &amp; META Muse
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-[#f2f3ed]">
              10 builders.<br />
              <span className="text-[#ff7055]">30 days.</span><br />
              1 launch.
            </h1>
          </div>
          <div className="lg:col-span-4 border-t-4 border-[#f2f3ed] pt-6 space-y-6">
            <p className="text-lg sm:text-xl font-semibold leading-snug text-[#f2f3ed]">
              A focused studio for AI-native makers who turn rough ideas into useful, shipped software.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#trial"
                className="px-4 py-3 bg-[#bce83e] text-[#101408] font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#f2f3ed] shadow-[4px_4px_0_#f2f3ed] hover:shadow-[6px_6px_0_#f2f3ed] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Take the paid trial
              </a>
              <button
                type="button"
                onClick={onOpenScorer}
                className="px-4 py-3 bg-[#191a17] text-[#f2f3ed] font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#f2f3ed] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Test PromptScorer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scoreboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#f2f3ed]">
        <div className="p-6 sm:p-8 border-r border-[#2e3029] border-b md:border-b-0">
          <strong className="block text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-[#f2f3ed]">
            02
          </strong>
          <span className="block mt-2 text-xs font-mono font-medium uppercase tracking-wider text-[#b0b3aa]">
            Balanced squads
          </span>
        </div>
        <div className="p-6 sm:p-8 md:border-r border-[#2e3029] border-b md:border-b-0">
          <strong className="block text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-[#f2f3ed]">
            05
          </strong>
          <span className="block mt-2 text-xs font-mono font-medium uppercase tracking-wider text-[#b0b3aa]">
            Builders per squad
          </span>
        </div>
        <div className="p-6 sm:p-8 border-r border-[#2e3029]">
          <strong className="block text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-[#f2f3ed]">
            30
          </strong>
          <span className="block mt-2 text-xs font-mono font-medium uppercase tracking-wider text-[#b0b3aa]">
            Days to launch
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <strong className="block text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-[#bce83e]">
            01
          </strong>
          <span className="block mt-2 text-xs font-mono font-medium uppercase tracking-wider text-[#b0b3aa]">
            Product to launch
          </span>
        </div>
      </div>

      {/* Section 01: The Crew (Squad A & B) */}
      <section id="teams" className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <p className="md:col-span-3 text-xs font-mono font-semibold text-[#b0b3aa] uppercase">
            01 / THE CREW
          </p>
          <div className="md:col-span-9 space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f2f3ed]">
              Small squads. Clear ownership.
            </h2>
            <p className="text-base sm:text-lg text-[#b0b3aa]">
              Each group carries a complete slice of the product. Nobody waits for a handoff to start building.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Squad A */}
          <article className="p-7 bg-[#191a17] border-2 border-[#f2f3ed] shadow-[7px_7px_0_#bce83e] space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#bce83e] font-semibold">
              Squad A · Product
            </span>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[#f2f3ed]">Make it useful</h3>
              <p className="text-sm text-[#b0b3aa] mt-1">
                Own the core experience, prompt evaluation logic, and feedback loop.
              </p>
            </div>
            <ul className="divide-y divide-[#2e3029] border-t border-[#2e3029] text-sm">
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Product builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">scope + flow</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">AI engineer</b>
                <span className="font-mono text-xs text-[#b0b3aa]">prompts + evals</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Frontend builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">interface</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">QA builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">edge cases</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Growth builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">activation</span>
              </li>
            </ul>
          </article>

          {/* Squad B */}
          <article className="p-7 bg-[#191a17] border-2 border-[#f2f3ed] border-t-8 border-t-[#ff7055] space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7055] font-semibold">
              Squad B · Launch
            </span>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[#f2f3ed]">Make it matter</h3>
              <p className="text-sm text-[#b0b3aa] mt-1">
                Own the public story, launch systems, operations, and distribution.
              </p>
            </div>
            <ul className="divide-y divide-[#2e3029] border-t border-[#2e3029] text-sm">
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Brand builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">voice + identity</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Web builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">launch surface</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Automation builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">ops + tools</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Community builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">feedback + support</span>
              </li>
              <li className="py-3 flex justify-between items-baseline">
                <b className="text-[#f2f3ed]">Content builder</b>
                <span className="font-mono text-xs text-[#b0b3aa]">demos + proof</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Section 02: 30-Day Sprint Roadmap */}
      <section id="sprint" className="space-y-8 pt-8 border-t border-[#2e3029]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <p className="md:col-span-3 text-xs font-mono font-semibold text-[#b0b3aa] uppercase">
            02 / 30-DAY SPRINT
          </p>
          <div className="md:col-span-9 space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f2f3ed]">
              From a blank repo to real users.
            </h2>
            <p className="text-base sm:text-lg text-[#b0b3aa]">
              Four phases, one measurable output each. Filter the roadmap to focus on the work in front of you.
            </p>
          </div>
        </div>

        {/* Roadmap Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 border font-mono text-xs font-semibold uppercase transition-all ${
              filter === "all"
                ? "bg-[#f2f3ed] text-[#10110f] border-[#f2f3ed]"
                : "bg-transparent text-[#f2f3ed] border-[#2e3029] hover:border-[#b0b3aa]"
            }`}
          >
            All 30 days
          </button>
          <button
            type="button"
            onClick={() => setFilter("build")}
            className={`px-4 py-2 border font-mono text-xs font-semibold uppercase transition-all ${
              filter === "build"
                ? "bg-[#f2f3ed] text-[#10110f] border-[#f2f3ed]"
                : "bg-transparent text-[#f2f3ed] border-[#2e3029] hover:border-[#b0b3aa]"
            }`}
          >
            Build only
          </button>
          <button
            type="button"
            onClick={() => setFilter("launch")}
            className={`px-4 py-2 border font-mono text-xs font-semibold uppercase transition-all ${
              filter === "launch"
                ? "bg-[#f2f3ed] text-[#10110f] border-[#f2f3ed]"
                : "bg-transparent text-[#f2f3ed] border-[#2e3029] hover:border-[#b0b3aa]"
            }`}
          >
            Launch only
          </button>
        </div>

        {/* Phase Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[#2e3029] bg-[#191a17]">
          {/* Phase 1 */}
          {(filter === "all" || filter === "build") && (
            <article className="p-6 border-b lg:border-b-0 lg:border-r border-[#2e3029] space-y-4">
              <small className="text-xs font-mono font-semibold uppercase text-[#b0b3aa]">
                Days 01–03
              </small>
              <h3 className="text-xl font-bold text-[#f2f3ed]">Form</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#d9dcd2]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Select 10 builders through the trial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Assign one owner to every outcome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Lock the problem, user, and success signal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Set daily demo and decision rhythm.</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-dashed border-[#2e3029] text-[11px] font-mono font-semibold text-[#bce83e]">
                OUTPUT → crew + one-page product brief
              </div>
            </article>
          )}

          {/* Phase 2 */}
          {(filter === "all" || filter === "build") && (
            <article className="p-6 border-b lg:border-b-0 lg:border-r border-[#2e3029] space-y-4">
              <small className="text-xs font-mono font-semibold uppercase text-[#b0b3aa]">
                Days 04–12
              </small>
              <h3 className="text-xl font-bold text-[#f2f3ed]">Prototype</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#d9dcd2]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Map the smallest complete user flow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Build VibeCheck’s working core.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Test prompts against a shared eval set.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Run five observed user sessions.</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-dashed border-[#2e3029] text-[11px] font-mono font-semibold text-[#bce83e]">
                OUTPUT → testable end-to-end alpha
              </div>
            </article>
          )}

          {/* Phase 3 */}
          {(filter === "all" || filter === "build") && (
            <article className="p-6 border-b md:border-b-0 lg:border-r border-[#2e3029] space-y-4">
              <small className="text-xs font-mono font-semibold uppercase text-[#b0b3aa]">
                Days 13–21
              </small>
              <h3 className="text-xl font-bold text-[#f2f3ed]">Harden</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#d9dcd2]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Fix the top failure modes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Cut every feature that delays launch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Add onboarding and useful empty states.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Prepare support and incident notes.</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-dashed border-[#2e3029] text-[11px] font-mono font-semibold text-[#bce83e]">
                OUTPUT → release candidate
              </div>
            </article>
          )}

          {/* Phase 4 */}
          {(filter === "all" || filter === "launch") && (
            <article className="p-6 space-y-4">
              <small className="text-xs font-mono font-semibold uppercase text-[#b0b3aa]">
                Days 22–30
              </small>
              <h3 className="text-xl font-bold text-[#f2f3ed]">Ship</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#d9dcd2]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Record a proof-first product demo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Recruit a 20-person launch circle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Publish, observe, and answer users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff7055] font-mono">↳</span>
                  <span>Write the next seven-day build list.</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-dashed border-[#2e3029] text-[11px] font-mono font-semibold text-[#ff7055]">
                OUTPUT → live launch + evidence
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Section 03: Entry Trial with Scoring Rubric */}
      <section id="trial" className="space-y-8 pt-8 border-t border-[#2e3029]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <p className="md:col-span-3 text-xs font-mono font-semibold text-[#b0b3aa] uppercase">
            03 / ENTRY TRIAL
          </p>
          <div className="md:col-span-9 space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f2f3ed]">
              Show the work, not the résumé.
            </h2>
            <p className="text-base sm:text-lg text-[#b0b3aa]">
              The founding cohort is selected through one small, paid build. Use any stack. Make your thinking visible.
            </p>
          </div>
        </div>

        {/* Trial Parameter Lock-In Bar */}
        <div className="p-4 bg-[#141512] border-2 border-[#bce83e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#bce83e]">
              <DollarSign className="w-4 h-4" />
              <span>Trial Compensation:</span>
              <input
                type="text"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="bg-[#0b0c0a] border border-[#2e3029] px-2 py-1 text-white font-bold w-28 focus:outline-none focus:border-[#bce83e]"
              />
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MessageSquare className="w-4 h-4 text-[#38bdf8]" />
              <span>Recruitment Channel:</span>
              <input
                type="text"
                value={recruitmentChannel}
                onChange={(e) => setRecruitmentChannel(e.target.value)}
                className="bg-[#0b0c0a] border border-[#2e3029] px-2 py-1 text-white w-64 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>
          <span className="text-[11px] text-[#b0b3aa] uppercase tracking-wider">
            ✓ Parameters Locked
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Brief Card */}
          <article className="lg:col-span-7 p-6 sm:p-10 bg-[#0b0c0a] border-2 border-[#2e3029] text-[#e9ecdf] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase text-[#bce83e]">
                    Micro-task 01
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#f2f3ed] mt-1">
                    Turn one messy idea into a working product slice.
                  </h3>
                </div>
                <span className="shrink-0 px-2.5 py-1 border border-[#55584f] text-[11px] font-mono text-[#ced1c7] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  4 HOURS
                </span>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-[#d9dcd2] leading-relaxed pt-2">
                <li>Choose a workflow you repeat every week.</li>
                <li>Find the slowest or most frustrating step.</li>
                <li>Build a tiny AI-assisted fix that completes that step.</li>
                <li>Record a 60–90 second walkthrough: problem, build, result.</li>
              </ol>
            </div>

            <div className="p-4 border border-[#55584f] bg-[#141612] text-xs font-mono leading-relaxed text-[#d9dcd2]">
              DELIVER → live link or runnable repo<br />
              + short demo walkthrough<br />
              + 5 sentences on trade-offs
            </div>
          </article>

          {/* Rubric Aside */}
          <aside className="lg:col-span-5 p-6 sm:p-8 bg-[#191a17] border-2 border-[#f2f3ed] space-y-6">
            <h3 className="text-xl font-bold text-[#f2f3ed]">How it is judged</h3>
            <div className="divide-y divide-[#2e3029] border-t-2 border-[#f2f3ed] text-sm">
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-[#ff7055]">01</span>
                  <b className="text-[#f2f3ed]">Useful</b>
                </div>
                <span className="font-mono font-bold text-sm text-[#f2f3ed]">30%</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-[#ff7055]">02</span>
                  <b className="text-[#f2f3ed]">Actually works</b>
                </div>
                <span className="font-mono font-bold text-sm text-[#f2f3ed]">30%</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-[#ff7055]">03</span>
                  <b className="text-[#f2f3ed]">Clear decisions</b>
                </div>
                <span className="font-mono font-bold text-sm text-[#f2f3ed]">20%</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-[#ff7055]">04</span>
                  <b className="text-[#f2f3ed]">Finish quality</b>
                </div>
                <span className="font-mono font-bold text-sm text-[#f2f3ed]">20%</span>
              </div>
            </div>
            <p className="text-xs text-[#b0b3aa] leading-relaxed pt-2">
              No points for framework choice or polished pitch decks. Micro-task payouts ({paymentAmount}) are disbursed upon verified submission in {recruitmentChannel}.
            </p>
          </aside>
        </div>
      </section>

      {/* Section 04: Day One Onboarding */}
      <section id="onboarding" className="space-y-8 pt-8 border-t border-[#2e3029]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <p className="text-xs font-mono font-semibold text-[#b0b3aa] uppercase">
              04 / DAY ONE
            </p>
            <blockquote className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f2f3ed] leading-snug">
              “We are here to reduce the distance between an idea and a useful thing.”
            </blockquote>
            <p className="text-sm text-[#b0b3aa] leading-relaxed">
              Day 1 is for decisions, access, and a first visible build. Every person leaves with an owner, a deadline, and a next action.
            </p>
            <button
              type="button"
              onClick={() => copyText(memoText, "memo")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#191a17] text-[#f2f3ed] border-2 border-[#f2f3ed] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#252822] transition-all"
            >
              {copiedMemo ? <Check className="w-3.5 h-3.5 text-[#bce83e]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedMemo ? "Copied Onboarding Memo" : "Copy Onboarding Memo"}
            </button>
          </div>

          <div className="lg:col-span-7 border-t-2 border-[#f2f3ed] divide-y divide-[#2e3029]">
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <time className="sm:col-span-3 text-xs font-mono font-semibold text-[#ff7055]">09:00</time>
              <div className="sm:col-span-9 space-y-1">
                <h3 className="text-base font-bold text-[#f2f3ed]">Context, constraints, outcome</h3>
                <p className="text-xs text-[#b0b3aa]">Why VibeCheck exists, who it serves, and what counts as a successful 30-day launch.</p>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <time className="sm:col-span-3 text-xs font-mono font-semibold text-[#ff7055]">09:45</time>
              <div className="sm:col-span-9 space-y-1">
                <h3 className="text-base font-bold text-[#f2f3ed]">Squad contracts</h3>
                <p className="text-xs text-[#b0b3aa]">Choose working hours, response expectations, review windows, and the owner for unresolved decisions.</p>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <time className="sm:col-span-3 text-xs font-mono font-semibold text-[#ff7055]">10:30</time>
              <div className="sm:col-span-9 space-y-1">
                <h3 className="text-base font-bold text-[#f2f3ed]">Access check</h3>
                <p className="text-xs text-[#b0b3aa]">Confirm the repository, design file, task board, product accounts, and demo environment work for everyone.</p>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <time className="sm:col-span-3 text-xs font-mono font-semibold text-[#ff7055]">11:00</time>
              <div className="sm:col-span-9 space-y-1">
                <h3 className="text-base font-bold text-[#f2f3ed]">Map the user path</h3>
                <p className="text-xs text-[#b0b3aa]">Sketch the shortest route from first visit to one completed VibeCheck result.</p>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <time className="sm:col-span-3 text-xs font-mono font-semibold text-[#ff7055]">13:00</time>
              <div className="sm:col-span-9 space-y-1">
                <h3 className="text-base font-bold text-[#f2f3ed]">Build in pairs</h3>
                <p className="text-xs text-[#b0b3aa]">Start the thinnest end-to-end slice. Ask for decisions early; do not wait silently.</p>
              </div>
            </div>
            <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <time className="sm:col-span-3 text-xs font-mono font-semibold text-[#ff7055]">16:30</time>
              <div className="sm:col-span-9 space-y-1">
                <h3 className="text-base font-bold text-[#f2f3ed]">Demo, decide, document</h3>
                <p className="text-xs text-[#b0b3aa]">Show only what runs. Record blockers, decisions, owners, and the first task for tomorrow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Operating Rules */}
      <section id="rules" className="space-y-8 pt-8 border-t border-[#2e3029]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <p className="md:col-span-3 text-xs font-mono font-semibold text-[#b0b3aa] uppercase">
            05 / OPERATING RULES
          </p>
          <div className="md:col-span-9 space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f2f3ed]">
              High autonomy. Hard guardrails.
            </h2>
            <p className="text-base sm:text-lg text-[#b0b3aa]">
              The charter is the baseline. Legal terms, IP assignment, token promises, and compensation agreements require proper review before anyone signs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-2 border-[#f2f3ed] bg-[#191a17]">
          <article className="p-6 border-b sm:border-r border-[#2e3029] space-y-4">
            <span className="text-xs font-mono font-semibold text-[#ff7055]">01</span>
            <h3 className="text-lg font-bold text-[#f2f3ed]">Demo over debate</h3>
            <p className="text-xs text-[#b0b3aa] leading-relaxed">
              A working slice resolves arguments faster than a long thread. Build the smallest proof.
            </p>
          </article>
          <article className="p-6 border-b lg:border-r border-[#2e3029] space-y-4">
            <span className="text-xs font-mono font-semibold text-[#ff7055]">02</span>
            <h3 className="text-lg font-bold text-[#f2f3ed]">One clear owner</h3>
            <p className="text-xs text-[#b0b3aa] leading-relaxed">
              Collaboration is shared. Accountability is not. Every outcome has one named decider.
            </p>
          </article>
          <article className="p-6 border-b sm:border-r lg:border-r-0 border-[#2e3029] space-y-4">
            <span className="text-xs font-mono font-semibold text-[#ff7055]">03</span>
            <h3 className="text-lg font-bold text-[#f2f3ed]">No hidden blockers</h3>
            <p className="text-xs text-[#b0b3aa] leading-relaxed">
              Surface a block the same day. State what happened, what you tried, and the decision you need.
            </p>
          </article>
          <article className="p-6 border-b sm:border-b-0 sm:border-r border-[#2e3029] space-y-4">
            <span className="text-xs font-mono font-semibold text-[#ff7055]">04</span>
            <h3 className="text-lg font-bold text-[#f2f3ed]">Evidence earns scope</h3>
            <p className="text-xs text-[#b0b3aa] leading-relaxed">
              New features enter only when user behavior, tests, or launch data make the case.
            </p>
          </article>
          <article className="p-6 border-b sm:border-b-0 sm:border-r border-[#2e3029] space-y-4">
            <span className="text-xs font-mono font-semibold text-[#ff7055]">05</span>
            <h3 className="text-lg font-bold text-[#f2f3ed]">Safe to challenge</h3>
            <p className="text-xs text-[#b0b3aa] leading-relaxed">
              Critique the work directly. Treat people with respect. Document the decision and move.
            </p>
          </article>
          <article className="p-6 space-y-4">
            <span className="text-xs font-mono font-semibold text-[#ff7055]">06</span>
            <h3 className="text-lg font-bold text-[#f2f3ed]">No surprise commitments</h3>
            <p className="text-xs text-[#b0b3aa] leading-relaxed">
              No person can promise equity, tokens, spend, or legal terms on behalf of the group without approval.
            </p>
          </article>
        </div>
      </section>

      {/* Section 06: Apply / Join */}
      <section id="apply" className="pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#f2f3ed] bg-[#bce83e] text-[#101408] shadow-[8px_8px_0_#f2f3ed]">
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#30381a]">
              FOUNDING COHORT · 10 SEATS
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to build in public?
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#252b14]">
              Copy the application template below, fill it with your real links and trade-off summary, and submit to <strong className="font-bold underline">{recruitmentChannel}</strong>.
            </p>
            <div className="pt-4 flex items-center gap-3 text-xs font-mono font-bold">
              <span className="px-2.5 py-1 bg-[#101408] text-[#bce83e]">Trial Bounty: {paymentAmount}</span>
              <span>Deadline: Day 01 Kickoff</span>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 bg-white/20 border-t-2 lg:border-t-0 lg:border-l-2 border-[#101408] space-y-6 flex flex-col justify-between">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed text-[#141a03] whitespace-pre-wrap select-all">
              {applicationTemplate}
            </pre>
            <div>
              <button
                type="button"
                onClick={() => copyText(applicationTemplate, "app")}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#101408] text-[#f2f3ed] font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
              >
                {copiedApplication ? <Check className="w-4 h-4 text-[#bce83e]" /> : <Copy className="w-4 h-4" />}
                {copiedApplication ? "Copied Application to Clipboard" : "Copy Application Template"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
