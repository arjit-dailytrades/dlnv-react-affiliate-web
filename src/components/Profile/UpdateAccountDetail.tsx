import { useState } from "react";
import { X, Landmark, Eye, EyeOff } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { showError, showSuccess } from "../common/ToastService";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { getProfile } from "../../features/profileSlice";

type Props = {
  open: boolean;
  onClose: () => void;
  setShowSuccessPopup: (e: boolean) => void;
};

const UpdateAccountDetailModal = ({
  open,
  onClose,
  setShowSuccessPopup,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [accountDetail, setAccountDetail] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    upi: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  const validateField = (name: string, value: string) => {
    let message = "";

    switch (name) {
      case "accountHolderName":
        if (!value.trim()) message = "Account holder name is required";
        break;

      case "accountNumber":
        if (!value) message = "Account number is required";
        break;

      case "confirmAccountNumber":
        if (!value) {
          message = "Please confirm your account number";
        } else if (value !== accountDetail.accountNumber) {
          message = "Account numbers do not match";
        }
        break;

      case "ifscCode":
        if (!value) {
          message = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) {
          message = "Invalid IFSC format (e.g. HDFC0001234)";
        }
        break;

      case "branchName":
        if (!value.trim()) message = "Branch name is required";
        break;

      case "upi":
        if (value && !/^[\w.-]+@[\w.-]+$/.test(value)) {
          message = "Invalid UPI ID (e.g. name@bank)";
        }
        break;
    }

    setErrors((prev: any) => ({
      ...prev,
      [name]: message,
    }));
  };

  const isFormValid =
    accountDetail.accountHolderName &&
    accountDetail.accountNumber &&
    accountDetail.confirmAccountNumber &&
    accountDetail.ifscCode &&
    accountDetail.branchName &&
    Object.values(errors).every((err) => !err);

  const handleResetAndClose = () => {
    setAccountDetail({
      accountHolderName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      branchName: "",
      upi: "",
    });
    setErrors({});
    onClose();
  };

  const updateBankDetail = async () => {
    setIsLoading(true);
    try {
      const payload = {
        accountNumber: accountDetail.accountNumber,
        accountHolderName: accountDetail.accountHolderName,
        ifscCode: accountDetail.ifscCode,
        bankName: accountDetail.branchName,
        ...(accountDetail.upi && { upi: accountDetail.upi }),
      };

      const response = await apiClient({
        method: "patch",
        url: "/affiliate/update-bank-details",
        data: payload,
      });

      showSuccess(response?.data?.message || "Bank details updated");
      handleResetAndClose();
      dispatch(getProfile());
      setShowSuccessPopup(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = () => {
    if (isFormValid) {
      updateBankDetail();
    }
  };

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
            <h3 className="text-xl font-semibold">Update Bank Details</h3>
          </div>
          <button onClick={handleResetAndClose}>
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-8 space-y-3">
          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={accountDetail.accountHolderName}
              className={`w-full px-4 py-3 rounded-xl bg-black border ${
                errors.accountHolderName
                  ? "border-red-500/50"
                  : "border-zinc-800"
              } focus:border-zinc-500 outline-none`}
              onChange={(e) => {
                const value = e.target.value;
                setAccountDetail((p) => ({ ...p, accountHolderName: value }));
                validateField("accountHolderName", value);
              }}
            />
            <p className="text-red-400 text-[10px] mt-1 ml-1 min-h-[14px]">
              {errors.accountHolderName || ""}
            </p>
          </div>

          {/* Account Numbers */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Account Number */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Account Number
              </label>
              <div className="relative">
                <input
                  type={showAccountNumber ? "text" : "password"}
                  value={accountDetail.accountNumber}
                  className={`w-full px-4 py-3 pr-10 rounded-xl bg-black border ${
                    errors.accountNumber
                      ? "border-red-500/50"
                      : "border-zinc-800"
                  } focus:border-zinc-500 outline-none`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setAccountDetail((p) => ({ ...p, accountNumber: value }));
                    validateField("accountNumber", value);
                    validateField(
                      "confirmAccountNumber",
                      accountDetail.confirmAccountNumber,
                    );
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowAccountNumber((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showAccountNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-red-400 text-[10px] mt-1 ml-1 min-h-[14px]">
                {errors.accountNumber || ""}
              </p>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Confirm Number
              </label>
              <input
                type="password"
                value={accountDetail.confirmAccountNumber}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${
                  errors.confirmAccountNumber
                    ? "border-red-500/50"
                    : "border-zinc-800"
                } focus:border-zinc-500 outline-none`}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAccountDetail((p) => ({
                    ...p,
                    confirmAccountNumber: value,
                  }));
                  validateField("confirmAccountNumber", value);
                }}
              />
              <p className="text-red-400 text-[10px] mt-1 ml-1 min-h-[14px]">
                {errors.confirmAccountNumber || ""}
              </p>
            </div>
          </div>

          {/* UPI */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              UPI ID (Optional)
            </label>
            <input
              type="text"
              value={accountDetail.upi}
              className={`w-full px-4 py-3 rounded-xl bg-black border ${
                errors.upi ? "border-red-500/50" : "border-zinc-800"
              } focus:border-zinc-500 outline-none`}
              onChange={(e) => {
                const value = e.target.value;
                setAccountDetail((p) => ({ ...p, upi: value }));
                validateField("upi", value);
              }}
            />
            <p className="text-red-400 text-[10px] mt-1 ml-1 min-h-[14px]">
              {errors.upi || ""}
            </p>
          </div>

          {/* IFSC + Branch */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                IFSC Code
              </label>
              <input
                value={accountDetail.ifscCode.toUpperCase()}
                maxLength={11}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${
                  errors.ifscCode ? "border-red-500/50" : "border-zinc-800"
                } focus:border-zinc-500 outline-none`}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().slice(0, 11);
                  setAccountDetail((p) => ({ ...p, ifscCode: value }));
                  validateField("ifscCode", value);
                }}
              />
              <p className="text-red-400 text-[10px] mt-1 ml-1 min-h-[14px]">
                {errors.ifscCode || ""}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Branch Name
              </label>
              <input
                value={accountDetail.branchName}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${
                  errors.branchName ? "border-red-500/50" : "border-zinc-800"
                } focus:border-zinc-500 outline-none`}
                onChange={(e) => {
                  const value = e.target.value;
                  setAccountDetail((p) => ({ ...p, branchName: value }));
                  validateField("branchName", value);
                }}
              />
              <p className="text-red-400 text-[10px] mt-1 ml-1 min-h-[14px]">
                {errors.branchName || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3 border-t border-white/5">
          <button
            onClick={handleResetAndClose}
            className="flex-1 px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={!isFormValid || isLoading}
            className={`flex-1 px-4 py-2 rounded-xl font-bold transition-all ${
              !isFormValid || isLoading
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountDetailModal;
