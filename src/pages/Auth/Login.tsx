import { useState } from "react";
import Logo from "../../assets/appLogo.png";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

type FormData = {
  email: string;
  password: string;
};

type Errors = Partial<FormData>;

const Login = () => {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const newErrors: Errors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log("Login Data:", form);
      // 👉 API call here
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-black via-gray-900 to-black px-4"
    >
      <div
        className="w-full max-w-md  backdrop-blur-md 
      border border-gray-800 rounded-2xl shadow-2xl p-8"
      >
        <div className="flex justify-center items-center w-full">
          <img src={Logo} alt="DailyTrades" className="h-12 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl 
            bg-gradient-to-r from-white to-gray-300 text-black 
            font-semibold hover:scale-[1.02] transition-all"
          >
            Login
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-8 text-zinc-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-white font-semibold inline-flex items-center gap-2 group"
          >
            Register
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
