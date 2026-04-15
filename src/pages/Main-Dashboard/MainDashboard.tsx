import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import ProfileBlockedModal from "../../components/common/ProfileBlockModal";
import CompleteProfileModal from "../../components/common/CompleteProfileModal";
import { closeCompleteProfileModal } from "../../features/profileSlice";
import { openProfileBlockedModal } from "../../features/uiSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";

function MainDashboard() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isProfileBlocked, blockedNote, completeProfileModalOpen } =
    useSelector((state: RootState) => state.profile);

  const { isProfileBlockedModalOpen } = useSelector(
    (state: RootState) => state.ui,
  );
  

  useEffect(() => {
    if (isProfileBlocked) {
      dispatch(openProfileBlockedModal());
    }
  }, [isProfileBlocked, dispatch]);

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
      <ProfileBlockedModal
        isOpen={isProfileBlockedModalOpen}
        reason={blockedNote}
      />

      <CompleteProfileModal
        isOpen={completeProfileModalOpen ?? false}
        onClose={() => dispatch(closeCompleteProfileModal())}
      />
    </div>
  );
}

export default MainDashboard;
