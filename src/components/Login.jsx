import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = !email.trim() || !password.trim() || isLoading;

  function submitLogin(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = onLogin(email.trim(), password, rememberMe);
      setIsLoading(false);

      if (result.ok) {
        navigate("/dashboard");
        return;
      }

      setError(result.message);
    }, 800);
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_40px_rgba(0,217,255,0.6)]" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
            City of 2035
          </h1>
          <p className="mt-2 text-sm text-slate-400">Urban Intelligence Platform</p>
        </Motion.div>

        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass glow-border w-full rounded-3xl p-6"
        >
          <h2 className="text-2xl font-semibold text-slate-100">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-400">Login to access your citizen dashboard.</p>

          <form onSubmit={submitLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none transition focus:border-cyan-300/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <div className="flex rounded-xl border border-white/10 bg-black/25 focus-within:border-cyan-300/50">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-3 text-sm text-slate-300 hover:text-cyan-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="text-cyan-300 hover:text-cyan-200">
              Forgot password?
            </a>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <Motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Login"}
          </Motion.button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          New here?{" "}
          <Link to="/signup" className="text-cyan-300 hover:text-cyan-200">
            Create Account
          </Link>
        </p>
        </Motion.section>
      </div>
    </main>
  );
}

export default Login;
