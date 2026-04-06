import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useState } from "react";

function MainDashboard() {
  const [open, setOpen] = useState(false);
  const handleMenuToggle = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="flex">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="h-[77px] flex-shrink-0">
          <Header onMenuClick={handleMenuToggle} />
        </div>
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ height: "calc(100vh - 77px)" }}
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainDashboard;
