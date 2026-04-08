import {
  UserRoundKey,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { showError, showSuccess } from "../common/ToastService";
import axios from "axios";
import { environment } from "../../environments/environment";
import { apiClient } from "../../api/apiClient";

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Live Validation Logic
  useEffect(() => {
    const err: Record<string, string> = {};

    if (touched.oldPassword && !passwordData.oldPassword)
      err.oldPassword = "Old password is required";

    if (touched.newPassword) {
      if (!passwordData.newPassword)
        err.newPassword = "New password is required";
      else if (passwordData.newPassword.length < 8)
        err.newPassword = "Minimum 8 characters required";
    }

    if (touched.confirmPassword) {
      if (!passwordData.confirmPassword)
        err.confirmPassword = "Please confirm your password";
      else if (passwordData.newPassword !== passwordData.confirmPassword)
        err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
  }, [passwordData, touched]);

  // 2. Button Disable Logic (useMemo for performance)
  const isFormInvalid = useMemo(() => {
    return (
      !passwordData.oldPassword ||
      passwordData.newPassword.length < 8 ||
      passwordData.newPassword !== passwordData.confirmPassword ||
      Object.keys(errors).length > 0
    );
  }, [passwordData, errors]);

  const handleInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleResetAndClose = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setTouched({});
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      const response = await apiClient({
        method: "post",
        url: "/affiliate/update-password",
        data: {
          oldPassword: passwordData.oldPassword,
          password: passwordData.newPassword,
        },
      });

      showSuccess(response?.data?.message || "Password updated successfully");

      handleResetAndClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    updatePassword();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-[500px] text-white overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <UserRoundKey size={18} className="text-black" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">
              Update Password
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-2 max-h-[70vh] overflow-y-auto"
        >
          {/* Input Fields Container */}
          {[
            {
              id: "oldPassword",
              label: "Old Password",
              value: passwordData.oldPassword,
              show: showOldPassword,
              setShow: setShowOldPassword,
            },
            {
              id: "newPassword",
              label: "New Password",
              value: passwordData.newPassword,
              show: showNewPassword,
              setShow: setShowNewPassword,
            },
            {
              id: "confirmPassword",
              label: "Confirm New Password",
              value: passwordData.confirmPassword,
              show: showConfirmPassword,
              setShow: setShowConfirmPassword,
            },
          ].map((field) => (
            <div key={field.id}>
              <div className="relative group">
                <input
                  type={field.show ? "text" : "password"}
                  placeholder={field.label}
                  value={field.value}
                  onBlur={() => handleBlur(field.id)}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-black border transition-all outline-none ${
                    errors[field.id]
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-zinc-800 focus:border-zinc-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => field.setShow(!field.show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="h-6 mt-1 ml-1">
                {errors[field.id] && (
                  <p className="text-red-400 text-[11px] font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle size={12} /> {errors[field.id]}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 font-semibold hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormInvalid || loading}
              className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
