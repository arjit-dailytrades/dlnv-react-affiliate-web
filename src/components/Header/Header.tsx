import { Menu, CircleUserRound, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import { useEffect, useRef, useState } from "react";
import { logout } from "../../utils/auth";

type HeaderProps = {
  onMenuClick: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const { data: user } = useSelector(
    (state: RootState) => state.profile,
  );
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const formatName = (name: string) => {
    return name.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getInitials = (name: string) => {
    if (!name) return "U";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 
    border-b border-gray-800 text-white backdrop-blur-md h-[77px]"
    >
      <div className="flex flex-col px-6 py-4 max-w-[1600px] mx-auto gap-2">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white"
            >
              <Menu size={20} />
            </button>

            {/* Logo + Title */}
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black rotate-45 rounded-sm" />
              </div> */}

              <h1 className="text-lg font-bold tracking-tight">
                {formatName(pathnames[0])} /{" "}
                {pathnames.length
                  ? formatName(pathnames[pathnames.length - 1])
                  : "Dashboard"}
              </h1>
            </div>
          </div>

          {/* Right (Only Profile) */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-full hover:bg-gray-800 transition border border-transparent hover:border-gray-700"
            >
              <div className="relative">
                {user?.dp ? (
                  <img
                    src={user?.dp}
                    alt="user"
                    className="w-9 h-9 rounded-full border border-gray-700 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border border-gray-700 bg-zinc-800 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {getInitials(user?.name || "")}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
              </div>
            </button>
            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B1120] text-white rounded-xl shadow-xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-700">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-400 break-words">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/affiliate/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center gap-2"
                >
                  <CircleUserRound size={20} /> Profile
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-4 py-2 hover:bg-red-600 rounded-b-xl flex items-center gap-2"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
