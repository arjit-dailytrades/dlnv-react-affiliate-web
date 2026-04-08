import { useNavigate } from "react-router-dom";
import { Home, MoveLeft, FileQuestion } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Animated Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-black-100 border border-white/10 p-6 rounded-3xl shadow-2xl">
            <FileQuestion
              size={48}
              className="text-white animate-bounce duration-[2000ms]"
            />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-white mb-2 tracking-tighter opacity-20">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">Lost in Space?</h2>
        <p className="text-zinc-500 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Don't
          worry, even the best traders lose their way sometimes.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-800 text-zinc-400 font-semibold hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
          >
            <MoveLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/affiliate/dashboard")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all active:scale-95"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>

        {/* Support Link */}
        {/* <p className="mt-12 text-zinc-600 text-sm">
          Think this is a mistake?{" "}
          <a href="#" className="text-zinc-400 hover:underline">
            Contact Support
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default NotFound;
