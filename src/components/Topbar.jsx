import { motion as Motion } from "framer-motion";

const moods = [
  { label: "Calm", value: "calm" },
  { label: "Focused", value: "focused" },
  { label: "Stressed", value: "stressed" },
];

function Topbar({ mood, setMood, palette, userName, onLogout }) {
  return (
    <Motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glow-border flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-3"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">System status</p>
        <h2 className="neon-text text-xl font-semibold text-slate-100">All city networks operational</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-1">
          {moods.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setMood(item.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                mood === item.value ? "text-black" : "text-slate-200"
              }`}
              style={{
                background: mood === item.value ? palette.glow : "transparent",
                boxShadow: mood === item.value ? "0 0 20px rgba(77,196,255,0.45)" : "none",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300 to-violet-400" />
          <div>
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm text-slate-100">{userName}</p>
          </div>
        </div>

        <Motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-rose-300/30 bg-rose-400/15 px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-400/20"
        >
          Logout
        </Motion.button>
      </div>
    </Motion.header>
  );
}

export default Topbar;
