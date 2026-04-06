// import { useState } from "react";
// import Logo from "../../assets/appLogo.png";

// type FormData = {
//   name: string;
//   email: string;
//   mobile: string;
//   password: string;
//   confirmPassword: string;
// };

// type Errors = Partial<FormData>;

// const Register = () => {
//   const [form, setForm] = useState<FormData>({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState<Errors>({});

//   const validate = () => {
//     const newErrors: Errors = {};

//     if (!form.name.trim()) {
//       newErrors.name = "Name is required";
//     }

//     if (!form.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(form.email)) {
//       newErrors.email = "Invalid email";
//     }

//     if (!form.mobile) {
//       newErrors.mobile = "Mobile number is required";
//     } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
//       newErrors.mobile = "Invalid mobile number";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       newErrors.password = "Minimum 6 characters required";
//     }

//     if (!form.confirmPassword) {
//       newErrors.confirmPassword = "Confirm your password";
//     } else if (form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (validate()) {
//       console.log("Form Data:", form);
//       // 👉 API call here
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center 
//     bg-gradient-to-br from-black via-gray-900 to-black px-4"
//     >
//       <div
//         className="w-full max-w-md backdrop-blur-md 
//       border border-gray-800 rounded-2xl shadow-2xl p-8"
//       >
//         <div className="flex justify-center items-center w-full">
//           <img src={Logo} alt="DailyTrades" className="h-12 w-auto" />
//         </div>
//         <h2 className="text-2xl font-bold text-white mb-6 text-center">
//           Create Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-xl border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
//             />
//             {errors.name && (
//               <p className="text-red-400 text-xs mt-1">{errors.name}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-xl border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
//             />
//             {errors.email && (
//               <p className="text-red-400 text-xs mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Mobile */}
//           <div>
//             <input
//               type="text"
//               name="mobile"
//               placeholder="Mobile Number"
//               value={form.mobile}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-xl  border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
//             />
//             {errors.mobile && (
//               <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-xl border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
//             />
//             {errors.password && (
//               <p className="text-red-400 text-xs mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-xl border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-400 text-xs mt-1">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full py-3 rounded-xl 
//             bg-gradient-to-r from-white to-gray-300 text-black 
//             font-semibold hover:scale-[1.02] transition-all"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
import { useState } from "react";
import Logo from "../../assets/appLogo.png";
import { Eye, EyeOff, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<FormData>;

const Register = () => {
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

  const validate = () => {
    const newErrors: Errors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Invalid mobile number";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log("Form Data:", form);
      // API call here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-black via-gray-900 to-black px-4">
      
      <div className="flex w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center z-10">
          
          <div className="mb-10">
            <img src={Logo} alt="Logo" className="h-10 mb-6" />
            <h2 className="text-4xl font-bold mb-2">
              Create an account
            </h2>
            <p className="text-zinc-400">
              Start tracking your strategies today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="input"
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="input"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                className="input"
              />
              {errors.mobile && <p className="error">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input pr-12"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="eye"
              >
                {showConfirmPassword ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Button */}
            <button className="btn">
              Register Now
            </button>
          </form>

          {/* Login */}
          <div className="mt-8 text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold inline-flex items-center gap-2 group"
            >
              Log In
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-end pl-12">
          <div className="max-w-md text-right">
            <h3 className="text-5xl font-bold leading-tight mb-6">
              Master Your <span className="text-white">Trading</span>
            </h3>

            <p className="text-zinc-400 text-lg mb-8">
              Track, analyze and scale your strategies.
            </p>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-left">
              <p className="text-sm italic text-zinc-300">
                "Clean UI. Powerful features. Perfect for serious traders."
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Pro Trader
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Utility Classes */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid #27272a;
          color: white;
          outline: none;
          transition: 0.3s;
        }
        .input:focus {
          border-color: #52525b;
          box-shadow: 0 0 0 1px #52525b;
        }
        .error {
          color: #f87171;
          font-size: 12px;
          margin-top: 4px;
          margin-left: 6px;
        }
        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 16px;
          background: white;
          color: black;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn:hover {
          transform: scale(1.02);
        }
        .eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
        }
      `}</style>
    </div>
  );
};

export default Register;