import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CompleteProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleCompleteClick = () => {
    onClose();
    navigate("/affiliate/profile#complete-profile");

    setTimeout(() => {
      const element = document.getElementById("complete-profile");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-6 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-3 text-white">
          Complete Your Profile
        </h2>
        <p className="text-gray-400 mb-6">
          Your account details are incomplete. Please complete your profile to
          unlock all features and continue using the platform smoothly.
        </p>

        {/* Action Link Button */}
        <button
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl 
    bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition shadow-sm"
          onClick={handleCompleteClick}
        >
          Complete Account Details
        </button>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
