import { Landmark, X } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const UpdatePasswordModal = ({ open, onClose }: Props) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validatePassword = () => {
    const err: any = {};

    if (!passwordData.oldPassword) {
      err.oldPassword = "Old password required";
    }

    if (!passwordData.newPassword) {
      err.newPassword = "New password required";
    } else if (passwordData.newPassword.length < 6) {
      err.newPassword = "Minimum 6 characters";
    }

    if (!passwordData.confirmPassword) {
      err.confirmPassword = "Confirm password required";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePasswordUpdate = () => {
    if (validatePassword()) {
      console.log("Update Password", passwordData);

      // reset + close
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    }
  };

  // ❗ Important: don't render if not open
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-[600px] text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Landmark size={18} className="text-black" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">
              Update Bank Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          {/* Old Password */}
          <input
            type="password"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                oldPassword: e.target.value,
              })
            }
          />
          {errors.oldPassword && (
            <p className="text-red-400 text-xs">{errors.oldPassword}</p>
          )}

          {/* New Password */}
          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
          />
          {errors.newPassword && (
            <p className="text-red-400 text-xs">{errors.newPassword}</p>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordData.confirmPassword}
            className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800"
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 font-semibold hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handlePasswordUpdate}
            className="flex-1 px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
