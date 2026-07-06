import { motion as Motion } from "framer-motion";

function Cards({ selectedRoute, palette, mood }) {
  const aqi = selectedRoute?.aqi ?? 62;
  const aqiColor = aqi <= 60 ? "#2cf8c2" : aqi <= 90 ? "#facc15" : "#f87171";
  const waterUsage = selectedRoute ? 78 - selectedRoute.crowdScore / 3 : 73;

  // Enhanced EV stations with crowd levels
  const evStations = [
    { name: "HyperCharge Hub A", availability: 82, crowd: "low" },
    { name: "Solar Grid Dock B", availability: 54, crowd: "medium" },
    { name: "MetroCharge Node C", availability: 68, crowd: "high" },
  ];

  // Filter stations based on mood
  const displayedStations = mood === "stressed" 
    ? evStations.filter(s => s.crowd === "low")
    : mood === "focused"
    ? evStations.slice(0, 1)
    : evStations;

  const crowdIcon = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Motion.article whileHover={{ y: -4 }} className="glass rounded-2xl p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">Air Quality</p>
        <h3 className="text-3xl font-bold" style={{ color: aqiColor }}>
          AQI {aqi}
        </h3>
        <div className="mt-4 h-2 rounded-full bg-slate-700/50">
          <Motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(aqi, 150) / 1.5}%` }}
            transition={{ duration: 0.8 }}
            className="h-2 rounded-full"
            style={{ background: aqiColor }}
          />
        </div>
      </Motion.article>

      <Motion.article whileHover={{ y: -4 }} className="glass rounded-2xl p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">EV Charging Stations</p>
        <div className="space-y-2">
          {displayedStations.map((station) => (
            <Motion.div key={station.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-1 flex justify-between text-xs text-slate-300">
                <span>{station.name}</span>
                <span className="flex items-center gap-1">
                  {crowdIcon[station.crowd]} {station.availability}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-700/40">
                <Motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${station.availability}%` }}
                  className="h-1.5 rounded-full"
                  style={{ background: palette.glow }}
                />
              </div>
            </Motion.div>
          ))}
          {mood === "stressed" && (
            <p className="mt-2 text-xs text-emerald-300">✓ Showing only low-crowd stations</p>
          )}
          {mood === "focused" && (
            <p className="mt-2 text-xs text-violet-300">⚡ Nearest station only</p>
          )}
        </div>
      </Motion.article>

      <Motion.article whileHover={{ y: -4 }} className="glass rounded-2xl p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Crowd Density</p>
        <div className="flex items-end gap-2">
          {[36, 62, 48, 74, 55].map((val, idx) => (
            <Motion.div
              key={val}
              initial={{ height: 10 }}
              animate={{ height: val }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              className="w-5 rounded-t-md"
              style={{ background: palette.accent }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">Current load: {selectedRoute?.crowd ?? "Moderate"}</p>
      </Motion.article>

      <Motion.article whileHover={{ y: -4 }} className="glass rounded-2xl p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Water Usage</p>
        <div className="relative mx-auto h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.18)" strokeWidth="9" fill="transparent" />
            <Motion.circle
              cx="50"
              cy="50"
              r="42"
              stroke={palette.glow}
              strokeWidth="9"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * waterUsage) / 100 }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-lg font-semibold">{Math.round(waterUsage)}%</div>
        </div>
      </Motion.article>
    </div>
  );
}

export default Cards;


