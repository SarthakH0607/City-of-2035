import { motion as Motion } from "framer-motion";

const ALERTS = [
  { id: 1, type: "info", text: "⚡ Fusion Reactor Unit-3 is operating at peak efficiency (99.4%)." },
  { id: 2, type: "warning", text: "⚠️ Minor grid overload detected in Sector 4. Rerouting spare power." },
  { id: 3, type: "success", text: "🍃 Air filtration towers in Sector 7 active. Local AQI dropped to 22." },
  { id: 4, type: "info", text: "🤖 Autonomous transit fleets have completed 12,400 runs today without incidents." }
];

const METRICS = [
  { name: "Power Grid Stability", value: "98.7%", change: "+0.2%", desc: "Fusion Core Balance", color: "var(--neon-blue)" },
  { name: "Transit Utilization", value: "94.2%", change: "+1.8%", desc: "Autonomous Loop", color: "var(--neon-violet)" },
  { name: "Water Supply Reserves", value: "86.5 M Gal", change: "-0.5%", desc: "Desalination Intake", color: "var(--neon-green)" },
  { name: "Waste Conversion", value: "99.8%", change: "+0.1%", desc: "Recycle Efficiency", color: "#facc15" }
];

const LOGS = [
  { time: "23:54", area: "Grid OS", text: "Optimized load balancing across Sectors 1-6." },
  { time: "23:41", area: "Transit", text: "Rerouted loop train D-4 to avoid temporary platform maintenance." },
  { time: "23:15", area: "Reactor", text: "Automatic helium coolant pulse complete." },
  { time: "22:50", area: "Environment", text: "Deployed mobile sensor drones to North Eco-belt." }
];

function DashboardView({ palette }) {
  return (
    <div className="space-y-4">
      {/* Dynamic Alerts Ticker */}
      <section className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase text-slate-400">Live System Alerts</h3>
        <div className="space-y-2">
          {ALERTS.map((alert, index) => (
            <Motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: alert.type === "warning" ? "#f87171" : alert.type === "success" ? "#2cf8c2" : "var(--neon-blue)"
              }}
            >
              <span className="text-slate-100">{alert.text}</span>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* Grid of Key Telemetry Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric, index) => (
          <Motion.article
            key={metric.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-4 relative overflow-hidden"
            style={{
              borderColor: `${metric.color}33`,
              boxShadow: `inset 0 0 15px ${metric.color}08`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{metric.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: metric.color }}>
                {metric.change}
              </span>
            </div>
            <h4 className="mt-3 text-3xl font-bold text-slate-100">{metric.value}</h4>
            <p className="mt-2 text-xs text-slate-400">{metric.desc}</p>
          </Motion.article>
        ))}
      </section>

      {/* Grid of Reactor Core status & System logs */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Reactor Core Telemetry */}
        <article className="glass rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Reactor Core Fusion State</h3>
            <p className="text-xs text-slate-400">Telemetry feed from main municipal engine</p>
          </div>

          <div className="flex flex-col items-center justify-center my-6 py-4 relative">
            <div className="h-32 w-32 rounded-full border border-white/10 flex items-center justify-center relative">
              {/* Outer pulsing ring */}
              <Motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed"
                style={{ borderColor: palette.accent, opacity: 0.3 }}
              />
              <div className="text-center">
                <span className="text-3xl font-extrabold text-slate-100">89.4%</span>
                <p className="text-[10px] uppercase text-slate-400 mt-1">Thermal Load</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#2cf8c2] block" /> Core Temp: Normal</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#4dc4ff] block" /> Pressure: Stable</span>
            </div>
          </div>
        </article>

        {/* Live System Logs */}
        <article className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-slate-100">Core OS Operation Logs</h3>
          <p className="text-xs text-slate-400 mb-4">Event feed log terminal</p>

          <div className="space-y-3 font-mono text-xs">
            {LOGS.map((log, index) => (
              <div key={index} className="flex gap-4 p-2 border-b border-white/5 hover:bg-white/5 rounded-lg transition">
                <span className="text-cyan-400">{log.time}</span>
                <span className="text-violet-400 font-semibold">[{log.area}]</span>
                <span className="text-slate-200">{log.text}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default DashboardView;
