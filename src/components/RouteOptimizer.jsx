import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const ROUTE_OPTIONS = [
  {
    id: "fastest",
    title: "Fastest (Car)",
    eta: "19 min",
    aqi: 92,
    crowd: "High",
    crowdScore: 78,
    traffic: "high",
    path: [
      [72.8777, 19.076],
      [72.885, 19.084],
      [72.894, 19.089],
      [72.902, 19.095],
    ],
  },
  {
    id: "eco",
    title: "Eco (Low Pollution)",
    eta: "24 min",
    aqi: 46,
    crowd: "Low",
    crowdScore: 34,
    traffic: "low",
    path: [
      [72.8777, 19.076],
      [72.88, 19.07],
      [72.888, 19.072],
      [72.902, 19.095],
    ],
  },
  {
    id: "least-crowded",
    title: "Least Crowded (Walk)",
    eta: "27 min",
    aqi: 58,
    crowd: "Very Low",
    crowdScore: 20,
    traffic: "medium",
    path: [
      [72.8777, 19.076],
      [72.872, 19.08],
      [72.879, 19.091],
      [72.902, 19.095],
    ],
  },
];

function RouteOptimizer({ onRoutesReady, selectedRouteId, setSelectedRouteId, mood }) {
  const [source, setSource] = useState("Bandra");
  const [destination, setDestination] = useState("Lower Parel");

  function buildMockRoutes(currentSource = source, currentDestination = destination) {
    return ROUTE_OPTIONS.map((route) => ({
      ...route,
      source: currentSource,
      destination: currentDestination,
    }));
  }

  function optimizeRoutes() {
    const routes = buildMockRoutes();
    onRoutesReady(routes);
    if (!selectedRouteId) {
      setSelectedRouteId(routes[0].id);
    }
  }

  useEffect(() => {
    const initialRoutes = ROUTE_OPTIONS.map((route) => ({
      ...route,
      source: "Bandra",
      destination: "Lower Parel",
    }));
    onRoutesReady(initialRoutes);
    setSelectedRouteId(initialRoutes[0].id);
  }, [onRoutesReady, setSelectedRouteId]);

  return (
    <section className="glass rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-slate-100">Smart Route Optimizer</h3>
      <p className="mt-1 text-sm text-slate-400">Compare traffic, AQI, and crowd data in real time.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source"
          className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
        />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
        />
      </div>

      <Motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={optimizeRoutes}
        className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-900"
      >
        Optimize Routes
      </Motion.button>

      <div className="mt-4 grid gap-2">
        {ROUTE_OPTIONS.map((route) => {
          const selected = selectedRouteId === route.id;
          return (
            <Motion.button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              whileHover={{ scale: 1.01 }}
              className={`rounded-xl border px-3 py-3 text-left ${
                selected
                  ? "border-cyan-300/50 bg-cyan-300/10"
                  : "border-white/10 bg-white/5 hover:border-violet-300/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm text-slate-100">{route.title}</strong>
                <span className="text-xs text-slate-300">{route.eta}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                AQI {route.aqi} | Crowd: {route.crowd}
              </p>
            </Motion.button>
          );
        })}
      </div>
    </section>
  );
}

export default RouteOptimizer;


