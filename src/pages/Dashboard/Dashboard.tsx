import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { getProfile } from "../../features/profileSlice";

const tiers = [
  {
    name: "NOVICE",
    xp: 100,
    regs: 100,
    icon: "🌱",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "RISING",
    xp: 500,
    regs: 1000,
    icon: "🔒",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "ELITE",
    xp: 1000,
    regs: 10000,
    icon: "🔒",
    color: "from-cyan-500 to-teal-500",
  },
  {
    name: "LEGEND",
    xp: 10000,
    regs: 50000,
    icon: "🔒",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "MYTHIC",
    xp: 50000,
    regs: 100000,
    icon: "🔒",
    color: "from-rose-500 to-pink-600",
  },
];

const payments = [
  {
    method: "Bank Transfer",
    date: "11 Apr 2026, 05:56 PM",
    amount: "₹1,00,00,000",
    status: "PAID",
  },
  { method: "Bank Transfer", date: "Pending", amount: "₹0", status: "PENDING" },
];

const quickActions = [
  {
    label: "Registration Path",
    icon: "📋",
    color: "bg-violet-500/10 text-violet-400",
    border: "border-violet-500/20",
  },
  {
    label: "Subscription Path",
    icon: "💎",
    color: "bg-cyan-500/10 text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    label: "Share Referral Link",
    icon: "🔗",
    color: "bg-green-500/10 text-green-400",
    border: "border-green-500/20",
  },
  {
    label: "Update Bank Details",
    icon: "🏦",
    color: "bg-amber-500/10 text-amber-400",
    border: "border-amber-500/20",
  },
];

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "purple" | "cyan" | "green" | "gold";
}) {
  const accents = {
    purple: "text-violet-400",
    cyan: "text-cyan-400",
    green: "text-emerald-400",
    gold: "text-amber-400",
  };
  return (
    <div className="border border-white/[0.07] rounded-xl p-3 sm:p-4 flex flex-col gap-1 bg-white/[0.01]">
      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-medium">
        {label}
      </p>
      <p
        className={`text-xl sm:text-2xl md:text-3xl font-semibold ${accents[accent]}`}
      >
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-slate-500 truncate">{sub}</p>
    </div>
  );
}

function ProfileCard({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="border border-white/[0.07] rounded-xl p-4 sm:p-5 mb-4 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-violet-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Profile
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-shrink-0">
            {data.dp ? (
              <img
                src={data.dp}
                alt={data.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                {data.name?.charAt(0) ?? "U"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                {data.name}
              </h2>
              <div className="flex gap-1">
                {data.isEmailVerified && (
                  <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Email ✓
                  </span>
                )}
                {data.isActive && (
                  <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    ACTIVE
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              {data.email}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {data.mobile}
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto md:ml-auto">
          <div className="flex-1 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-[9px] sm:text-[10px] text-slate-500">
              Your Commission
            </p>
            <p className="text-sm sm:text-base font-bold text-violet-400">
              {data.commissionPer}%
            </p>
          </div>
          <div className="flex-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-[9px] sm:text-[10px] text-slate-500">
              User Commission
            </p>
            <p className="text-sm sm:text-base font-bold text-cyan-400">
              {data.userCommissionPer}%
            </p>
          </div>
        </div>
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
    <div className="border border-white/[0.07] rounded-xl p-4 sm:p-5 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Your Referral
        </p>
      </div>
      <div className="bg-violet-500/[0.08] border border-violet-500/20 rounded-lg p-3 sm:p-3.5 flex items-center justify-between mb-4">
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 mb-0.5">Referral code</p>
          <p className="text-base sm:text-lg font-semibold text-violet-400 tracking-widest truncate">
            {code}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 text-[11px] text-slate-400 bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-md px-3 py-1.5 transition-all cursor-pointer"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white/[0.03] rounded-lg p-2.5 sm:p-3 text-center">
          <p className="text-lg sm:text-xl font-semibold text-violet-400">4</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
            Clicks converted
          </p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2.5 sm:p-3 text-center">
          <p className="text-lg sm:text-xl font-semibold text-cyan-400">0</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
            Subscriptions
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentHistory() {
  return (
    <div className="border border-white/[0.07] rounded-xl p-4 sm:p-5 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Payment History
        </p>
      </div>
      <div className="space-y-0">
        {payments.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0 gap-2"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">
                {p.method}
              </p>
              <p className="text-[10px] text-slate-600">{p.date}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs font-semibold text-slate-200">{p.amount}</p>
              <span
                className={`text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${p.status === "PAID" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 mt-3">Last paid: 11 Apr 2026</p>
    </div>
  );
}

function TierRewards() {
  return (
    <div className="border border-white/[0.07] rounded-xl p-4 sm:p-5 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Tier Rewards
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tiers.map((t, i) => (
          <span
            key={t.name}
            className={`text-[9px] sm:text-[10px] font-semibold px-2.5 py-1 rounded-full border ${i === 0 ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : "bg-white/[0.03] text-slate-600 border-white/[0.06]"}`}
          >
            {t.name} · +{t.xp.toLocaleString()} XP
          </span>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 mt-4 leading-relaxed">
        Complete milestones on both Registration and Subscription paths to
        unlock rewards.
      </p>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="border border-white/[0.07] rounded-xl p-4 sm:p-5 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Quick Actions
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {quickActions.map((a) => (
          <button
            key={a.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border ${a.border} ${a.color} bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer text-left`}
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
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const memberSince = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen  text-white font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Subtle grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs - Responsive sizes */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(139,92,246,0.35)]">
              ✦
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-full pl-1.5 pr-3 py-1.5">
            {data?.dp ? (
              <img
                src={data.dp}
                alt=""
                className="w-6 h-6 rounded-full object-cover border border-violet-500/30"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold">
                {getInitials(data?.name ?? "")}
              </div>
            )}
            <span className="text-xs font-medium text-slate-300 max-w-[100px] truncate">
              {data?.name}
            </span>
          </div>
        </div>

        <ProfileCard data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Total Registrations"
              value="4"
              sub="+2 this week"
              accent="purple"
            />
            <StatCard
              label="Total Subscriptions"
              value="0"
              sub="0 this week"
              accent="cyan"
            />
            <StatCard
              label="Total Earnings"
              value="₹0"
              sub="Awaiting conversions"
              accent="green"
            />
            <StatCard
              label="Current XP"
              value="4"
              sub="96 to next"
              accent="gold"
            />
          </div>
          <ReferralPanel code={data?.referralCode ?? "—"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PaymentHistory />
          <TierRewards />
          <QuickActions />
        </div>

        {/* Footer */}
        <div className="mt-10 pb-6 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] leading-relaxed">
            MILESTONE JOURNEY · {data?.email ?? "arjit.dailytrades@gmail.com"}
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            {data?.mobile ?? "7060955045"}
            {memberSince && ` · Joined ${memberSince}`}
          </p>
        </div>
      </div>
    </div>
  );
}
