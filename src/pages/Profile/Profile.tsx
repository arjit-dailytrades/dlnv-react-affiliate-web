import { useRef, useState } from "react";
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
} from "lucide-react";
import UpdatePasswordModal from "../../components/Profile/UpdatePasswordModal";
import UpdateAccountDetailModal from "../../components/Profile/UpdateAccountDetail";
import { showSuccess } from "../../components/common/ToastService";

type User = {
  name: string;
  email: string;
  mobile: string;
  profileCompleted: boolean;
};

const Profile = () => {
  const [user] = useState<User>({
    name: "Arjit Singh",
    email: "arjit@gmail.com",
    mobile: "9876543210",
    profileCompleted: false,
  });

  const bankInfo = {
    holderName: "Arjit Singh",
    accountNumber: "98765432101234",
    ifscCode: "HDFC0001234",
    branch: "Mumbai Main Branch",
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountDetailModal, setShowAccountDetailModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
    showSuccess("Select image to upload");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };
  return (
    <div className="text-white">
      {/* User Detail */}
      <div className="mx-auto">
        {/* Main Profile Container */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 border border-white/5 rounded-[2rem] p-3 md:p-6 backdrop-blur-xl shadow-2xl">
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
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-black bg-zinc-800">
                <img
                  src="https://i.pravatar.cc/300"
                  alt="Profile"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
            <button
              onClick={handleClick}
              className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={20} />
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
                  <span className="font-medium">{user.name}</span>
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-24 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Email
                </label>
                <div className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3">
                  <Mail size={16} className="text-zinc-600" />
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>

              {/* Field 3: Mobile */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="w-24 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Mobile
                </label>
                <div className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3">
                  <Phone size={16} className="text-zinc-600" />
                  <span className="font-medium">{user.mobile}</span>
                </div>
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
        {/* Main Container */}
        <div className="border border-white/5 rounded-[2rem] p-3 md:p-6 backdrop-blur-xl shadow-2xl">
          {/* Header Section */}
          <div className="mb-8 space-y-1">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">
              Bank Account
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-wide">
              Manage your settlement destination
            </p>
          </div>

          {/* Fields Grid: 1 col on mobile, 2 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Field 1: Account Holder Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                Holder Name
              </label>
              <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                <CreditCard size={16} className="text-zinc-600" />
                <span className="font-medium truncate">
                  {bankInfo.holderName}
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
                  {bankInfo.accountNumber}
                </span>
              </div>
            </div>

            {/* Field 3: IFSC Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                IFSC Code
              </label>
              <div className="bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 flex items-center gap-3 focus-within:border-zinc-600 transition-colors">
                <Code size={16} className="text-zinc-600" />
                <span className="font-mono uppercase truncate">
                  {bankInfo.ifscCode}
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
                <span className="font-medium truncate">{bankInfo.branch}</span>
              </div>
            </div>
          </div>

          {/* Update Button - Full width on mobile, auto width on desktop */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAccountDetailModal(true)}
              className="w-full md:w-auto group flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Pencil size={18} />
              Update Account Details
            </button>
          </div>
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
