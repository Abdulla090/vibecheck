import { CheckCircle2, GitBranch, GitCommit, Globe, RefreshCw, Server, ShieldCheck, Terminal, Zap } from "lucide-react";

export default function Home() {
  const currentTimestamp = new Date().toUTCString();

  return (
    <main className="min-h-screen bg-[#090a0f] text-[#f3f4f6] px-6 py-12 md:px-16 lg:px-24">
      {/* Header bar */}
      <header className="max-w-5xl mx-auto flex items-center justify-between border-b border-[#222634] pb-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#141824] border border-[#262c3e] flex items-center justify-center font-bold text-emerald-400 text-lg">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg tracking-tight text-white">VibeCheck</h1>
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live CI/CD
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">Abdulla090/vibecheck</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#11131a] border border-[#222634]">
            <Server className="w-3.5 h-3.5 text-zinc-400" />
            <span>Region: iad1</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#11131a] border border-[#222634] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All Systems Operational</span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="bg-[#11131a] border border-[#222634] rounded-xl p-8 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Automated Vercel & GitHub Deployment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Continuous Delivery Pipeline
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every commit and pull request merged to the <code className="text-zinc-200 bg-[#1c202d] px-1.5 py-0.5 rounded font-mono text-xs">main</code> branch automatically triggers a production build and deploys instantly to the global edge network.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#222634] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Repository</p>
              <p className="text-sm font-medium text-zinc-200 mt-1 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Abdulla090/vibecheck
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Hosting Platform</p>
              <p className="text-sm font-medium text-zinc-200 mt-1 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                Vercel Edge Network
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Sync Mode</p>
              <p className="text-sm font-medium text-zinc-200 mt-1 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                Automatic on Git Push
              </p>
            </div>
          </div>
        </section>

        {/* Pipeline Architecture & Collaborators */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Pipeline Status */}
          <div className="bg-[#11131a] border border-[#222634] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-400" />
                Deployment Workflow
              </h3>
              <span className="text-xs font-mono text-zinc-500">CI/CD Engine</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#0d0f15] border border-[#1d212d] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">1. Git Remote Origin</span>
                </div>
                <span className="text-emerald-400">Connected</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0d0f15] border border-[#1d212d] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">2. Vercel Project Link</span>
                </div>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0d0f15] border border-[#1d212d] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">3. Edge Build & Prune</span>
                </div>
                <span className="text-emerald-400">Healthy</span>
              </div>
            </div>
          </div>

          {/* Squad Integration & Health */}
          <div className="bg-[#11131a] border border-[#222634] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                Squad Collaboration
              </h3>
              <span className="text-xs font-mono text-zinc-500">Multi-Agent</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Squad Alpha and Squad Beta automated merges will immediately build on Vercel without manual deployment steps.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#0d0f15] border border-[#1d212d]">
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Squad Alpha</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-200 font-medium">
                  <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                  Push Ready
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0d0f15] border border-[#1d212d]">
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Squad Beta</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-200 font-medium">
                  <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                  Push Ready
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer className="pt-6 border-t border-[#222634] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>Verified build target: Next.js 15 App Router</div>
          <div>Last checked: {currentTimestamp}</div>
        </footer>
      </div>
    </main>
  );
}
