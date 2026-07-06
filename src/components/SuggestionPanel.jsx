import { motion as Motion } from "framer-motion";

const moodSuggestions = {
  stressed: {
    title: "😰 Stress Relief Mode",
    icon: "🧘",
    suggestions: [
      "✓ Showing only LOW crowd EV stations",
      "✓ Eco-friendly route highlighted",
      "✓ Minimal UI clutter enabled",
      "💡 Recommended: HyperCharge A (Low Crowd)",
    ],
    color: "#00ff88",
  },
  calm: {
    title: "😌 Calm Mode",
    icon: "🌊",
    suggestions: [
      "✓ All EV stations visible",
      "✓ Smooth animation mode active",
      "✓ Best eco-route highlighted",
      "💡 Tip: Take Solar Avenue for clean air",
    ],
    color: "#00d9ff",
  },
  focused: {
    title: "🧠 Focused Mode",
    icon: "⚡",
    suggestions: [
      "✓ Only nearest station shown",
      "✓ Fastest route prioritized",
      "✓ Minimal distractions",
      "💡 Target: MetroCharge C (Nearest)",
    ],
    color: "#d946ef",
  },
};

function SuggestionPanel({ mood, selectedRoute, palette }) {
  const config = moodSuggestions[mood];

  return (
    <Motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-4"
      style={{
        borderColor: `${config.color}33`,
        boxShadow: `inset 0 0 20px ${config.color}15`,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">{config.icon}</span>
        <h3 className="text-lg font-semibold text-slate-100">{config.title}</h3>
      </div>

      <div className="space-y-2">
        {config.suggestions.map((suggestion, idx) => (
          <Motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
            style={{
              borderLeftWidth: "3px",
              borderLeftColor: config.color,
            }}
          >
            {suggestion}
          </Motion.div>
        ))}
      </div>

      {selectedRoute && (
        <Motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3"
        >
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Current Route</p>
          <p className="text-sm font-semibold text-slate-100">{selectedRoute.title}</p>
          <div className="mt-2 flex gap-3 text-xs text-slate-300">
            <span>⏱ {selectedRoute.eta}</span>
            <span>💨 AQI {selectedRoute.aqi}</span>
            <span>👥 {selectedRoute.crowd}</span>
          </div>
        </Motion.div>
      )}
    </Motion.section>
  );
}

export default SuggestionPanel;
