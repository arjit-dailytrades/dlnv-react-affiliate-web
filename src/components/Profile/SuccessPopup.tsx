import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";

type Props = {
  open: boolean;
  onClose: () => void;
};

const BankSuccessPopup = ({ open, onClose }: Props) => {
  // const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const { data } = useSelector((state: RootState) => state.profile);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data?.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = data?.referralCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  //   useEffect(() => {
  //     if (open) {
  //       timeoutRef.current = setTimeout(() => {
  //         onClose();
  //       }, 4000);
  //     }
  //     return () => {
  //       if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //     };
  //   }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cardIn {
          0%   { opacity: 0; transform: scale(0.8) translateY(24px); }
          60%  { opacity: 1; transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.6); opacity: 0; }
          50%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 80; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes sparkle {
          0%   { opacity: 0; transform: scale(0) translateY(0); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: scale(1) translateY(-28px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .success-backdrop {
          animation: backdropIn 0.25s ease forwards;
        }
        .success-card {
          animation: cardIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both;
        }
        .success-ring {
          animation: ringPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
        }
        .success-check {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: checkDraw 0.45s cubic-bezier(0.4, 0, 0.2, 1) 0.65s forwards;
        }
        .spark-1 { animation: sparkle 0.7s ease 0.9s both; }
        .spark-2 { animation: sparkle 0.7s ease 1.0s both; }
        .spark-3 { animation: sparkle 0.7s ease 1.05s both; }
        .spark-4 { animation: sparkle 0.7s ease 0.95s both; }
        .success-title {
          animation: fadeSlideUp 0.4s ease 0.85s both;
        }
        .success-sub {
          animation: fadeSlideUp 0.4s ease 1.0s both;
        }
        .success-pills {
          animation: fadeSlideUp 0.4s ease 1.1s both;
        }
        .success-btn {
          animation: fadeSlideUp 0.4s ease 1.2s both;
        }
        @keyframes copyPop {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.92); }
          70%  { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes codeReveal {
          from { opacity: 0; letter-spacing: 0.25em; }
          to   { opacity: 1; letter-spacing: 0.12em; }
        }
        .copy-pop { animation: copyPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .code-reveal { animation: codeReveal 0.4s ease 1.15s both; }
        .progress-bar {
          animation: progressBar 4s linear 1.3s both;
          background: linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.22), rgba(255,255,255,0.08));
          background-size: 200% auto;
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.6) 0%,
            rgba(255,255,255,1) 40%,
            rgba(255,255,255,0.6) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.5s linear 1s infinite;
        }
      `}</style>

      <div
        className="success-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        onClick={onClose}
      >
        <div
          className="success-card relative bg-zinc-900 border border-white/8 rounded-3xl w-full max-w-[400px] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top glow */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 transition-colors duration-150"
          >
            <X size={16} strokeWidth={2} />
          </button>

          {/* Ambient glow behind icon */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full -translate-y-1/2 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
            }}
          />

          <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center gap-5">
            {/* Icon area */}
            <div className="relative">
              {/* Sparkles */}
              <div
                className="spark-1 absolute -top-3 left-1/2 -translate-x-6 w-2 h-2 rounded-full"
                style={{ background: "rgba(74,222,128,0.9)" }}
              />
              <div
                className="spark-2 absolute -top-5 left-1/2 translate-x-2 w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.8)" }}
              />
              <div
                className="spark-3 absolute top-1 -right-5 w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(74,222,128,0.75)" }}
              />
              <div
                className="spark-4 absolute top-0 -left-5 w-2 h-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.6)" }}
              />

              {/* Ring */}
              <div
                className="success-ring w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, rgba(74,222,128,0.22), rgba(74,222,128,0.06))",
                  border: "1.5px solid rgba(74,222,128,0.4)",
                  boxShadow:
                    "0 0 0 6px rgba(74,222,128,0.06), 0 0 32px rgba(74,222,128,0.15)",
                }}
              >
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline
                    className="success-check"
                    points="8,20 16,28 30,12"
                    stroke="rgb(74,222,128)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="success-title text-2xl font-semibold text-white tracking-tight">
                Bank Details Saved
              </h2>
              <p className="success-sub text-sm text-zinc-400 leading-relaxed max-w-[260px]">
                Your account information has been securely updated.
              </p>
            </div>

            {/* Pills */}
            <div className="success-pills flex flex-wrap gap-2 justify-center">
              {["Account Linked"].map((label) => (
                <span
                  key={label}
                  className="text-[11px] font-medium px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    color: "rgb(134,239,172)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Copy Referral Code Button */}
            <div className="success-btn w-full space-y-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                Your Referral Code
              </p>

              <button
                onClick={handleCopy}
                key={copied ? "copied" : "copy"}
                className={`copy-pop w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors duration-200 group ${
                  copied
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                {/* Code text */}
                <span
                  className="code-reveal font-mono font-semibold text-sm tracking-[0.12em]"
                  style={{
                    color: copied ? "rgb(134,239,172)" : "rgb(228,228,231)",
                  }}
                >
                  {data?.referralCode}
                </span>

                {/* Icon + label */}
                <span
                  className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors duration-200 shrink-0 ml-3"
                  style={{
                    color: copied ? "rgb(134,239,172)" : "rgb(161,161,170)",
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={13} strokeWidth={2.5} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} strokeWidth={2} />
                      Copy
                    </>
                  )}
                </span>
              </button>

              {/* Subtle hint */}
              <p className="text-[10px] text-zinc-600 text-center">
                Share this code to earn referral rewards
              </p>
            </div>
          </div>

          {/* Progress bar — auto-dismiss indicator */}
          <div className="h-[2px] w-full bg-white/5">
            <div className="progress-bar h-full rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BankSuccessPopup;
