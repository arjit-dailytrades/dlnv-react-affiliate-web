import { ShieldAlert, Mail, LogOut } from "lucide-react";
import { logout } from "../../utils/auth";

type Props = {
  isOpen: boolean;
  reason?: string;
};

const ProfileBlockedModal = ({ isOpen, reason }: Props) => {
  if (!isOpen) return null;

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
        <div className="flex flex-col gap-3">
          {/* Contact Support */}
          <button
            onClick={() => {
              window.location.href = "mailto:support@dailytrades.com";
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg 
            bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium transition"
          >
            <Mail size={16} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlockedModal;
