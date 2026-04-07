import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  MoveRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import Logo from "../../assets/appLogo.png";
import axios from "axios";
import { environment } from "../../environments/environment";
import { showError, showSuccess } from "../../components/common/ToastService";

const API_AUTH = `${environment.apiBase}/affiliate/auth`;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ email: "", token: "" });

  const getErrorMessage = (err: any) =>
    err.response?.data?.message ||
    err.message ||
    "An unexpected error occurred.";

  const hasCalled = useRef(false);

  const validateInitialToken = useCallback(async () => {
    if (hasCalled.current) return; // रोक देगा second call
    hasCalled.current = true;

    const urlToken = searchParams.get("affv_t");

    if (!urlToken) {
      setStatus("error");
      setMessage("Verification token is missing from the link.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${API_AUTH}/get-token/?token=${urlToken}`);

      if (res?.status === 200 && res?.data?.token) {
        const tokenData = res.data.token;

        setData({
          email: tokenData.email || "",
          token: tokenData.token || "",
        });

        setStatus(tokenData.status ? "success" : "error");
      } else {
        throw new Error("Invalid token response");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(getErrorMessage(err));
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [searchParams]);

  useEffect(() => {
    validateInitialToken();
  }, [validateInitialToken]);

  const handleFinalizeVerification = async () => {
    if (!data.token) {
      showError("Verification token not found. Please try again.");
      return;
    }

    try {
      setIsVerifying(true);
      const { data: res } = await axios.get(
        `${API_AUTH}/verify-email/?token=${data.token}`,
      );

      showSuccess(res?.message || "Email verified successfully!");
      navigate("/login");
    } catch (err: any) {
      const errMsg = getErrorMessage(err);
      showError(errMsg);
      setStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    console.log(data, "========data");

    if (!data.email) {
      showError("Email address not found. Please contact support.");
      return;
    }

    try {
      const { data: res } = await axios.post(
        `${API_AUTH}/resend-verification-email`,
        {
          email: data.email,
        },
      );

      if (res?.success) {
        showSuccess(res.message || "New verification link sent to your email!");
      }
    } catch (err: any) {
      showError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md backdrop-blur-md border border-white/[0.08] rounded-3xl shadow-2xl p-8 bg-white/[0.02]">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Logo" className="h-20 object-contain" />
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h5 className="text-xl font-semibold text-white">
              Validating Link...
            </h5>
            <p className="text-zinc-400 mt-2 text-sm">One moment please.</p>
          </div>
        ) : status === "success" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">
                Welcome to DailyTrades!
              </h2>
            </div>

            <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-2xl border border-white/5 text-sm text-zinc-400">
              <p className="text-zinc-300 font-medium">Ready to start?</p>
              {[
                "Complete your profile",
                "Share your expertise and insights",
                "Make a meaningful impact",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold">
                    <Check />
                  </span>{" "}
                  {item}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={isVerifying}
                onClick={() => navigate("/login")}
                className="py-3 rounded-xl border border-zinc-700 text-zinc-400 font-medium hover:bg-white/5 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isVerifying}
                onClick={handleFinalizeVerification}
                className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-95 duration-300">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Verification Error
            </h2>
            <p className="text-red-400/80 text-sm mb-8 px-4 leading-relaxed">
              {message}
            </p>

            <button
              onClick={handleResend}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
            >
              Resend Link
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <Link
              to="/login"
              className="block mt-6 text-zinc-500 text-sm hover:text-white transition"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
