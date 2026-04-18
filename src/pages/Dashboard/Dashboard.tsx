import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { getProfile } from "../../features/profileSlice";

const tiers = [
  { name: "NOVICE", xp: 100, regs: 100, icon: "🌱", color: "from-violet-500 to-purple-600" },
  { name: "RISING", xp: 500, regs: 1000, icon: "🔒", color: "from-blue-500 to-cyan-500" },
  { name: "ELITE", xp: 1000, regs: 10000, icon: "🔒", color: "from-cyan-500 to-teal-500" },
  { name: "LEGEND", xp: 10000, regs: 50000, icon: "🔒", color: "from-amber-500 to-orange-500" },
  { name: "MYTHIC", xp: 50000, regs: 100000, icon: "🔒", color: "from-rose-500 to-pink-600" },
];

const payments = [
  { method: "Bank Transfer", date: "11 Apr 2026, 05:56 PM", amount: "₹1,00,00,000", status: "PAID" },
  { method: "Bank Transfer", date: "Pending", amount: "₹0", status: "PENDING" },
];

const quickActions = [
  { label: "Registration Path", icon: "📋", color: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20" },
  { label: "Subscription Path", icon: "💎", color: "bg-cyan-500/10 text-cyan-400", border: "border-cyan-500/20" },
  { label: "Share Referral Link", icon: "🔗", color: "bg-green-500/10 text-green-400", border: "border-green-500/20" },
  { label: "Update Bank Details", icon: "🏦", color: "bg-amber-500/10 text-amber-400", border: "border-amber-500/20" },
];

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: "purple" | "cyan" | "green" | "gold" }) {
  const accents = {
    purple: "text-violet-400",
    cyan: "text-cyan-400",
    green: "text-emerald-400",
    gold: "text-amber-400",
  };
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-1">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">{label}</p>
      <p className={`text-3xl font-semibold ${accents[accent]}`}>{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function MilestonePath({ current, total }: { current: number; total: number }) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-violet-500" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Milestone Progress</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">Registration path · Level 1 of 5</p>

      <div className="relative flex items-center justify-between mb-2">
        {tiers.map((t, i) => (
          <div key={t.name} className="flex flex-col items-center z-10" style={{ width: 48 }}>
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${
                i === 0
                  ? "border-violet-500 bg-violet-500/20 shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                  : "border-white/10 bg-[#0d1117] text-slate-600"
              }`}
            >
              {i === 0 ? "🌱" : "🔒"}
            </div>
          </div>
        ))}
        <div className="absolute top-[22px] left-6 right-6 h-[2px] bg-white/[0.06] -z-0">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        {tiers.map((t, i) => (
          <div key={t.name} className="flex flex-col items-center" style={{ width: 48 }}>
            <p className={`text-[9px] font-semibold tracking-wider ${i === 0 ? "text-violet-400" : "text-slate-600"}`}>
              {t.name}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{current} / {total} registrations</span>
          <span className="text-violet-400">+100 XP reward</span>
        </div>
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-1.5">{total - current} more referrals to reach Rising</p>
      </div>
    </div>
  );
}

function ReferralPanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Your Referral</p>
      </div>
      <div className="bg-violet-500/[0.08] border border-violet-500/20 rounded-lg p-3.5 flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Referral code</p>
          <p className="text-lg font-semibold text-violet-400 tracking-widest">{code}</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-md px-3 py-1.5 transition-all duration-200 cursor-pointer"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white/[0.03] rounded-lg p-3 text-center">
          <p className="text-xl font-semibold text-violet-400">4</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Clicks converted</p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3 text-center">
          <p className="text-xl font-semibold text-cyan-400">0</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Subscriptions</p>
        </div>
      </div>
    </div>
  );
}

function PaymentHistory() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Payment History</p>
      </div>
      <div className="space-y-0">
        {payments.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0"
          >
            <div>
              <p className="text-xs font-medium text-slate-300">{p.method}</p>
              <p className="text-[10px] text-slate-600">{p.date}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">{p.amount}</p>
            </div>
            <span
              className={`text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                p.status === "PAID"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 mt-2">Last paid: 11 Apr 2026</p>
    </div>
  );
}

function TierRewards() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tier Rewards</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tiers.map((t, i) => (
          <span
            key={t.name}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
              i === 0
                ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
                : "bg-white/[0.03] text-slate-600 border-white/[0.06]"
            }`}
          >
            {t.name} · +{t.xp.toLocaleString()} XP
          </span>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 mt-4 leading-relaxed">
        Complete milestones on both Registration and Subscription paths to unlock rewards.
      </p>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quick Actions</p>
      </div>
      <div className="space-y-2">
        {quickActions.map((a) => (
          <button
            key={a.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border ${a.border} ${a.color} bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-150 cursor-pointer text-left`}
          >
            <span className="text-base">{a.icon}</span>
            <span className="text-xs font-medium">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("registration");
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getProfile());
  }, []);
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {/* Subtle grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-base shadow-[0_0_20px_rgba(139,92,246,0.35)]">
              ✦
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-none">Milestone Journey</h1>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-0.5">Progress · Unlock · Conquer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs bg-violet-500/10 border border-violet-500/25 text-violet-400 px-3 py-1.5 rounded-full font-medium">
              Level 1 — Novice
            </div>
            <div className="flex items-center gap-2 bg-[#161b22] border border-white/[0.07] rounded-full px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold">
                AK
              </div>
              <span className="text-xs text-slate-300">Arjit Kumar</span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-6 bg-[#161b22] border border-white/[0.07] rounded-xl px-5 py-3 flex items-center gap-4">
          <span className="text-xs text-slate-500 whitespace-nowrap">Level 1 — 4 XP</span>
          <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400"
              style={{ width: "4%" }}
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">100 XP</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Registrations" value="4" sub="+2 this week" accent="purple" />
          <StatCard label="Total Subscriptions" value="0" sub="0 this week" accent="cyan" />
          <StatCard label="Total Earnings" value="₹0" sub="Awaiting conversions" accent="green" />
          <StatCard label="Current XP" value="4" sub="96 to next milestone" accent="gold" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {["registration", "subscription"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                activeTab === tab
                  ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                  : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "registration" ? "📋" : "💎"} {tab} Path
            </button>
          ))}
        </div>

        {/* Mid section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <MilestonePath current={4} total={100} />
          <ReferralPanel code="AR9NN@10" />
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-3 gap-4">
          <PaymentHistory />
          <TierRewards />
          <QuickActions />
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-700 mt-6 tracking-wider">
          MILESTONE JOURNEY · arjit.dailytrades@gmail.com · 7060955045
        </p>
      </div>
    </div>
  );
}

