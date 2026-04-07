import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  Eye,
  EyeOff,
  Zap,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Logo from "../../assets/appLogo.png";
import { environment } from "../../environments/environment";
import { showError, showSuccess } from "../../components/common/ToastService";

type FormData = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<FormData>;

const API_AUTH = `${environment.apiBase}/affiliate/auth`;
const V3_SITE_KEY = environment.SITE_KEY_V3;
const V2_SITE_KEY = environment.SITE_KEY_V2;

const Register = () => {
  const navigate = useNavigate();
  const recaptchaV2Ref = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showV2, setShowV2] = useState(false);

  const getV3Token = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const grecaptcha = (window as any).grecaptcha;
      if (!grecaptcha) return resolve(null);
      grecaptcha.ready(() => {
        grecaptcha
          .execute(V3_SITE_KEY, { action: "register" })
          .then((token: string) => resolve(token))
          .catch(() => resolve(null));
      });
    });
  };

  const runValidation = (fieldName?: keyof FormData, value?: string) => {
    const newErrors = { ...errors };
    const targetForm = fieldName ? { ...form, [fieldName]: value } : form;

    if (!fieldName || fieldName === "name") {
      if (!targetForm.name.trim()) newErrors.name = "Name is required";
      else if (targetForm.name.trim().length < 2)
        newErrors.name = "Name must be at least 2 characters";
      else delete newErrors.name;
    }
    if (!fieldName || fieldName === "email") {
      if (!targetForm.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(targetForm.email))
        newErrors.email = "Invalid email";
      else delete newErrors.email;
    }
    if (!fieldName || fieldName === "mobile") {
      if (!targetForm.mobile) newErrors.mobile = "Mobile number is required";
      else if (!/^[6-9]\d{9}$/.test(targetForm.mobile))
        newErrors.mobile = "Invalid mobile";
      else delete newErrors.mobile;
    }
    if (!fieldName || fieldName === "password") {
      if (!targetForm.password) newErrors.password = "Password is required";
      else if (targetForm.password.length < 6)
        newErrors.password = "Min 6 characters";
      else delete newErrors.password;
    }
    if (
      !fieldName ||
      fieldName === "confirmPassword" ||
      fieldName === "password"
    ) {
      if (!targetForm.confirmPassword)
        newErrors.confirmPassword = "Confirm your password";
      else if (targetForm.password !== targetForm.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
      else delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only digits for mobile field
    const sanitized = name === "mobile" ? value.replace(/\D/g, "") : value;
    setForm((prev) => ({ ...prev, [name]: sanitized }));
    runValidation(name as keyof FormData, sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) return;

    setLoading(true);

    const { confirmPassword, ...payload } = form;
    const v3Token = await getV3Token();
    console.log(v3Token, "========v3token");

    try {
      if (!showV2) {
        const v3Token = await getV3Token();

        if (!v3Token) {
          setShowV2(true);
          showError(
            "Security verification required. Please complete the check below.",
          );
          setLoading(false);
          return;
        }

        try {
          const response = await axios.post(`${API_AUTH}/register`, {
            ...payload,
            v3Token,
          });

          if (response?.data?.success) {
            showSuccess(response.data.message || "Registered Successfully!");
            navigate("/login");
          }
          return;
        } catch (v3Error: any) {
          if (v3Error.response?.status === 401) {
            setShowV2(true);
            showError("Please complete the security check below.");
          } else {
            showError(v3Error.response?.data?.message || "Registration failed");
          }
          setLoading(false);
          return;
        }
      }

      const v2Token = recaptchaV2Ref.current?.getValue();

      if (!v2Token) {
        showError("Please complete the security check.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${API_AUTH}/register`, {
          ...payload,
          v2Token,
        });

        if (response?.data?.success) {
          showSuccess(response.data.message || "Registered Successfully!");
          navigate("/login");
        }
      } catch (v2Error: any) {
        if (v2Error.response?.status === 401) {
          showError("Verification failed. Reloading...");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showError(v2Error.response?.data?.message || "Registration failed");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      title: "High Commissions",
      description: "Get paid for every referral.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      title: "Real-time Tracking",
      description: "Monitor earnings instantly.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Quick Payouts",
      description: "Fast and hassle-free.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 relative overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-12 items-center z-10">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2">
          <div className="mb-8">
            <img src={Logo} alt="Logo" className="h-20 object-contain" />
            <h2 className="text-4xl font-bold text-white">Create account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1 max-w-md">
            {[
              { name: "name", type: "text", placeholder: "Full Name" },
              { name: "email", type: "email", placeholder: "Email Address" },
              {
                name: "mobile",
                type: "text",
                placeholder: "Mobile Number",
                maxLength: 10,
                inputMode: "numeric",
              },
            ].map((field) => (
              <div key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  className="input-field"
                  maxLength={(field as any).maxLength}
                  inputMode={(field as any).inputMode}
                />
                <div className="min-h-[20px] px-1">
                  {errors[field.name as keyof Errors] && (
                    <p className="error-text">
                      {errors[field.name as keyof Errors]}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="min-h-[20px] px-1">
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-icon"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="min-h-[20px] px-1">
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {showV2 && (
              <div className="flex flex-col items-center py-3 animate-in fade-in">
                <ReCAPTCHA
                  ref={recaptchaV2Ref}
                  sitekey={V2_SITE_KEY}
                  theme="dark"
                  onExpired={() => window.location.reload()}
                />
                <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1 uppercase font-bold">
                  <ShieldCheck size={12} /> Verification required
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-btn mt-4 flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Register Now"
              )}
            </button>
          </form>

          <div className="mt-6 text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 flex-col border-l border-white/5 pl-12">
          <h3 className="text-5xl font-bold text-white text-left mb-6">
            Earn as You Share
          </h3>
          <p className="text-zinc-400 text-lg mb-8 text-left">
            Join the DailyTrades Affiliate Program and turn your network into a
            revenue stream.
          </p>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="p-3 rounded-xl bg-white/[0.04]">{b.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {b.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mt-1">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .input-field { width: 100%; padding: 12px 16px; border-radius: 14px; border: 1px solid #27272a; background: rgba(255,255,255,0.03); color: white; outline: none; transition: 0.2s; }
        .input-field:focus { border-color: #52525b; background: rgba(255,255,255,0.05); }
        .error-text { color: #f87171; font-size: 11px; font-weight: 500; }
        .submit-btn { width: 100%; padding: 14px; border-radius: 14px; background: white; color: black; font-weight: 700; transition: 0.3s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .eye-icon { position: absolute; right: 14px; top: 12px; color: #71717a; }
      `}</style>
    </div>
  );
};

export default Register;
