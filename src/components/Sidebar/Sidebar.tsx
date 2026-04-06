import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  X,
  ArrowLeftRight,
  Milestone,
} from "lucide-react";
import Logo from "../../assets/appLogo.png";

const menuItems = [
  { name: "Dashboard", path: "dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "profile", icon: User },
  { name: "Transaction History", path: "transactions", icon: ArrowLeftRight },
  { name: "Milestones", path: "milestones", icon: Milestone },
  { name: "Settings", path: "settings", icon: Settings },
];

const Sidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 
        bg-gradient-to-b from-black via-gray-900 to-black 
        backdrop-blur-md
        text-gray-400 border-r border-gray-800 shadow-2xl z-50 
        transform transition-all duration-500 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[4] border-b border-gray-800 h-[77px]">
          {/* <h1 className="text-2xl font-black tracking-tighter text-white italic">
            DailyTrades<span className="text-gray-500"></span>
          </h1> */}
          <div className="flex justify-center items-center w-full">
            <img src={Logo} alt="DailyTrades" className="h-[50px] w-auto" />
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 hover:bg-gray-800 rounded-full transition text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-4 py-6 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-white to-gray-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.02]"
                      : "hover:bg-gray-800/60 hover:text-gray-100"
                  }`
                }
              >
                <Icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-medium tracking-wide">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-8 w-full px-4">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

          <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 border border-transparent hover:border-red-500/20">
            <LogOut size={22} />
            <span className="font-medium uppercase text-sm tracking-widest">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
