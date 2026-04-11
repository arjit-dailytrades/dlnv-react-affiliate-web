import React, { useState, useEffect, useRef, useCallback } from "react";
import type { FC, ReactNode } from "react";

// ===== TYPES =====
type MilestoneType = "registration" | "subscription";

interface MilestoneData {
  count: number;
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

type PanelBtnColor = "violet" | "emerald" | "cyan" | "red";

// ===== DATA =====
const MILESTONES: Record<MilestoneType, MilestoneData[]> = {
  registration: [
    { count: 100, reward: 100, label: "Novice", icon: "🌱" },
    { count: 500, reward: 1000, label: "Rising", icon: "⚡" },
    { count: 1000, reward: 10000, label: "Elite", icon: "🔥" },
    { count: 10000, reward: null, label: "Legend", icon: "👑" },
    { count: 50000, reward: null, label: "Mythic", icon: "🌌" },
  ],
  subscription: [
    { count: 10, reward: 1000, label: "Starter", icon: "💡" },
    { count: 50, reward: 10000, label: "Grower", icon: "🌿" },
    { count: 100, reward: 25000, label: "Champion", icon: "🏅" },
    { count: 1000, reward: null, label: "Master", icon: "⚔️" },
    { count: 10000, reward: null, label: "Grandmaster", icon: "🎯" },
  ],
};

// ===== SPARKLE =====
interface SparkleProps {
  x: number;
  y: number;
  onDone: () => void;
}

const Sparkle: FC<SparkleProps> = ({ x, y, onDone }) => {
  const emojis = ["✨", "⭐", "💫", "🌟", "✦"];
  const emoji = useRef<string>(
    emojis[Math.floor(Math.random() * emojis.length)],
  );
  const tx = useRef<string>((Math.random() * 200 - 100).toFixed(0));
  const ty = useRef<string>((Math.random() * 200 - 100).toFixed(0));
  const size = useRef<string>((Math.random() * 16 + 10).toFixed(0));

  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed pointer-events-none z-50 animate-[sparkle_1s_ease-out_forwards]"
      style={
        {
          left: x,
          top: y,
          fontSize: `${size.current}px`,
          "--tx": `${tx.current}px`,
          "--ty": `${ty.current}px`,
        } as React.CSSProperties & { "--tx": string; "--ty": string }
      }
    >
      {emoji.current}
    </div>
  );
};

// ===== TOAST =====
interface ToastProps {
  toast: ToastState;
}

