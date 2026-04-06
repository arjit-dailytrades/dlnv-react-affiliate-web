import { Menu, ChevronDown } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";

type HeaderProps = {
  onMenuClick: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const formatName = (name: string) => {
    return name.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

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
          <button
            onClick={() => navigate("profile")}
            className="flex items-center gap-3 rounded-full hover:bg-gray-800 transition border border-transparent hover:border-gray-700"
          >
            {/* <div className="flex flex-col items-end hidden md:flex">
              <span className="text-xs font-semibold text-white">Arjit</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Admin
              </span>
            </div> */}

            <div className="relative">
              <img
                src="https://i.pravatar.cc/40"
                alt="user"
                className="w-9 h-9 rounded-full border border-gray-700"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
            </div>

            {/* <ChevronDown size={14} className="text-gray-500 hidden md:block" /> */}
          </button>
        </div>

        {/* Breadcrumbs */}
        {/* <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>

          {pathnames.map((value, index) => {
            const to = "/" + pathnames.slice(0, index + 1).join("/");

            return (
              <div key={to} className="flex items-center gap-2">
                <span>/</span>
                <Link
                  to={to}
                  className="hover:text-white capitalize transition"
                >
                  {formatName(value)}
                </Link>
              </div>
            );
          })}
        </div> */}
      </div>
    </header>
  );
};

export default Header;
