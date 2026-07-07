import { useState } from "react";
import { motion as Motion } from "framer-motion";

const SECTORS_AQI = [
  { id: 1, name: "Sector 1 (Downtown)", aqi: 82, status: "moderate", temp: "28°C" },
  { id: 2, name: "Sector 2 (Industrial)", aqi: 110, status: "poor", temp: "31°C" },
  { id: 3, name: "Sector 3 (Residential)", aqi: 54, status: "good", temp: "26°C" },
  { id: 4, name: "Sector 4 (Commercial)", aqi: 68, status: "moderate", temp: "27°C" },
  { id: 5, name: "Sector 5 (High-Tech)", aqi: 42, status: "good", temp: "25°C" },
  { id: 6, name: "Sector 6 (Eco-Belt)", aqi: 24, status: "good", temp: "23°C" }
];

function statusColor(status) {
  if (status === "good") return "#2cf8c2";
  if (status === "moderate") return "#facc15";
  return "#f87171";
}

function AnalyticsView({ palette }) {
  const [selectedSector, setSelectedSector] = useState(null);

  // SVG Line Chart coordinates calculation for hourly energy loads
  const points = "0,80 50,60 100,75 150,40 200,30 250,55 300,20 350,45 400,10 450,35 500,15";
  const energyLoadPoints = "0,95 50,90 100,85 150,60 200,45 250,62 300,35 350,55 400,20 450,48 500,30";

  return (
    <div className="space-y-4">
      {/* Visual Analytics Graphs */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Hourly Energy Core Output */}
        <article className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-slate-100">Municipal Energy Grid</h3>
          <p className="text-xs text-slate-400 mb-6">Real-time Solar vs Fusion core distribution</p>

          <div className="relative w-full h-48 bg-black/10 border border-white/5 rounded-xl overflow-hidden px-4 py-2">
            {/* SVG line chart */}
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradient-solar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2cf8c2" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#2cf8c2" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="gradient-fusion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8f7bff" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#8f7bff" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />

              {/* Solar production area & line */}
              <polygon points={`0,120 ${points} 500,120`} fill="url(#gradient-solar)" />
              <polyline points={points} fill="none" stroke="#2cf8c2" strokeWidth="3" strokeLinecap="round" />

              {/* Fusion core output area & line */}
              <polygon points={`0,120 ${energyLoadPoints} 500,120`} fill="url(#gradient-fusion)" />
              <polyline points={energyLoadPoints} fill="none" stroke="#8f7bff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2cf8c2]" /> Solar Arrays</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#8f7bff]" /> Fusion Core</span>
            </div>
            <span className="text-slate-400">Peak Production: 14:00</span>
          </div>
        </article>

        {/* Mobility Peak Hour spikes */}
        <article className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-slate-100">Mobility Flow Peaks</h3>
          <p className="text-xs text-slate-400 mb-6">Hourly autonomous transit usage (M Riders/Hr)</p>

          <div className="relative w-full h-48 bg-black/10 border border-white/5 rounded-xl flex items-end justify-between p-4 pt-10">
            {/* Simple Bar Chart */}
            {[24, 45, 82, 95, 68, 52, 79, 90, 40, 20].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
                <Motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: idx * 0.05, duration: 0.6 }}
                  className="w-4 sm:w-6 rounded-t bg-gradient-to-t from-cyan-500 to-cyan-300 relative group"
                  style={{
                    boxShadow: "0 0 10px rgba(0, 217, 255, 0.2)"
                  }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-900 border border-white/10 px-1 py-0.5 rounded text-[10px] text-slate-100 transition duration-150">
                    {val}%
                  </span>
                </Motion.div>
                <span className="text-[10px] font-mono text-slate-500">{idx * 2 + 6}h</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Traffic Peak: 08:00 & 18:00</span>
            <span className="text-cyan-300 font-semibold">Total Passengers: 1.48M</span>
          </div>
        </article>
      </section>

      {/* Sector Air Quality Matrix */}
      <section className="glass rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Air Quality Sector Matrix</h3>
          <p className="text-xs text-slate-400">Interactive sector telemetry overview</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS_AQI.map((sector) => {
            const color = statusColor(sector.status);
            const isSelected = selectedSector?.id === sector.id;

            return (
              <Motion.button
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                whileHover={{ scale: 1.02 }}
                className={`rounded-xl border p-4 text-left relative transition ${
                  isSelected ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10 bg-white/5"
                }`}
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: color
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-100">{sector.name}</span>
                  <span className="font-mono text-xs uppercase" style={{ color }}>{sector.status}</span>
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-400">
                  <span>AQI: <strong className="text-slate-200">{sector.aqi}</strong></span>
                  <span>Temp: <strong className="text-slate-200">{sector.temp}</strong></span>
                </div>
              </Motion.button>
            );
          })}
        </div>

        {selectedSector && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <h4 className="text-sm font-bold text-slate-100">{selectedSector.name} Summary</h4>
            <p className="mt-2 text-xs text-slate-300">
              The environmental telemetry shows the AQI is currently {selectedSector.aqi} ({selectedSector.status}). 
              {selectedSector.aqi > 100 
                ? " Air purification scrubbers have been initiated to reduce carbon particle accumulation."
                : " Air quality is within nominal safety guidelines. No intervention is required."}
            </p>
          </Motion.div>
        )}
      </section>
    </div>
  );
}

export default AnalyticsView;