const Toast: FC<ToastProps> = ({ toast }) => (
  <div
    className={`fixed top-5 right-5 z-50 rounded-xl border border-emerald-500/50 bg-slate-900/95 px-5 py-4 shadow-xl shadow-emerald-500/10 transition-all duration-500 max-w-xs ${
      toast.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}
  >
    <div className="font-bold text-emerald-400 text-sm font-mono">
      {toast.title}
    </div>
    <div className="text-slate-400 text-xs mt-1">{toast.msg}</div>
  </div>
);

// ===== UNLOCK OVERLAY =====
interface UnlockOverlayProps {
  data: UnlockData | null;
  onClose: () => void;
}

const UnlockOverlay: FC<UnlockOverlayProps> = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 transition-opacity duration-300 opacity-100"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border-2 border-amber-400 rounded-2xl p-10 text-center max-w-sm w-11/12 shadow-[0_0_60px_rgba(251,191,36,0.25)] animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4 animate-[bounceIn_0.6s_ease-out]">
          {data.icon}
        </div>
        <h2 className="font-mono font-black text-amber-400 text-lg tracking-widest uppercase mb-2">
          Milestone Unlocked!
        </h2>
        <div className="font-mono text-3xl font-black text-amber-300 my-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
          {data.reward
            ? `+${data.reward.toLocaleString()}`
            : "🎁 Mystery Reward"}
        </div>
        <div className="text-slate-400 text-sm mb-6">{data.subtitle}</div>
        <button
          onClick={onClose}
          className="px-8 py-3 border-2 border-amber-400 text-amber-400 font-mono font-bold rounded-xl text-sm tracking-widest uppercase hover:bg-amber-400 hover:text-slate-900 transition-all duration-200"
        >
          ✨ Claim Reward
        </button>
      </div>
    </div>
  );
};

// ===== PROGRESS RING =====
interface ProgressRingProps {
  pct: number;
}

const ProgressRing: FC<ProgressRingProps> = ({ pct }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg
      className="absolute inset-0 w-full h-full -rotate-90"
      viewBox="0 0 80 80"
    >
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="rgba(139,92,246,0.15)"
        strokeWidth="3"
      />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="#a855f7"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="drop-shadow-[0_0_4px_#a855f7] transition-all duration-700"
      />
    </svg>
  );
};

// ===== MILESTONE NODE =====
interface MilestoneNodeProps {
  ms: MilestoneDataWithType;
  index: number;
  count: number;
  claimed: number[];
  onClaim: (index: number) => void;
  isLast: boolean;
}

const MilestoneNode: FC<MilestoneNodeProps> = ({
  ms,
  index,
  count,
  claimed,
  onClaim,
  isLast,
}) => {
  const isCompleted = count >= ms.count && claimed.includes(index);
  const prevMs: MilestoneData | undefined =
    index > 0 ? MILESTONES[ms._type]?.[index - 1] : undefined;
  const prevDone = !prevMs || count >= prevMs.count;
  const isCurrent = !isCompleted && prevDone;
  const isLocked = !isCurrent && !isCompleted;

  const prevCount = index > 0 ? MILESTONES[ms._type][index - 1].count : 0;
  const progressPct: number = isCurrent
    ? Math.min(((count - prevCount) / (ms.count - prevCount)) * 100, 100)
    : isCompleted
      ? 100
      : 0;

  const lineWidth: number = isCompleted ? 100 : isCurrent ? progressPct : 0;

  let stateClass = "";
  if (isCompleted)
    stateClass =
      "border-emerald-400 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.3)]";
  else if (isCurrent)
    stateClass =
      "border-violet-500 bg-violet-500/15 shadow-[0_0_30px_rgba(139,92,246,0.4)] animate-[nodePulse_2s_ease-in-out_infinite]";
  else
    stateClass =
      "border-slate-600/40 bg-slate-800/30 grayscale-[0.5] brightness-75";

  const canClaim: boolean = count >= ms.count && !claimed.includes(index);

  return (
    <div className="flex items-center">
      {/* Node wrapper */}
      <div className="flex flex-col items-center group relative">
        {/* Tooltip */}
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-10 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
          <div className="bg-slate-900/95 border border-violet-500/60 rounded-xl px-4 py-3 text-center whitespace-nowrap shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <div className="font-mono text-violet-300 text-xs font-bold tracking-wider mb-1">
              {ms.label} Milestone
            </div>
            <div className="text-slate-400 text-xs">
              {isCompleted
                ? "✅ Completed"
                : isCurrent
                  ? `📈 ${count.toLocaleString()} / ${ms.count.toLocaleString()}`
                  : "🔒 Locked"}
            </div>
            <div className="text-amber-400 text-xs font-bold mt-1">
              {ms.reward ? `💰 ${ms.reward.toLocaleString()}` : "🎁 ???"}
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-violet-500/60" />
        </div>

        {/* Circle */}
        <div className="relative">
          <div
            className={`relative w-20 h-20 rounded-full border-[3px] flex items-center justify-center cursor-pointer transition-all duration-300 ${stateClass} ${
              canClaim ? "hover:scale-110 hover:border-amber-400" : ""
            }`}
            onClick={() => canClaim && onClaim(index)}
          >
            {isCurrent && progressPct > 0 && <ProgressRing pct={progressPct} />}
            {isCurrent && (
              <div
                className="absolute inset-0 rounded-full border-[3px] border-violet-500/30 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            )}
            {isCompleted && (
              <div className="absolute inset-0 rounded-full border-[3px] border-emerald-400/30 animate-ping" />
            )}
            <span className="text-2xl z-10 relative select-none">
              {isCompleted ? "🏆" : canClaim ? "🎁" : isLocked ? "🔒" : ms.icon}
            </span>
          </div>
          {canClaim && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full animate-bounce flex items-center justify-center text-xs font-bold text-slate-900">
              !
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 text-center">
          <div
            className={`font-mono text-sm font-bold ${
              isCompleted
                ? "text-emerald-400"
                : isCurrent
                  ? "text-violet-300"
                  : "text-slate-500"
            }`}
          >
            {ms.count.toLocaleString()}
          </div>
          <div
            className={`text-xs mt-0.5 ${isCompleted ? "text-amber-400" : "text-slate-500"}`}
          >
            {ms.reward ? `💰 ${ms.reward.toLocaleString()}` : "🎁 ???"}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mt-1">
            {ms.label}
          </div>
        </div>
      </div>

      {/* Connection line */}
      {!isLast && (
        <div className="w-20 h-1 flex-shrink-0 rounded-full bg-slate-800 overflow-hidden relative">
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
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_10px_#a855f7] animate-[pulseDot_1.5s_ease-in-out_infinite]"
              style={{ left: `calc(${lineWidth}% - 6px)` }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ===== JOURNEY =====
interface JourneyProps {
  type: MilestoneType;
  count: number;
  claimed: number[];
  onClaim: (type: MilestoneType, index: number) => void;
}

const Journey: FC<JourneyProps> = ({ type, count, claimed, onClaim }) => {
  const data: MilestoneDataWithType[] = MILESTONES[type].map((m) => ({
    ...m,
    _type: type,
  }));
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-center justify-center min-w-max gap-0 px-6 py-10">
        {data.map((ms, i) => (
          <MilestoneNode
            key={i}
            ms={ms}
            index={i}
            count={count}
            claimed={claimed}
            onClaim={(idx) => onClaim(type, idx)}
            isLast={i === data.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

// ===== STAT CARD =====
interface StatCardProps {
  value: string | number;
  label: string;
}

const StatCard: FC<StatCardProps> = ({ value, label }) => (
  <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
    <div className="font-mono text-xl font-black text-violet-300">{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
      {label}
    </div>
  </div>
);

// ===== XP BAR =====
interface XPBarProps {
  xp: number;
}

const XPBar: FC<XPBarProps> = ({ xp }) => {
  const maxXP = 50000;
  const pct = Math.min((xp / maxXP) * 100, 100);
  const level = Math.floor(xp / 1000) + 1;
  return (
    <div className="text-center my-4">
      <div className="max-w-lg mx-auto bg-slate-800/50 rounded-full p-1 border border-violet-500/20">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 relative overflow-hidden transition-all duration-700"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_linear_infinite]" />
        </div>
      </div>
      <div className="font-mono text-sm text-violet-300 mt-2 tracking-wider">
        Level {level} — {xp.toLocaleString()} XP
      </div>
    </div>
  );
};

// ===== TOGGLE =====
interface ToggleProps {
  active: boolean;
  onToggle: () => void;
}

const Toggle: FC<ToggleProps> = ({ active, onToggle }) => (
  <div
    className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors duration-300 ${
      active ? "bg-violet-600" : "bg-slate-700"
    }`}
    onClick={onToggle}
  >
    <div
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
        active ? "left-[22px]" : "left-0.5"
      }`}
    />
  </div>
);

// ===== SECTION TITLE =====
interface SectionTitleProps {
  children: ReactNode;
}

const SectionTitle: FC<SectionTitleProps> = ({ children }) => (
  <h3 className="text-[10px] uppercase tracking-[3px] text-slate-600 mb-3 pb-2 border-b border-slate-800/60 font-mono">
    {children}
  </h3>
);

// ===== INPUT FIELD =====
interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  max: number;
}

const InputField: FC<InputFieldProps> = ({ label, value, onChange, max }) => (
  <div className="mb-3">
    <label className="block text-xs text-slate-500 mb-1.5 font-mono">
      {label}
    </label>
    <input
      type="number"
      value={value}
      min={0}
      max={max}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(Math.max(0, parseInt(e.target.value) || 0))
      }
      className="w-full px-3 py-2 rounded-lg border border-violet-900/40 bg-slate-800/50 text-slate-200 font-mono text-sm outline-none focus:border-violet-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all"
    />
  </div>
);

// ===== PANEL BUTTON =====
interface PanelBtnProps {
  onClick: () => void;
  color: PanelBtnColor;
  children: ReactNode;
}

const PanelBtn: FC<PanelBtnProps> = ({ onClick, color, children }) => {
  const colors: Record<PanelBtnColor, string> = {
    violet:
      "border-violet-700/50 text-violet-300 hover:bg-violet-500/10 hover:border-violet-500",
    emerald:
      "border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500",
    cyan: "border-cyan-700/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500",
    red: "border-red-700/50 text-red-300 hover:bg-red-500/10 hover:border-red-500",
  };
  return (
    <button
      onClick={onClick}
      className={`w-full py-2.5 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${colors[color]}`}
    >
      {children}
    </button>
  );
};

// ===== DAILY CHALLENGE =====
interface DailyChallengeProps {
  label: string;
  pct: number;
}

const DailyChallenge: FC<DailyChallengeProps> = ({ label, pct }) => (
  <div className="max-w-lg mx-auto mb-6 bg-amber-500/5 border border-amber-500/20 rounded-xl px-5 py-4 text-center">
    <h4 className="font-mono text-amber-400 text-xs tracking-widest uppercase mb-2">
      🔥 Daily Challenge
    </h4>
    <p className="text-slate-500 text-sm mb-3">{label}</p>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

// ===== MAIN APP =====
export default function MilestoneCard({milestones}: {milestones: any[]}) {
  const [tab, setTab] = useState<MilestoneType>("registration");
  const [regCount, setRegCount] = useState<number>(0);
  const [subCount, setSubCount] = useState<number>(0);
  const [claimedReg, setClaimedReg] = useState<number[]>([]);
  const [claimedSub, setClaimedSub] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [unlockData, setUnlockData] = useState<UnlockData | null>(null);
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: "",
    msg: "",
  });
  const [animations, setAnimations] = useState<boolean>(true);
  const [sound, setSound] = useState<boolean>(false);
  const [unlockFx, setUnlockFx] = useState<boolean>(true);
  const [sideOpen, setSideOpen] = useState<boolean>(true);

  const audioRef = useRef<AudioContext | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((title: string, msg: string): void => {
    setToast({ show: true, title, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      3000,
    );
  }, []);

  const spawnSparkles = useCallback((): void => {
    const items: SparkleItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setSparkles((s) => [...s, ...items]);
    setTimeout(
      () =>
        setSparkles((s) =>
          s.filter((sp) => !items.find((it) => it.id === sp.id)),
        ),
      1500,
    );
  }, []);

  const playSound = useCallback(
    (type: "unlock" | "click"): void => {
      if (!sound) return;
      try {
        const ctx =
          audioRef.current ??
          (audioRef.current = new (
            window.AudioContext ||
            (
              window as typeof window & {
                webkitAudioContext: typeof AudioContext;
              }
            ).webkitAudioContext
          )());
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === "unlock") {
          osc.frequency.setValueAtTime(523, ctx.currentTime);
          osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch (_) {
        // AudioContext unavailable
      }
    },
    [sound],
  );

  const handleClaim = useCallback(
    (type: MilestoneType, index: number): void => {
      const ms = MILESTONES[type][index];
      const claimed = type === "registration" ? claimedReg : claimedSub;
      if (claimed.includes(index)) return;

      const xpGain = ms.reward ?? 0;
      setTotalXP((x) => x + xpGain);

      if (type === "registration") setClaimedReg((c) => [...c, index]);
      else setClaimedSub((c) => [...c, index]);

      playSound("unlock");

      if (unlockFx) {
        setUnlockData({
          icon: ms.icon,
          reward: ms.reward,
          subtitle: `${type === "registration" ? "📋 Registration" : "💎 Subscription"} — ${ms.label} Milestone`,
        });
        spawnSparkles();
      }
      showToast(
        "🎉 Claimed!",
        `${ms.label} — ${ms.reward ? `+${ms.reward.toLocaleString()} XP` : "Mystery Reward"}`,
      );
    },
    [claimedReg, claimedSub, playSound, unlockFx, spawnSparkles, showToast],
  );

  const quickSet = (reg: number, sub: number): void => {
    setRegCount(reg);
    setSubCount(sub);
    showToast(
      "⚡ Quick Set",
      `${reg.toLocaleString()} reg / ${sub.toLocaleString()} sub`,
    );
  };

  const resetAll = (): void => {
    setRegCount(0);
    setSubCount(0);
    setClaimedReg([]);
    setClaimedSub([]);
    setTotalXP(0);
    showToast("🔄 Reset", "All progress has been cleared.");
  };

  const simUnlock = (type: MilestoneType, idx: number): void => {
    const ms = MILESTONES[type][idx];
    if (type === "registration") {
      setRegCount(ms.count);
      if (!claimedReg.includes(idx)) {
        setClaimedReg((c) => [...c, idx]);
        setTotalXP((x) => x + (ms.reward ?? 0));
      }
    } else {
      setSubCount(ms.count);
      if (!claimedSub.includes(idx)) {
        setClaimedSub((c) => [...c, idx]);
        setTotalXP((x) => x + (ms.reward ?? 0));
      }
    }
    if (unlockFx) {
      setUnlockData({
        icon: ms.icon,
        reward: ms.reward,
        subtitle: `${ms.label} Milestone`,
      });
      spawnSparkles();
    }
    showToast("🔓 Unlocked!", ms.label);
  };

  const regCompleted = claimedReg.length;
  const subCompleted = claimedSub.length;

  const tabs: Array<{ id: MilestoneType; label: string; icon: string }> = [
    { id: "registration", label: "Registration", icon: "📋" },
    { id: "subscription", label: "Subscription", icon: "💎" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        * { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace !important; }

        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        @keyframes sparkle { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
        @keyframes nodePulse { 0%,100% { box-shadow: 0 0 20px rgba(139,92,246,0.3); } 50% { box-shadow: 0 0 40px rgba(139,92,246,0.6); } }
        @keyframes pulseDot { 0%,100% { transform: translateY(-50%) scale(1); opacity: 1; } 50% { transform: translateY(-50%) scale(1.5); opacity: 0.5; } }
        @keyframes popIn { 0% { transform: scale(0.5); } 100% { transform: scale(1); } }
        @keyframes bounceIn { 0% { transform: scale(0) rotate(-20deg); } 50% { transform: scale(1.3) rotate(5deg); } 100% { transform: scale(1) rotate(0deg); } }
        @keyframes titlePulse { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.4); } }
        @keyframes fadeSlideIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }

        .animate-\\[sparkle_1s_ease-out_forwards\\] { animation: sparkle 1s ease-out forwards; }
        .animate-\\[shimmer_2s_linear_infinite\\] { animation: shimmer 2s linear infinite; }
        .animate-\\[nodePulse_2s_ease-in-out_infinite\\] { animation: nodePulse 2s ease-in-out infinite; }
        .animate-\\[pulseDot_1\\.5s_ease-in-out_infinite\\] { animation: pulseDot 1.5s ease-in-out infinite; }
        .animate-\\[popIn_0\\.5s_cubic-bezier\\(0\\.34\\,1\\.56\\,0\\.64\\,1\\)\\] { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .animate-\\[bounceIn_0\\.6s_ease-out\\] { animation: bounceIn 0.6s ease-out; }
        .animate-\\[fadeSlideIn_0\\.4s_ease-out\\] { animation: fadeSlideIn 0.4s ease-out; }

        .bg-grid {
          background-image:
            linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(15,15,35,0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      <div className="min-h-screen bg-[#070714] text-slate-200 flex overflow-hidden bg-grid">
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-900/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-fuchsia-900/10 blur-3xl" />
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          {/* Header */}
          <div className="text-center px-6 pt-8 pb-2">
            <h1
              className="font-mono font-black text-3xl md:text-4xl tracking-[4px] uppercase bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent"
              style={{ animation: "titlePulse 3s ease-in-out infinite" }}
            >
              ⚔️ Milestone Journey
            </h1>
            <p className="text-slate-500 text-sm tracking-[3px] uppercase mt-1">
              Progress • Unlock • Conquer
            </p>
          </div>

          {/* XP Bar */}
          <XPBar xp={totalXP} />

          {/* Tabs */}
          <div className="flex justify-center gap-3 px-6 mb-2">
            {tabs.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-6 py-3 rounded-xl border font-mono text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                  tab === id
                    ? "border-violet-500 text-violet-300 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "border-slate-700/50 text-slate-500 hover:border-violet-500/40 hover:text-slate-400 bg-slate-900/30"
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Journey */}
          <div className="flex-1 overflow-auto px-4">
            {tab === "registration" && (
              <div className="animate-[fadeSlideIn_0.4s_ease-out]">
                <h2 className="text-center font-bold text-lg text-slate-400 mt-4 mb-0">
                  📋{" "}
                  <span className="bg-gradient-to-r from-violet-300 to-amber-300 bg-clip-text text-transparent">
                    Registration Path
                  </span>
                </h2>
                <Journey
                  type="registration"
                  count={regCount}
                  claimed={claimedReg}
                  onClaim={handleClaim}
                />
                <DailyChallenge
                  label="Complete 3 milestones today for bonus XP!"
                  pct={Math.min((regCompleted / 3) * 100, 100)}
                />
              </div>
            )}
            {tab === "subscription" && (
              <div className="animate-[fadeSlideIn_0.4s_ease-out]">
                <h2 className="text-center font-bold text-lg text-slate-400 mt-4 mb-0">
                  💎{" "}
                  <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
                    Subscription Path
                  </span>
                </h2>
                <Journey
                  type="subscription"
                  count={subCount}
                  claimed={claimedSub}
                  onClaim={handleClaim}
                />
                <DailyChallenge
                  label="Complete 2 milestones today for bonus gems!"
                  pct={Math.min((subCompleted / 2) * 100, 100)}
                />
              </div>
            )}
            <div className="text-center py-4 mb-4 border border-dashed border-slate-800 rounded-xl text-slate-600 text-sm max-w-md mx-auto">
              <span className="text-2xl block mb-1">🏆</span>
              Leaderboard integration coming soon — stay tuned!
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div
          className={`${
            sideOpen ? "w-72" : "w-0 overflow-hidden"
          } transition-all duration-300 border-l border-violet-900/30 bg-slate-900/80 backdrop-blur-sm flex-shrink-0 overflow-y-auto relative z-10`}
        >
          <div className="p-5 min-w-[288px]">
            <div className="flex items-center justify-between mb-5">
              <div className="font-mono text-violet-300 text-sm font-bold tracking-widest">
                🧪 DEV CONTROLS
              </div>
              <button
                onClick={() => setSideOpen(false)}
                className="text-slate-600 hover:text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="mb-5">
              <SectionTitle>📊 Stats</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                <StatCard value={regCount.toLocaleString()} label="Reg Count" />
                <StatCard value={subCount.toLocaleString()} label="Sub Count" />
                <StatCard
                  value={regCompleted + subCompleted}
                  label="Completed"
                />
                <StatCard value={totalXP.toLocaleString()} label="Total XP" />
              </div>
            </div>

            {/* Inputs */}
            <div className="mb-5">
              <SectionTitle>⚙️ Simulate Progress</SectionTitle>
              <InputField
                label="📋 Registration Count"
                value={regCount}
                onChange={setRegCount}
                max={60000}
              />
              <InputField
                label="💎 Subscription Count"
                value={subCount}
                onChange={setSubCount}
                max={12000}
              />
            </div>

            {/* Quick Set */}
            <div className="mb-5">
              <SectionTitle>⚡ Quick Set</SectionTitle>
              <div className="flex flex-col gap-2">
                <PanelBtn onClick={() => quickSet(750, 45)} color="violet">
                  750 Reg / 45 Sub
                </PanelBtn>
                <PanelBtn onClick={() => quickSet(1000, 100)} color="emerald">
                  Max Milestones
                </PanelBtn>
                <PanelBtn onClick={() => quickSet(25000, 500)} color="cyan">
                  25K Reg / 500 Sub
                </PanelBtn>
                <PanelBtn onClick={resetAll} color="red">
                  🔄 Reset All
                </PanelBtn>
              </div>
            </div>

            {/* Toggles */}
            <div className="mb-5">
              <SectionTitle>🎛️ Options</SectionTitle>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">✨ Animations</span>
                  <Toggle
                    active={animations}
                    onToggle={() => setAnimations((a) => !a)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">
                    🔊 Sound Effects
                  </span>
                  <Toggle active={sound} onToggle={() => setSound((s) => !s)} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">
                    🎆 Unlock Effects
                  </span>
                  <Toggle
                    active={unlockFx}
                    onToggle={() => setUnlockFx((u) => !u)}
                  />
                </div>
              </div>
            </div>

            {/* Simulate Unlock */}
            <div className="mb-5">
              <SectionTitle>🎁 Simulate Unlock</SectionTitle>
              <div className="flex flex-col gap-2 mb-3">
                <label className="text-slate-500 text-xs uppercase tracking-wider">
                  Registration
                </label>
                {MILESTONES.registration.map((ms, i) => (
                  <button
                    key={i}
                    onClick={() => simUnlock("registration", i)}
                    className="text-left px-3 py-2 rounded-lg border border-slate-700/40 bg-slate-800/30 hover:border-violet-500/40 text-slate-400 hover:text-violet-300 text-xs transition-colors font-mono"
                  >
                    M{i + 1}: {ms.count.toLocaleString()} — {ms.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-xs uppercase tracking-wider">
                  Subscription
                </label>
                {MILESTONES.subscription.map((ms, i) => (
                  <button
                    key={i}
                    onClick={() => simUnlock("subscription", i)}
                    className="text-left px-3 py-2 rounded-lg border border-slate-700/40 bg-slate-800/30 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-xs transition-colors font-mono"
                  >
                    M{i + 1}: {ms.count.toLocaleString()} — {ms.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel reopen button */}
        {!sideOpen && (
          <button
            onClick={() => setSideOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-violet-600 text-white px-2 py-4 rounded-l-xl z-20 font-mono text-xs hover:bg-violet-500 transition-colors"
          >
            🧪
          </button>
        )}
      </div>

      {/* Sparkles */}
      {sparkles.map((s) => (
        <Sparkle
          key={s.id}
          x={s.x}
          y={s.y}
          onDone={() => setSparkles((sp) => sp.filter((x) => x.id !== s.id))}
        />
      ))}

      {/* Toast */}
      <Toast toast={toast} />

      {/* Unlock overlay */}
      <UnlockOverlay data={unlockData} onClose={() => setUnlockData(null)} />
    </>
  );
}
