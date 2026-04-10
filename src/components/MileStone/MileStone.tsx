import { useState } from "react";

const cycles = [
  {
    id: 1,
    tier: "Starter",
    tierColor: "bg-emerald-400 text-black",
    status: "Completed",
    statusColor: "bg-emerald-900 text-emerald-300 border border-emerald-600",
    cycleLabel: "Cycle 1",
    registrations: 100,
    target: 100,
    regBonus: "₹1,000",
    subPayout: "₹6,000",
    subUsers: 60,
    borderColor: "border-emerald-500",
    progressColor: "bg-gradient-to-r from-blue-400 to-blue-500",
    progressBg: "bg-gray-700",
    locked: false,
    completed: true,
    subHighlight: false,
  },
  {
    id: 2,
    tier: "Silver",
    tierColor: "bg-slate-300 text-black",
    status: "Active cycle",
    statusColor: "bg-blue-900 text-blue-300 border border-blue-500",
    cycleLabel: "Cycle 2",
    registrations: 250,
    target: 400,
    regBonus: "₹10,000",
    subPayout: "-₹30,000",
    subUsers: 150,
    borderColor: "border-blue-500",
    progressColor: "bg-gradient-to-r from-green-400 to-green-500",
    progressBg: "bg-gray-700",
    locked: false,
    completed: false,
    subHighlight: true,
  },
  {
    id: 3,
    tier: "Gold",
    tierColor: "bg-yellow-400 text-black",
    status: "Locked",
    statusColor: "bg-gray-700 text-gray-400 border border-gray-600",
    cycleLabel: "Cycle 3",
    registrations: 0,
    target: 500,
    regBonus: "₹25,000",
    subPayout: "₹0",
    subUsers: 0,
    borderColor: "border-gray-700",
    progressColor: "bg-gray-600",
    progressBg: "bg-gray-800",
    locked: true,
    completed: false,
    subHighlight: false,
  },
  {
    id: 4,
    tier: "Diamond",
    tierColor: "bg-purple-400 text-black",
    status: "Locked",
    statusColor: "bg-gray-700 text-gray-400 border border-gray-600",
    cycleLabel: "Cycle 4",
    registrations: 0,
    target: 9000,
    regBonus: "Contact sales",
    subPayout: "₹0",
    subUsers: 0,
    borderColor: "border-gray-700",
    progressColor: "bg-gray-600",
    progressBg: "bg-gray-800",
    locked: true,
    completed: false,
    subHighlight: false,
  },
  {
    id: 5,
    tier: "Legend",
    tierColor: "bg-orange-400 text-black",
    status: "Locked",
    statusColor: "bg-gray-700 text-gray-400 border border-gray-600",
    cycleLabel: "Cycle 5",
    registrations: 0,
    target: 40000,
    regBonus: "Contact sales",
    subPayout: "₹0",
    subUsers: 0,
    borderColor: "border-gray-700",
    progressColor: "bg-gray-600",
    progressBg: "bg-gray-800",
    locked: true,
    completed: false,
    subHighlight: false,
  },
];

function formatNum(n: any) {
  return n.toLocaleString("en-IN");
}

export default function MileStone() {
  const [simRegistrations, setSimRegistrations] = useState(350);
  const [subRate, setSubRate] = useState(60);

  const totalSubscriptions = Math.round((simRegistrations * subRate) / 100);
  const totalEarned = 37000;

  return (
    <div className="min-h-screen font-mono ">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-6 sm:mb-8">
        {[
          { label: "Total registrations", value: formatNum(simRegistrations) },
          {
            label: "Total subscriptions",
            value: formatNum(totalSubscriptions),
          },
          { label: "Total earned", value: `₹${formatNum(totalEarned)}` },
        ].map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-gray-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1 leading-tight">
              {stat.label}
            </p>
            <p className="text-white text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        {/* Registrations slider */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-gray-400 text-xs sm:text-sm w-full sm:w-48 shrink-0">
            Registrations simulate:
          </span>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="range"
              min={0}
              max={1000}
              value={simRegistrations}
              onChange={(e) => setSimRegistrations(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-white"
            />
            <span className="text-white text-xs sm:text-sm w-12 text-right tabular-nums">
              {simRegistrations}
            </span>
          </div>
        </div>
        {/* Subscription rate slider */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-gray-400 text-xs sm:text-sm w-full sm:w-48 shrink-0">
            Subscription rate:
          </span>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="range"
              min={0}
              max={100}
              value={subRate}
              onChange={(e) => setSubRate(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-white"
            />
            <span className="text-white text-xs sm:text-sm w-12 text-right tabular-nums">
              {subRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Cycle Cards */}
      <div className="space-y-0">
        {cycles.map((cycle, idx) => {
          const pct =
            cycle.target > 0
              ? Math.min(
                  100,
                  Math.round((cycle.registrations / cycle.target) * 100),
                )
              : 0;

          return (
            <div key={cycle.id} className="relative">
              {/* Connector line */}
              {idx < cycles.length - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-px h-4 bg-gray-600 z-10" />
              )}

              <div
                className={`border ${cycle.borderColor} rounded-xl p-3 sm:p-5 mb-4 transition-opacity duration-200 ${
                  cycle.locked ? "opacity-60" : "opacity-100"
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${cycle.tierColor}`}
                    >
                      {cycle.tier}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${cycle.statusColor}`}
                    >
                      {cycle.status}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    {cycle.cycleLabel}
                  </span>
                </div>

                {/* Registration count + progress */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs sm:text-sm text-gray-300">
                      Registrations:{" "}
                      <span className="text-white font-semibold">
                        {formatNum(cycle.registrations)} /{" "}
                        {formatNum(cycle.target)}
                      </span>
                    </p>
                    <span className="text-xs text-gray-400">{pct}%</span>
                  </div>
                  <div
                    className={`h-2 rounded-full w-full ${cycle.progressBg}`}
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${cycle.progressColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {/* Target registrations */}
                  <div className="bg-gray-800 rounded-lg p-2.5 sm:p-3">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1">
                      Target registrations
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      {formatNum(cycle.target)}
                    </p>
                  </div>

                  {/* Registration bonus */}
                  <div className="bg-gray-800 rounded-lg p-2.5 sm:p-3">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1">
                      Registration bonus
                    </p>
                    <p className="text-white text-sm sm:text-base font-bold">
                      {cycle.regBonus}
                    </p>
                  </div>

                  {/* Sub. payout */}
                  <div
                    className={`rounded-lg p-2.5 sm:p-3 ${
                      cycle.subHighlight
                        ? "bg-yellow-950 border border-yellow-700"
                        : "bg-gray-800"
                    }`}
                  >
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1">
                      Sub. payout{" "}
                      {cycle.subUsers > 0 && (
                        <span className="text-gray-500">
                          ({cycle.subUsers} users)
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-sm sm:text-base font-bold ${
                        cycle.subHighlight ? "text-yellow-300" : "text-white"
                      }`}
                    >
                      {cycle.subPayout}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
