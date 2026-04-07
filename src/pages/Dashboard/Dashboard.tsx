import { TrendingUp, IndianRupee, Activity, Users } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹24,500",
    icon: IndianRupee,
  },
  {
    title: "Active Trades",
    value: "12",
    icon: Activity,
  },
  {
    title: "Profit",
    value: "+₹8,240",
    icon: TrendingUp,
  },
  {
    title: "Users",
    value: "1,240",
    icon: Users,
  },
];

const activities = [
  {
    id: 1,
    title: "Payment Received",
    desc: "₹999 via UPI",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "New User Registered",
    desc: "Arjit Singh",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "Trade Closed",
    desc: "TCS Profit +₹1200",
    time: "30 min ago",
  },
];

const Dashboard = () => {

  return (
    <div className="text-white space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="md:p-4 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 hover:scale-[1.02] transition-all shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                  <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Performance Card */}
        <div className="xl:col-span-2 border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>

          {/* Fake Chart */}
          <div className="h-64 flex items-end gap-2">
            {[40, 60, 30, 80, 50, 70, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-white to-zinc-400 rounded-md transition-all duration-500 hover:opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Right: Activity */}
        <div className="border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4">
            {activities.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start border-b border-zinc-800 pb-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
