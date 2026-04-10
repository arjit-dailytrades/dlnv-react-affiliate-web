import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  User as UserIcon,
  CreditCard,
  Hash,
  Code,
  MapPin,
  Pencil,
  RectangleEllipsis,
  Ticket,
  Check,
  Copy,
  LoaderIcon,
  Landmark,
} from "lucide-react";
import UpdatePasswordModal from "../../components/Profile/UpdatePasswordModal";
import UpdateAccountDetailModal from "../../components/Profile/UpdateAccountDetail";
import { showError, showSuccess } from "../../components/common/ToastService";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  resetProfileState,
  UpdateProfile,
} from "../../features/profileSlice";
import type { AppDispatch, RootState } from "../../app/store";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user, loading } = useSelector(
    (state: RootState) => state.profile,
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showSuccess("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const bankInfo = {
    holderName: "Arjit Singh",
    accountNumber: "98765432101234",
    ifscCode: "HDFC0001234",
    branch: "Mumbai Main Branch Mumbai Main Branch",
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountDetailModal, setShowAccountDetailModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showError("File size should not exceed 2MB");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      showError("Only JPG, JPEG, PNG, webp files are allowed");
      return;
    }

    dispatch(UpdateProfile(file));
  };

  const { upLoadingProfile, updateSuccess, updateError } = useSelector(
    (state: RootState) => state.profile,
  );

  useEffect(() => {
    if (updateSuccess) {
      showSuccess("Profile updated successfully");
    }

    if (updateError) {
      showError(updateError);
    }
  }, [updateSuccess, updateError]);
  useEffect(() => {
    if (updateSuccess || updateError) {
      const timer = setTimeout(() => {
        dispatch(resetProfileState());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, updateError]);
  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <div className="text-white">
      {/* User Detail */}
      <div className="mx-auto">
        {/* Main Profile Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 border border-white/5 rounded-[2rem] p-3 md:p-6 backdrop-blur-xl shadow-2xl">
          {/* Left Section: Avatar (Matching Image Style) */}
          <div className="relative group">
            {/* Hidden Input */}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-1 bg-gradient-to-tr from-zinc-700 via-white to-zinc-700 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-black bg-zinc-800 flex items-center justify-center">
                {user?.dp ? (
                  <img
                    src={user.dp}
                    alt="Profile"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <span className="text-white text-5xl font-semibold">
                    {getInitials(user?.name || "")}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleClick}
              className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              {upLoadingProfile ? <LoaderIcon /> : <Camera size={20} />}
            </button>
          </div>

          {/* Right Section: Info & Fields */}
          <div className="flex-1 w-full space-y-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-light tracking-tight text-white">
                  My Details
                </h1>
                {/* <ShieldCheck className="text-zinc-500" size={24} /> */}
              </div>
            </div>

            {/* Form Style Fields (Matching Field 1, 2, 3 Layout) */}
            <div className="space-y-6">
              {/* Field 1: Name */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-24 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Name
                </label>
                <div className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3">
                  <UserIcon size={16} className="text-zinc-600" />
                  <span className="font-medium">{user?.name}</span>
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-24 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Email
                </label>
                <div className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3">
                  <Mail size={16} className="text-zinc-600" />
                  <span className="font-medium">{user?.email}</span>
                </div>
              </div>

              {/* Field 3: Mobile */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-24 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Mobile
                </label>
                <div className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3">
                  <Phone size={16} className="text-zinc-600" />
                  <span className="font-medium">{user?.mobile}</span>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-1.5">
                <span className="text-[12px] uppercase tracking-[0.2em] text-zinc-400 font-bold ml-1">
                  Your Referral Code
                </span>
                <button
                  onClick={() => handleCopy(user?.referralCode || "")}
                  className="relative group flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 hover:border-white/20 transition-all overflow-hidden"
                >
                  {/* Background Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-center gap-10">
                    <Ticket
                      size={18}
                      className="text-zinc-500 group-hover:text-white transition-colors"
                    />

                    <span className="text-lg font-mono font-bold tracking-wider text-white">
                      {user?.referralCode || "------"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center ml-2 pl-4 border-l border-zinc-800">
                    {copied ? (
                      <Check
                        size={18}
                        className="text-green-500 animate-in zoom-in"
                      />
                    ) : (
                      <Copy
                        size={18}
                        className="text-zinc-500 group-hover:text-white transition-colors"
                      />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full md:w-auto group flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <RectangleEllipsis />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}

      <div className="mx-auto mt-4">
        <div className="border border-white/5 rounded-[2rem] p-4 md:p-6 backdrop-blur-xl shadow-2xl">
          {!user?.bankDetails ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4">
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 mb-4">
                <Landmark className="text-zinc-400" size={24} />
              </div>

              {/* Heading */}
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                No Bank Account Added
              </h2>

              {/* Description */}
              <p className="text-zinc-500 text-sm mt-2 max-w-md">
                Add your bank account details to enable smooth withdrawals and
                settlements. This will be your primary destination for payouts.
              </p>

              {/* Button */}
              <button
                onClick={() => setShowAccountDetailModal(true)}
                className="mt-6 group flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <Pencil size={18} />
                Add Account Details
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 space-y-1">
                {/* Header Section */}
                <div className="mb-8 space-y-1">
                  <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                    Bank Account
                  </h1>
                  <p className="text-zinc-500 text-sm font-medium tracking-wide">
                    Manage your settlement destination
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Field 1: Account Holder Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                      Holder Name
                    </label>
                    <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                      <CreditCard size={16} className="text-zinc-600" />
                      <span className="font-medium truncate">
                        {user?.bankDetails?.accountHolderName}
                      </span>
                    </div>
                  </div>

                  {/* Field 2: Account Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                      Account No.
                    </label>
                    <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                      <Hash size={16} className="text-zinc-600" />
                      <span className="font-mono tracking-wider truncate">
                        {user?.bankDetails?.accountNumber}
                      </span>
                    </div>
                  </div>
                  {/* UPI id */}
                  {user?.bankDetails?.upi && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                        UPI Id
                      </label>
                      <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                        <Hash size={16} className="text-zinc-600" />
                        <span className="font-mono tracking-wider truncate">
                          {user?.bankDetails?.upi}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Field 3: IFSC Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                      IFSC Code
                    </label>
                    <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                      <Code size={16} className="text-zinc-600" />
                      <span className="font-mono uppercase truncate">
                        {user?.bankDetails?.ifscCode}
                      </span>
                    </div>
                  </div>

                  {/* Field 4: Branch */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                      Branch
                    </label>
                    <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                      <MapPin size={16} className="text-zinc-600" />
                      <span className="font-medium truncate">
                        {user?.bankDetails?.bankName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    disabled={user?.bankDetails}
                    style={{ opacity: user?.bankDetails ? ".5" : "1" }}
                    onClick={() => setShowAccountDetailModal(true)}
                    className="w-full md:w-auto group flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <Pencil size={18} />
                    Update Account Details
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <UpdatePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      <UpdateAccountDetailModal
        open={showAccountDetailModal}
        onClose={() => setShowAccountDetailModal(false)}
      />
    </div>
  );
};

export default Profile;
