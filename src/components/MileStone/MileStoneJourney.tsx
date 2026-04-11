import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import type { FC } from "react";

// ===== TYPES =====
type MilestoneType = "registration" | "subscription";

interface MilestoneEntry {
  target: number;
  reward: number;
}

interface AffiliateMilestoneConfig {
  _id?: string;
  key: string;
  Registration: MilestoneEntry[];
  Subscription: MilestoneEntry[];
}

export interface MilestoneApiResponse {
  affiliateMileStone: AffiliateMilestoneConfig;
  registrationCount: number;
  subscriptionCount: number;
}

interface MilestoneData {
  /** Individual target for THIS milestone (e.g. 100, 500, 1000) */
  individualTarget: number;
  /**
   * Cumulative target — sum of all targets up to and including this one.
   * e.g. Milestone 1 = 100, Milestone 2 = 600 (100+500), Milestone 3 = 1600 (100+500+1000)
   * This is what count must reach for this milestone to be COMPLETE.
   */
  cumulativeTarget: number;
  reward: number | null;
  label: string;
  icon: string;
}

interface MilestoneDataWithType extends MilestoneData {
  _type: MilestoneType;
}

interface ToastState {
  show: boolean;
  title: string;
  msg: string;
}

interface UnlockData {
  icon: string;
  reward: number | null;
  subtitle: string;
}

interface SparkleItem {
  id: number;
  x: number;
  y: number;
}

interface TooltipInfo {
  label: string;
  status: string;
  reward: string;
  rect: DOMRect;
}

interface MilestoneJourneyProps {
  data: MilestoneApiResponse | null | undefined;
}

// ===== LABEL & ICON MAPS =====
const REG_META: Array<{ label: string; icon: string }> = [
  { label: "Novice",      icon: "🌱" },
  { label: "Rising",      icon: "⚡" },
  { label: "Elite",       icon: "🔥" },
  { label: "Legend",      icon: "👑" },
  { label: "Mythic",      icon: "🌌" },
];

const SUB_META: Array<{ label: string; icon: string }> = [
  { label: "Starter",     icon: "💡" },
  { label: "Grower",      icon: "🌿" },
  { label: "Champion",    icon: "🏅" },
  { label: "Master",      icon: "⚔️" },
  { label: "Grandmaster", icon: "🎯" },
];

// ===== TRANSFORM CONFIG =====
// KEY LOGIC:
// API targets are INCREMENTAL: [100, 500, 1000, 10000, 50000]
// Cumulative targets become:   [100, 600, 1600, 11600, 61600]
// User needs 600 total registrations to complete milestone 2, NOT just 500.
function transformEntries(
  entries: MilestoneEntry[],
  meta: Array<{ label: string; icon: string }>,
): MilestoneData[] {
  let cumulative = 0;
  return entries.map((entry, i) => {
    cumulative += entry.target;
    return {
      individualTarget: entry.target,
      cumulativeTarget: cumulative,
      reward:           entry.reward,
      label:            meta[i]?.label ?? `Tier ${i + 1}`,
      icon:             meta[i]?.icon  ?? "⭐",
    };
  });
}

function transformConfig(
  config: AffiliateMilestoneConfig,
): Record<MilestoneType, MilestoneData[]> {
  return {
    registration: transformEntries(config.Registration ?? [], REG_META),
    subscription:  transformEntries(config.Subscription  ?? [], SUB_META),
  };
}

// ===== TOOLTIP PORTAL =====
const TooltipPortal: FC<{ tooltip: TooltipInfo | null }> = ({ tooltip }) => {
  if (!tooltip) return null;
  const left = tooltip.rect.left + tooltip.rect.width / 2;
  const top  = tooltip.rect.top - 12;
  return ReactDOM.createPortal(
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ left, top, transform: "translate(-50%, -100%)" }}
    >
      <div
        className="bg-slate-900 border border-violet-500/70 rounded-xl px-4 py-3
          text-center shadow-[0_0_24px_rgba(139,92,246,0.25)] whitespace-nowrap"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="text-violet-300 text-xs font-semibold tracking-wide mb-1">
          {tooltip.label}
        </div>
        <div className="text-slate-400 text-xs">{tooltip.status}</div>
        <div className="text-amber-400 text-xs font-semibold mt-1">{tooltip.reward}</div>
      </div>
      <div className="flex justify-center">
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px]
          border-r-transparent border-t-[6px] border-t-violet-500/70" />
      </div>
    </div>,
    document.body,
  );
};

// ===== SPARKLE =====
const Sparkle: FC<{ x: number; y: number; onDone: () => void }> = ({ x, y, onDone }) => {
  const emojis = ["✨", "⭐", "💫", "🌟", "✦"];
  const emoji = useRef<string>(emojis[Math.floor(Math.random() * emojis.length)]);
  const tx    = useRef<string>((Math.random() * 200 - 100).toFixed(0));
  const ty    = useRef<string>((Math.random() * 200 - 100).toFixed(0));
  const size  = useRef<string>((Math.random() * 16 + 10).toFixed(0));

  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={
        {
          left: x, top: y,
          fontSize: `${size.current}px`,
          "--tx": `${tx.current}px`,
          "--ty": `${ty.current}px`,
          animation: "mj_sparkle 1s ease-out forwards",
        } as React.CSSProperties & { "--tx": string; "--ty": string }
      }
    >
      {emoji.current}
    </div>
  );
};

// ===== TOAST =====
const Toast: FC<{ toast: ToastState }> = ({ toast }) => (
  <div
    className={`fixed top-5 right-5 z-50 rounded-xl border border-emerald-500/50
      bg-slate-900/95 px-5 py-4 shadow-xl transition-all duration-500 max-w-xs
      ${toast.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
  >
    <div className="font-semibold text-emerald-400 text-sm">{toast.title}</div>
    <div className="text-slate-400 text-xs mt-1">{toast.msg}</div>
  </div>
);

// ===== UNLOCK OVERLAY =====
const UnlockOverlay: FC<{ data: UnlockData | null; onClose: () => void }> = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="relative bg-slate-900 border-2 border-amber-400 rounded-2xl p-10
          text-center max-w-sm w-11/12 shadow-[0_0_60px_rgba(251,191,36,0.25)]"
        style={{ animation: "mj_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4" style={{ animation: "mj_bounceIn 0.6s ease-out" }}>
          {data.icon}
        </div>
        <h2 className="font-bold text-amber-400 text-xl tracking-wide uppercase mb-2">
          Milestone Unlocked!
        </h2>
        <div className="text-3xl font-black text-amber-300 my-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
          {data.reward != null ? `+${data.reward.toLocaleString()}` : "🎁 Mystery Reward"}
        </div>
        <div className="text-slate-400 text-sm mb-6">{data.subtitle}</div>
        <button
          onClick={onClose}
          className="px-8 py-3 border-2 border-amber-400 text-amber-400 font-semibold
            rounded-xl text-sm tracking-wide uppercase hover:bg-amber-400
            hover:text-slate-900 transition-all duration-200"
        >
          ✨ Claim Reward
        </button>
      </div>
    </div>
  );
};

// ===== PROGRESS RING =====
const ProgressRing: FC<{ pct: number }> = ({ pct }) => {
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="3" />
      <circle cx="40" cy="40" r={r} fill="none" stroke="#a855f7" strokeWidth="3"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        className="drop-shadow-[0_0_4px_#a855f7] transition-all duration-700"
      />
    </svg>
  );
};

// ===== MILESTONE NODE =====
interface MilestoneNodeProps {
  ms: MilestoneDataWithType;
  index: number;
  /** total count from API (registrationCount / subscriptionCount) */
  totalCount: number;
  claimed: number[];
  onClaim: (index: number) => void;
  isLast: boolean;
  allMilestones: MilestoneData[];
  onTooltipShow: (info: TooltipInfo) => void;
  onTooltipHide: () => void;
}

const MilestoneNode: FC<MilestoneNodeProps> = ({
  ms, index, totalCount, claimed, onClaim, isLast, allMilestones,
  onTooltipShow, onTooltipHide,
}) => {
  const circleRef = useRef<HTMLDivElement>(null);

  // ── CUMULATIVE LOGIC ──────────────────────────────────────────────────────
  // ms.cumulativeTarget = total registrations/subscriptions needed to FINISH this milestone
  // previous milestone's cumulativeTarget = where THIS milestone starts from
  const prevCumulative = index > 0 ? allMilestones[index - 1].cumulativeTarget : 0;

  // Is this milestone fully done? (total count has reached or passed cumulative target)
  const isCompleted = totalCount >= ms.cumulativeTarget && claimed.includes(index);

  // Previous milestone must be claimed before this one is "active"
  const prevClaimed = index === 0 || claimed.includes(index - 1);
  const isCurrent   = !isCompleted && prevClaimed;
  const isLocked    = !isCurrent && !isCompleted;

  // Progress within THIS milestone only:
  // e.g. Milestone 2 needs 500 more (from 100 → 600).
  // If user has 350 total → progress = (350 - 100) / 500 = 50%
  const countIntoThisMilestone = Math.max(0, totalCount - prevCumulative);
  const progressPct = isCurrent
    ? Math.min((countIntoThisMilestone / ms.individualTarget) * 100, 100)
    : isCompleted ? 100 : 0;

  const lineWidth = isCompleted ? 100 : isCurrent ? progressPct : 0;
  const canClaim  = totalCount >= ms.cumulativeTarget && !claimed.includes(index) && prevClaimed;
  // ─────────────────────────────────────────────────────────────────────────

  let nodeClass = "";
  if (isCompleted)
    nodeClass = "border-emerald-400 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.3)]";
  else if (isCurrent)
    nodeClass = "border-violet-500 bg-violet-500/15 shadow-[0_0_30px_rgba(139,92,246,0.4)]";
  else
    nodeClass = "border-slate-600/40 bg-slate-800/30 opacity-60";

  const handleMouseEnter = () => {
    const el = circleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // Tooltip status — show how far into THIS milestone the user is
    let status = "";
    if (isCompleted) {
      status = "✅ Completed";
    } else if (isCurrent) {
      // e.g.  "📈 250 / 500  (total: 350 / 600)"
      status = `📈 ${countIntoThisMilestone.toLocaleString()} / ${ms.individualTarget.toLocaleString()}`;
    } else {
      status = "🔒 Locked";
    }

    onTooltipShow({
      label:  `${ms.label} Milestone`,
      status,
      reward: ms.reward != null ? `💰 ${ms.reward.toLocaleString()}` : "🎁 ???",
      rect,
    });
  };

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center relative">
        <div className="relative" ref={circleRef}>
          <div
            className={`relative w-20 h-20 rounded-full border-[3px] flex items-center
              justify-center transition-all duration-300 ${nodeClass}
              ${canClaim ? "cursor-pointer hover:scale-110 hover:border-amber-400" : "cursor-default"}
              ${isCurrent ? "animate-[mj_nodePulse_2s_ease-in-out_infinite]" : ""}`}
            onClick={() => canClaim && onClaim(index)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onTooltipHide}
          >
            {isCurrent && progressPct > 0 && <ProgressRing pct={progressPct} />}
            {isCurrent && (
              <div className="absolute inset-0 rounded-full border-[3px] border-violet-500/30 animate-spin"
                style={{ animationDuration: "3s" }} />
            )}
            {isCompleted && (
              <div className="absolute inset-0 rounded-full border-[3px] border-emerald-400/30 animate-ping" />
            )}
            <span className="text-2xl z-10 relative select-none">
              {isCompleted ? "🏆" : canClaim ? "🎁" : isLocked ? "🔒" : ms.icon}
            </span>
          </div>

          {canClaim && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full
              animate-bounce flex items-center justify-center text-xs font-bold text-slate-900">
              !
            </div>
          )}
        </div>

        {/* Info below node */}
        <div className="mt-3 text-center">
          {/* Show the INDIVIDUAL target (e.g. "500") not the cumulative */}
          <div className={`text-sm font-bold ${
            isCompleted ? "text-emerald-400" : isCurrent ? "text-violet-300" : "text-slate-500"
          }`}>
            +{ms.individualTarget.toLocaleString()}
          </div>
          {/* Show progress count within this milestone when active */}
          {isCurrent && (
            <div className="text-[10px] text-violet-400 mt-0.5">
              {countIntoThisMilestone.toLocaleString()} / {ms.individualTarget.toLocaleString()}
            </div>
          )}
          <div className={`text-xs mt-0.5 ${isCompleted ? "text-amber-400" : "text-slate-500"}`}>
            {ms.reward != null ? `💰 ${ms.reward.toLocaleString()}` : "🎁 ???"}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mt-1">
            {ms.label}
          </div>
        </div>
      </div>

      {/* Connector */}
      {!isLast && (
        <div className="w-16 md:w-20 h-1 flex-shrink-0 rounded-full bg-slate-800 overflow-visible relative mx-1">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-violet-500"
                : "bg-gradient-to-r from-violet-600 to-violet-400"
            }`}
            style={{ width: `${lineWidth}%` }}
          />
          {lineWidth > 0 && lineWidth < 100 && (
            <div
              className="absolute top-1/2 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_10px_#a855f7]"
              style={{
                left: `calc(${lineWidth}% - 6px)`,
                transform: "translateY(-50%)",
                animation: "mj_pulseDot 1.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ===== JOURNEY ROW =====
interface JourneyProps {
  type: MilestoneType;
  totalCount: number;
  claimed: number[];
  onClaim: (type: MilestoneType, index: number) => void;
  milestones: Record<MilestoneType, MilestoneData[]>;
  onTooltipShow: (info: TooltipInfo) => void;
  onTooltipHide: () => void;
}

const Journey: FC<JourneyProps> = ({
  type, totalCount, claimed, onClaim, milestones, onTooltipShow, onTooltipHide,
}) => {
  const data: MilestoneDataWithType[] = milestones[type].map((m) => ({ ...m, _type: type }));
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-center justify-center min-w-max gap-0 px-6 py-10">
        {data.map((ms, i) => (
          <MilestoneNode
            key={i}
            ms={ms}
            index={i}
            totalCount={totalCount}
            claimed={claimed}
            onClaim={(idx) => onClaim(type, idx)}
            isLast={i === data.length - 1}
            allMilestones={milestones[type]}
            onTooltipShow={onTooltipShow}
            onTooltipHide={onTooltipHide}
          />
        ))}
      </div>
    </div>
  );
};

// ===== XP BAR =====
const XPBar: FC<{ xp: number }> = ({ xp }) => {
  const maxXP = 500000;
  const pct   = Math.min((xp / maxXP) * 100, 100);
  const level = Math.floor(xp / 10000) + 1;
  return (
    <div className="text-center my-4">
      <div className="max-w-lg mx-auto bg-slate-800/50 rounded-full p-1 border border-violet-500/20">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500
            to-cyan-400 relative overflow-hidden transition-all duration-700"
          style={{ width: `${pct}%`, minWidth: pct > 0 ? "12px" : "0" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animation: "mj_shimmer 2s linear infinite" }} />
        </div>
      </div>
      <div className="text-sm text-violet-300 mt-2 tracking-wide">
        Level {level} — {xp.toLocaleString()} XP
      </div>
    </div>
  );
};

// ===== DAILY CHALLENGE =====
const DailyChallenge: FC<{ label: string; pct: number }> = ({ label, pct }) => (
  <div className="max-w-lg mx-auto mb-6 bg-amber-500/5 border border-amber-500/20 rounded-xl px-5 py-4 text-center">
    <h4 className="text-amber-400 text-xs tracking-widest uppercase mb-2 font-semibold">
      🔥 Daily Challenge
    </h4>
    <p className="text-slate-500 text-sm mb-3">{label}</p>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }} />
    </div>
  </div>
);

// ===== LOADING SKELETON =====
const LoadingSkeleton: FC = () => (
  <div className="flex items-center justify-center gap-6 px-6 py-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-slate-800/60 animate-pulse" />
        <div className="w-14 h-3 rounded bg-slate-800/60 animate-pulse" />
        <div className="w-10 h-2 rounded bg-slate-800/60 animate-pulse" />
      </div>
    ))}
  </div>
);

