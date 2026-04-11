import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoveLeft, Mail, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import Logo from "../../assets/appLogo.png";
import { environment } from "../../environments/environment";
import { showError, showSuccess } from "../../components/common/ToastService";

const API_BASE = `${environment.apiBase}/affiliate/auth`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // Field specific error
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Email Validation Logic
  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email))
      return "Please enter a valid email address";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/forgot-password`, { email });
      showSuccess("Reset link sent successfully!");
      setSubmitted(true);
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl p-10 bg-white/[0.02] z-10 text-center">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Logo" className="h-20 object-contain" />
        </div>

        {/* Fixed Height Container to prevent layout shift between views */}
        <div className="min-h-[280px] flex flex-col justify-center">
          {!submitted ? (
            <>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Forgot Password?
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                No worries! Enter your email and we'll send you a link to reset
                your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-2 text-left">
                <div className="relative">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={handleInputChange}
                      className={`input-field ${error ? "border-red-500/50 focus:border-red-500" : ""}`}
                    />
                    <Mail
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? "text-red-400" : "text-zinc-600"}`}
                    />
                  </div>

                  {/* Error Message with absolute positioning to prevent shifting */}
                  <div className="h-5 mt-1 ml-2">
                    {error && (
                      <p className="text-red-400 text-[11px] font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={10} /> {error}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Check your email
              </h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                We've sent a password reset link to <br />
                <span className="text-white font-medium">{email}</span>
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setError("");
                }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition underline-offset-4 hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
          <Link
            to="/login"
            className="text-zinc-400 hover:text-white text-sm font-medium inline-flex items-center gap-2 transition group"
          >
            <MoveLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Sign In
          </Link>
        </div>
      </div>

      <style>{`
        .input-field { 
          width: 100%; 
          padding: 14px 18px; 
          border-radius: 18px; 
          border: 1px solid #27272a; 
          background: rgba(255,255,255,0.03); 
          color: white; 
          outline: none; 
          transition: all 0.3s; 
        }
        .input-field:focus { 
          border-color: #52525b; 
          background: rgba(255,255,255,0.06); 
          box-shadow: 0 0 0 1px rgba(82, 82, 91, 0.5); 
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
