import { useState } from "react";
import { X, Landmark } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const UpdateAccountDetailModal = ({ open, onClose }: Props) => {
  const [accountDetail, setAccountDetail] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validateDetails = () => {
    const err: any = {};

    if (!accountDetail.accountHolderName.trim()) {
      err.accountHolderName = "Account holder name is required";
    }

    if (!accountDetail.accountNumber) {
      err.accountNumber = "Account number is required";
    }

    if (!accountDetail.confirmAccountNumber) {
      err.confirmAccountNumber = "Please confirm your account number";
    } else if (accountDetail.accountNumber !== accountDetail.confirmAccountNumber) {
      err.confirmAccountNumber = "Account numbers do not match";
    }

    if (!accountDetail.ifscCode) {
      err.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(accountDetail.ifscCode.toUpperCase())) {
      err.ifscCode = "Invalid IFSC format (e.g. HDFC0001234)";
    }

    if (!accountDetail.branchName.trim()) {
      err.branchName = "Branch name is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleUpdate = () => {
    if (validateDetails()) {
      console.log("Updating Bank Details:", accountDetail);
      // Add your API call or Redux action here
      onClose();
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
            <h3 className="text-xl font-semibold tracking-tight">Update Bank Details</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          {/* Holder Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Account Holder Name</label>
            <input
              type="text"
              placeholder="e.g. Arjit Singh"
              value={accountDetail.accountHolderName}
              className={`w-full px-4 py-3 rounded-xl bg-black border ${errors.accountHolderName ? 'border-red-500/50' : 'border-zinc-800'} focus:border-zinc-500 outline-none transition-all`}
              onChange={(e) => setAccountDetail({ ...accountDetail, accountHolderName: e.target.value })}
            />
            {errors.accountHolderName && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.accountHolderName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Number */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Account Number</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={accountDetail.accountNumber}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${errors.accountNumber ? 'border-red-500/50' : 'border-zinc-800'} focus:border-zinc-500 outline-none transition-all`}
                onChange={(e) => setAccountDetail({ ...accountDetail, accountNumber: e.target.value })}
              />
              {errors.accountNumber && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.accountNumber}</p>}
            </div>

            {/* Confirm Account Number */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Confirm Number</label>
              <input
                type="text"
                placeholder="Enter again"
                value={accountDetail.confirmAccountNumber}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${errors.confirmAccountNumber ? 'border-red-500/50' : 'border-zinc-800'} focus:border-zinc-500 outline-none transition-all`}
                onChange={(e) => setAccountDetail({ ...accountDetail, confirmAccountNumber: e.target.value })}
              />
              {errors.confirmAccountNumber && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.confirmAccountNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IFSC Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">IFSC Code</label>
              <input
                type="text"
                placeholder="SBIN0001234"
                value={accountDetail.ifscCode}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${errors.ifscCode ? 'border-red-500/50' : 'border-zinc-800'} focus:border-zinc-500 outline-none transition-all uppercase`}
                onChange={(e) => setAccountDetail({ ...accountDetail, ifscCode: e.target.value })}
              />
              {errors.ifscCode && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.ifscCode}</p>}
            </div>

            {/* Branch Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Branch Name</label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={accountDetail.branchName}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${errors.branchName ? 'border-red-500/50' : 'border-zinc-800'} focus:border-zinc-500 outline-none transition-all`}
                onChange={(e) => setAccountDetail({ ...accountDetail, branchName: e.target.value })}
              />
              {errors.branchName && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.branchName}</p>}
            </div>
          </div>
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
            onClick={handleUpdate}
            className="flex-1 px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountDetailModal;