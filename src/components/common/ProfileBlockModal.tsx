import { ShieldAlert, Phone, LogOutIcon } from "lucide-react";
import { logout } from "../../utils/auth";
import { useDispatch } from "react-redux";
import { closeProfileBlockedModal } from "../../features/uiSlice";

type Props = {
  isOpen: boolean;
  reason?: string;
};

const ProfileBlockedModal = ({ isOpen, reason }: Props) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(closeProfileBlockedModal());
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="w-[90%] max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <ShieldAlert className="text-red-400" size={28} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-2">
          Profile Blocked
        </h2>

        {/* Description */}
        {!reason ? (
          <p className="text-sm text-zinc-400 mb-6">
            Your account has been temporarily blocked. Please contact our
            support team to resolve this issue.
          </p>
        ) : (
          <p className="text-sm text-zinc-400 mb-6">{reason}</p>
        )}

        {/* Actions */}

        <div className="flex flex-col gap-4 w-full">
          {/* Contact Info Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 text-sm">
            {/* Email */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email</span>
              <a
                href="mailto:support@dailytrades.in"
                className="text-white hover:text-red-400 transition"
              >
                support@dailytrades.in
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Phone</span>
              <a
                href="tel:+919220398500"
                className="text-white hover:text-red-400 transition flex items-center gap-1"
              >
                <Phone size={14} />
                +91-9220398500
              </a>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl 
    bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition shadow-sm"
          >
            <LogOutIcon size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlockedModal;
