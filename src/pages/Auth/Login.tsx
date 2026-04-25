import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MoveRight,
  Mail,
  X,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import axios from "axios";
import Logo from "../../assets/appLogo.png";
import { environment } from "../../environments/environment";
import { showError, showSuccess } from "../../components/common/ToastService";

type FormData = { email: string; password: string };
type Errors = Partial<FormData>;

const API_BASE = `${environment.apiBase}/affiliate/auth`;
// const V3_SITE_KEY = environment.SITE_KEY_V3;

const Login = () => {
  const navigate = useNavigate();
  // const recaptchaV2Ref = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  // const [showV2, setShowV2] = useState(false);
  const [resending, setResending] = useState(false);

  // const getV3Token = (): Promise<string | null> => {
  //   return new Promise((resolve) => {
  //     const grecaptcha = (window as any).grecaptcha;
  //     if (!grecaptcha) return resolve(null);
  //     grecaptcha.ready(() => {
  //       grecaptcha
  //         .execute(V3_SITE_KEY, { action: "login" })
  //         .then((token: string) => resolve(token))
  //         .catch(() => resolve(null));
  //     });
  //   });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        ...form,
      });
      if (response?.status === 200 && response?.data?.tokens) {
        const accessToken = response.data.tokens.access?.token;
        const refreshToken = response.data.tokens.refresh?.token;

        if (!accessToken || !refreshToken) {
          showError("Invalid token received");
          return;
        }

        localStorage.setItem("t", accessToken);
        localStorage.setItem("r", refreshToken);

        showSuccess("Welcome back!");
        navigate("/affiliate/dashboard");
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "";

      if (message.toLowerCase().includes("verify") || status === 403) {
        setIsVerifyModalOpen(true);
      } else {
        showError(message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setResending(true);
    try {
      await axios.post(`${API_BASE}/resend-verification-email`, {
        email: form.email,
      });
      showSuccess("Verification link sent!");
      setIsVerifyModalOpen(false);
    } catch (error: any) {
      showError(error.response?.data?.message || "Resend failed");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl p-10 bg-white/[0.02] z-10">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Logo" className="h-20 object-contain" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-zinc-500 text-sm mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="input-field"
            />
            {errors.email && (
              <p className="text-red-400 text-[11px] ml-2 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
            </div>
            {errors.password && (
              <p className="text-red-400 text-[11px] ml-2 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* {showV2 && (
            <div className="flex flex-col items-center py-2 animate-in slide-in-from-top-2">
              <ReCAPTCHA
                ref={recaptchaV2Ref}
                sitekey={V2_SITE_KEY}
                theme="dark"
                onExpired={() => window.location.reload()}
              />
              <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                <ShieldCheck size={12} /> Verification required due to security
                score.
              </p>
            </div>
          )} */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-zinc-500 text-sm text-center">
          <p className="text-center mb-2">
            <Link
              to="/forgot-password"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Forgot Password ?
            </Link>
          </p>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white font-bold inline-flex items-center gap-1 group hover:underline"
          >
            Register{" "}
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[2.5rem] p-10 shadow-3xl relative">
            <button
              onClick={() => setIsVerifyModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Email Unverified
              </h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                We've noticed your account is pending verification. Please check
                your inbox for{" "}
                <span className="text-white font-semibold">{form.email}</span>.
              </p>
              <button
                onClick={handleResendLink}
                disabled={resending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Mail size={20} /> Resend Link
                  </>
                )}
              </button>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="mt-6 text-zinc-500 text-sm font-medium hover:text-zinc-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-field { width: 100%; padding: 14px 18px; border-radius: 18px; border: 1px solid #27272a; background: rgba(255,255,255,0.03); color: white; outline: none; transition: all 0.3s; }
        .input-field:focus { border-color: #52525b; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 1px #52525b; }
      `}</style>
    </div>
  );
};

export default Login;
