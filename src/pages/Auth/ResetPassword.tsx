import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import Logo from "../../assets/appLogo.png";
import { environment } from "../../environments/environment";
import { showError, showSuccess } from "../../components/common/ToastService";

const API_BASE = `${environment.apiBase}/affiliate/auth`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [token, setToken] = useState("");

  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {},
  );

  const getErrorMessage = (err: any) =>
    err.response?.data?.message ||
    err.message ||
    "An unexpected error occurred.";

  const validateInitialToken = useCallback(async () => {
    const urlToken = searchParams.get("affv_t");

    if (!urlToken) {
      setIsExpired(true);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/get-token/?token=${urlToken}`);
      console.log(res?.data?.token?.token, "===========token");

      if (res?.data?.token?.status) {
        setToken(res?.data?.token?.token);
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    } catch (err: any) {
      setIsExpired(true);
      console.error("Token validation failed", err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [searchParams]);

  useEffect(() => {
    validateInitialToken();
  }, [validateInitialToken]);

  const validate = () => {
    const newErrors: { password?: string; confirm?: string } = {};
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    console.log(token, "========token");

    try {
      const response = await axios.post(
        `${API_BASE}/reset-password/?token=${token}`,
        {
          password,
        },
      );
      console.log(response);

      showSuccess("Password reset successful!");
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      const msg = getErrorMessage(error);
      showError(msg);
      if (
        msg.toLowerCase().includes("expire") ||
        msg.toLowerCase().includes("invalid")
      ) {
        setIsExpired(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl p-10 bg-white/[0.02] z-10">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Logo" className="h-20 object-contain" />
        </div>

        <div className="min-h-[340px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-white/50" />
              <p className="text-zinc-500 text-sm">Verifying your link...</p>
            </div>
          ) : isExpired ? (
            /* --- EXPIRED LINK STATE --- */
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Link Expired
              </h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                This password reset link is no longer valid or has already been
                used.
              </p>
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                <RefreshCw size={18} /> Resend Reset Link
              </button>
            </div>
          ) : isSuccess ? (
            /* --- SUCCESS STATE --- */
            <div className="text-center py-4 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Password Updated!
              </h3>
              <p className="text-zinc-400 text-sm mb-8">
                Redirecting you to login page...
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-white font-semibold hover:underline group"
              >
                Go to Login{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          ) : (
            /* --- FORM STATE --- */
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Set New Password
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  Create a new secure password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-1">
                <div className="relative">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors({ ...errors, password: "" });
                      }}
                      className={`input-field pr-12 ${errors.password ? "border-red-500/50" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="h-5 mt-1 ml-2">
                    {errors.password && (
                      <p className="text-red-400 text-[11px] font-medium flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirm) setErrors({ ...errors, confirm: "" });
                    }}
                    className={`input-field ${errors.confirm ? "border-red-500/50" : ""}`}
                  />
                  <div className="h-5 mt-1 ml-2">
                    {errors.confirm && (
                      <p className="text-red-400 text-[11px] font-medium flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.confirm}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex justify-center items-center gap-2 active:scale-95"
                >
                  Update Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        .input-field { width: 100%; padding: 14px 18px; border-radius: 18px; border: 1px solid #27272a; background: rgba(255,255,255,0.03); color: white; outline: none; transition: all 0.3s; }
        .input-field:focus { border-color: #52525b; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 1px #52525b; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
