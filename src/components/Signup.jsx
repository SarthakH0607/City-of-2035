import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isDisabled =
    !fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || isLoading;

  function validate() {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  function submitSignup(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onSignup({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      setIsLoading(false);
      navigate("/login");
    }, 800);
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glow-border w-full max-w-md rounded-3xl p-6"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">City of 2035</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Create Account</h1>
        <p className="mt-1 text-sm text-slate-400">Sign up to access city intelligence tools.</p>

        <form onSubmit={submitSignup} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none transition focus:border-cyan-300/50"
              placeholder="Alex Morgan"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none transition focus:border-cyan-300/50"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-rose-300">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <div className="flex rounded-xl border border-white/10 bg-black/25 focus-within:border-cyan-300/50">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-3 text-sm text-slate-300 hover:text-cyan-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-rose-300">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none transition focus:border-cyan-300/50"
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-rose-300">{errors.confirmPassword}</p>
            )}
          </div>

          <Motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Motion.button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </Motion.section>
    </main>
  );
}

export default Signup;
