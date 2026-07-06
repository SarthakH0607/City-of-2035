import { useState, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AIAssistant from "../components/AIAssistant";
import RouteOptimizer from "../components/RouteOptimizer";
import MapView from "../components/MapView";
import Cards from "../components/Cards";
import SuggestionPanel from "../components/SuggestionPanel";

const moodPalette = {
  calm: {
    accent: "#00d9ff",
    glow: "linear-gradient(90deg,#00ffff,#0066ff)",
    speed: 1,
  },
  focused: {
    accent: "#a855f7",
    glow: "linear-gradient(90deg,#d946ef,#00d9ff)",
    speed: 0.8,
  },
  stressed: {
    accent: "#00ff88",
    glow: "linear-gradient(90deg,#00ff88,#00d9ff)",
    speed: 1.2,
  },
};

function Dashboard({ user, onLogout }) {
  const [mood, setMood] = useState("calm");
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || routes[0] || null;
  const palette = moodPalette[mood];

  return (
    <Motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 * palette.speed }}
      className="min-h-screen p-4 text-slate-100 sm:p-6"
      style={{ filter: mood === "stressed" ? "saturate(115%)" : "none" }}
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <Sidebar />

        <section className="space-y-4">
          <Topbar
            mood={mood}
            setMood={setMood}
            palette={palette}
            userName={user?.fullName || "Urban Admin"}
            onLogout={onLogout}
          />
          <Cards selectedRoute={selectedRoute} palette={palette} mood={mood} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <MapView routes={routes} selectedRouteId={selectedRouteId} mood={mood} />
            </div>

            <div className="space-y-4">
              <SuggestionPanel mood={mood} selectedRoute={selectedRoute} palette={palette} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <RouteOptimizer
                  onRoutesReady={setRoutes}
                  selectedRouteId={selectedRouteId}
                  setSelectedRouteId={setSelectedRouteId}
                  mood={mood}
                />
                <AIAssistant />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Motion.main>
  );
}

export default Dashboard;