// ===== STATS BANNER =====
const StatsBanner: FC<{ regCount: number; subCount: number }> = ({ regCount, subCount }) => (
  <div className="flex justify-center gap-4 px-6 mb-4">
    <div className="flex items-center gap-2 bg-slate-800/50 border border-violet-500/20 rounded-xl px-5 py-3">
      <span className="text-lg">📋</span>
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Total Registrations</div>
        <div className="text-lg font-bold text-violet-300">{regCount.toLocaleString()}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 bg-slate-800/50 border border-cyan-500/20 rounded-xl px-5 py-3">
      <span className="text-lg">💎</span>
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Total Subscriptions</div>
        <div className="text-lg font-bold text-cyan-300">{subCount.toLocaleString()}</div>
      </div>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====
export default function MilestoneJourney({ data }: MilestoneJourneyProps) {
  const config   = data?.affiliateMileStone ?? null;
  const regCount = data?.registrationCount  ?? 0;
  const subCount = data?.subscriptionCount  ?? 0;

  const milestones = React.useMemo(
    () => (config ? transformConfig(config) : null),
    [config],
  );

  const [tab,        setTab]        = useState<MilestoneType>("registration");
  const [claimedReg, setClaimedReg] = useState<number[]>([]);
  const [claimedSub, setClaimedSub] = useState<number[]>([]);
  const [totalXP,    setTotalXP]    = useState<number>(0);
  const [unlockData, setUnlockData] = useState<UnlockData | null>(null);
  const [sparkles,   setSparkles]   = useState<SparkleItem[]>([]);
  const [toast,      setToast]      = useState<ToastState>({ show: false, title: "", msg: "" });
  const [tooltip,    setTooltip]    = useState<TooltipInfo | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── AUTO-COMPLETE milestones based on cumulative count from API ──────────
  // Registration: targets [100, 500, 1000, 10000, 50000]
  // Cumulative:   [100, 600, 1600, 11600, 61600]
  // If regCount = 650 → milestones 0 and 1 are complete (100 ✅, 600 ✅), 2 is current
  useEffect(() => {
    if (!milestones) return;

    const autoReg = milestones.registration
      .map((ms, i) => (regCount >= ms.cumulativeTarget ? i : -1))
      .filter((i) => i !== -1);
    setClaimedReg(autoReg);

    const autoSub = milestones.subscription
      .map((ms, i) => (subCount >= ms.cumulativeTarget ? i : -1))
      .filter((i) => i !== -1);
    setClaimedSub(autoSub);

    const xpFromReg = autoReg.reduce(
      (sum, i) => sum + (milestones.registration[i]?.reward ?? 0), 0,
    );
    const xpFromSub = autoSub.reduce(
      (sum, i) => sum + (milestones.subscription[i]?.reward ?? 0), 0,
    );
    setTotalXP(xpFromReg + xpFromSub);
  }, [milestones, regCount, subCount]);

  const showToast = useCallback((title: string, msg: string) => {
    setToast({ show: true, title, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  const spawnSparkles = useCallback(() => {
    const items: SparkleItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
    }));
    setSparkles((s) => [...s, ...items]);
    setTimeout(
      () => setSparkles((s) => s.filter((sp) => !items.find((it) => it.id === sp.id))),
      1500,
    );
  }, []);

  const handleClaim = useCallback(
    (type: MilestoneType, index: number) => {
      if (!milestones) return;
      const ms      = milestones[type][index];
      const claimed = type === "registration" ? claimedReg : claimedSub;
      if (claimed.includes(index)) return;

      setTotalXP((x) => x + (ms.reward ?? 0));
      if (type === "registration") setClaimedReg((c) => [...c, index]);
      else                          setClaimedSub((c) => [...c, index]);

      setUnlockData({
        icon:     ms.icon,
        reward:   ms.reward,
        subtitle: `${type === "registration" ? "📋 Registration" : "💎 Subscription"} — ${ms.label} Milestone`,
      });
      spawnSparkles();
      showToast(
        "🎉 Claimed!",
        `${ms.label} — ${ms.reward != null ? `+${ms.reward.toLocaleString()} XP` : "Mystery Reward"}`,
      );
    },
    [milestones, claimedReg, claimedSub, spawnSparkles, showToast],
  );

  const regCompleted = claimedReg.length;
  const subCompleted = claimedSub.length;

  const tabs: Array<{ id: MilestoneType; label: string; icon: string }> = [
    { id: "registration", label: "Registration", icon: "📋" },
    { id: "subscription",  label: "Subscription",  icon: "💎" },
  ];

  return (
    <>
      <style>{`
        @keyframes mj_shimmer    { 0%   { transform:translateX(-100%); }
                                   100% { transform:translateX(300%);  } }
        @keyframes mj_sparkle    { 0%   { transform:translate(0,0) scale(1); opacity:1; }
                                   100% { transform:translate(var(--tx),var(--ty)) scale(0); opacity:0; } }
        @keyframes mj_nodePulse  { 0%,100% { box-shadow:0 0 20px rgba(139,92,246,0.3); }
                                   50%      { box-shadow:0 0 40px rgba(139,92,246,0.6); } }
        @keyframes mj_pulseDot   { 0%,100% { transform:translateY(-50%) scale(1); opacity:1; }
                                   50%      { transform:translateY(-50%) scale(1.5); opacity:0.5; } }
        @keyframes mj_popIn      { 0%   { transform:scale(0.5); } 100% { transform:scale(1); } }
        @keyframes mj_bounceIn   { 0%   { transform:scale(0) rotate(-20deg); }
                                   50%  { transform:scale(1.3) rotate(5deg); }
                                   100% { transform:scale(1) rotate(0deg); } }
        @keyframes mj_titlePulse { 0%,100% { filter:brightness(1); }
                                   50%      { filter:brightness(1.35); } }
        @keyframes mj_fadeSlide  { 0%   { opacity:0; transform:translateY(10px); }
                                   100% { opacity:1; transform:translateY(0); } }
        .mj-bg-grid {
          background-image:
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .mj-root ::-webkit-scrollbar       { width:4px; height:4px; }
        .mj-root ::-webkit-scrollbar-track { background:rgba(15,15,35,0.5); }
        .mj-root ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.4); border-radius:2px; }
      `}</style>

      <TooltipPortal tooltip={tooltip} />

      <div className="mj-root min-h-screen text-slate-200 flex flex-col overflow-hidden mj-bg-grid">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-900/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-64 h-64 rounded-full bg-fuchsia-900/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <div className="text-center px-6 pt-8 pb-2">
            <h1
              className="font-bold text-3xl md:text-4xl tracking-wide
                bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300
                bg-clip-text text-transparent"
              style={{ animation: "mj_titlePulse 3s ease-in-out infinite" }}
            >
              ⚔️ Milestone Journey
            </h1>
            <p className="text-slate-500 text-sm tracking-widest uppercase mt-1">
              Progress • Unlock • Conquer
            </p>
          </div>

          <XPBar xp={totalXP} />

          {data && <StatsBanner regCount={regCount} subCount={subCount} />}

          <div className="flex justify-center gap-3 px-6 mb-2">
            {tabs.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-6 py-3 rounded-xl border text-sm font-semibold uppercase
                  tracking-widest transition-all duration-300
                  ${tab === id
                    ? "border-violet-500 text-violet-300 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "border-slate-700/50 text-slate-500 hover:border-violet-500/40 hover:text-slate-400 bg-slate-900/30"
                  }`}
              >
                <span className="mr-2">{icon}</span>{label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto px-4">
            {!milestones && <LoadingSkeleton />}

            {milestones && tab === "registration" && (
              <div style={{ animation: "mj_fadeSlide 0.4s ease-out" }}>
                <h2 className="text-center font-semibold text-lg text-slate-400 mt-4 mb-0">
                  📋{" "}
                  <span className="bg-gradient-to-r from-violet-300 to-amber-300 bg-clip-text text-transparent">
                    Registration Path
                  </span>
                </h2>
                <Journey
                  type="registration"
                  totalCount={regCount}
                  claimed={claimedReg}
                  onClaim={handleClaim}
                  milestones={milestones}
                  onTooltipShow={setTooltip}
                  onTooltipHide={() => setTooltip(null)}
                />
                <DailyChallenge
                  label="Complete 3 milestones today for bonus XP!"
                  pct={Math.min((regCompleted / milestones.registration.length) * 100, 100)}
                />
              </div>
            )}

            {milestones && tab === "subscription" && (
              <div style={{ animation: "mj_fadeSlide 0.4s ease-out" }}>
                <h2 className="text-center font-semibold text-lg text-slate-400 mt-4 mb-0">
                  💎{" "}
                  <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
                    Subscription Path
                  </span>
                </h2>
                <Journey
                  type="subscription"
                  totalCount={subCount}
                  claimed={claimedSub}
                  onClaim={handleClaim}
                  milestones={milestones}
                  onTooltipShow={setTooltip}
                  onTooltipHide={() => setTooltip(null)}
                />
                <DailyChallenge
                  label="Complete 2 milestones today for bonus gems!"
                  pct={Math.min((subCompleted / milestones.subscription.length) * 100, 100)}
                />
              </div>
            )}

            <div className="text-center py-4 mb-4 border border-dashed border-slate-800
              rounded-xl text-slate-600 text-sm max-w-md mx-auto">
              <span className="text-2xl block mb-1">🏆</span>
              Leaderboard integration coming soon — stay tuned!
            </div>
          </div>
        </div>
      </div>

      {sparkles.map((s) => (
        <Sparkle key={s.id} x={s.x} y={s.y}
          onDone={() => setSparkles((sp) => sp.filter((x) => x.id !== s.id))} />
      ))}

      <Toast toast={toast} />
      <UnlockOverlay data={unlockData} onClose={() => setUnlockData(null)} />
    </>
  );
}
