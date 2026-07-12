import { useCallback, useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";

/* ──────────────────────────────────────────────
   Geocoding (Nominatim) — place name → coords
   ────────────────────────────────────────────── */
async function geocodePlace(name) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "CityOf2035-DemoApp/1.0" },
  });
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  if (!data.length) throw new Error(`Location "${name}" not found`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
}

/* ──────────────────────────────────────────────
   Autocomplete suggestions (Nominatim search)
   ────────────────────────────────────────────── */
async function fetchSuggestions(query) {
  if (!query || query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "CityOf2035-DemoApp/1.0" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((item) => ({
    display: item.display_name,
    short: item.display_name.split(",").slice(0, 2).join(","),
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}

/* ──────────────────────────────────────────────
   Routing (OSRM) — coords → road geometry
   ────────────────────────────────────────────── */
async function fetchOSRMRoutes(startCoords, endCoords) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}` +
    `?overview=full&geometries=geojson&alternatives=true&steps=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing request failed");
  const data = await res.json();
  if (!data.routes || !data.routes.length) throw new Error("No route found between these locations");
  return data.routes;
}

/* ──────────────────────────────────────────────
   Route labels — assign identity to alternatives
   ────────────────────────────────────────────── */
const ROUTE_LABELS = [
  { id: "fastest", title: "Fastest Route", icon: "🚗", traffic: "high" },
  { id: "eco", title: "Eco (Low Pollution)", icon: "🍃", traffic: "low" },
  { id: "least-crowded", title: "Least Crowded", icon: "🚶", traffic: "medium" },
];

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m`;
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/* ──────────────────────────────────────────────
   Autocomplete input sub-component
   ────────────────────────────────────────────── */
function AutocompleteInput({ value, onChange, placeholder, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  function handleChange(e) {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchSuggestions(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 400);
  }

  function handleSelect(suggestion) {
    onChange(suggestion.short);
    onSelect({ lat: suggestion.lat, lng: suggestion.lng, display: suggestion.display });
    setShowSuggestions(false);
    setSuggestions([]);
  }

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45 transition-colors"
      />
      {showSuggestions && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-cyan-300/10 transition-colors border-b border-white/5 last:border-b-0"
            >
              <span className="mr-2 text-cyan-400">📍</span>
              {s.short}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════ */
function RouteOptimizer({ onRoutesReady, selectedRouteId, setSelectedRouteId, mood }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [routeCards, setRouteCards] = useState([]);

  const stableOnRoutesReady = useRef(onRoutesReady);
  stableOnRoutesReady.current = onRoutesReady;

  /* ── Optimize routes handler ── */
  const optimizeRoutes = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      // Step 1 — Geocode if we don't have coords from autocomplete
      let start = sourceCoords;
      let end = destCoords;

      if (!start) start = await geocodePlace(source);
      if (!end) end = await geocodePlace(destination);

      // Step 2 — Fetch real routes from OSRM
      const osrmRoutes = await fetchOSRMRoutes(start, end);

      // Step 3 — Map OSRM results to our route format
      const mappedRoutes = osrmRoutes.slice(0, 3).map((osrmRoute, index) => {
        const label = ROUTE_LABELS[index] || ROUTE_LABELS[0];
        const durationJitter = index === 0 ? 1 : 1 + index * 0.15; // eco/walk routes slightly longer
        const adjustedDuration = osrmRoute.duration * durationJitter;

        return {
          id: label.id,
          title: label.title,
          icon: label.icon,
          eta: formatDuration(adjustedDuration),
          etaSeconds: adjustedDuration,
          distance: formatDistance(osrmRoute.distance),
          distanceMeters: osrmRoute.distance,
          aqi: Math.round(30 + Math.random() * 80),
          crowd: index === 0 ? "High" : index === 1 ? "Low" : "Very Low",
          crowdScore: index === 0 ? 78 : index === 1 ? 34 : 20,
          traffic: label.traffic,
          source: source,
          destination: destination,
          sourceCoords: start,
          destCoords: end,
          // OSRM geojson coords are [lng, lat] — our MapView toLeafletLatLng expects the same
          path: osrmRoute.geometry.coordinates,
        };
      });

      // If OSRM returned fewer than 3 alternatives, duplicate the first with slight variations
      while (mappedRoutes.length < 3) {
        const base = mappedRoutes[0];
        const idx = mappedRoutes.length;
        const label = ROUTE_LABELS[idx];
        mappedRoutes.push({
          ...base,
          id: label.id,
          title: label.title,
          icon: label.icon,
          traffic: label.traffic,
          eta: formatDuration(base.etaSeconds * (1 + idx * 0.15)),
          aqi: Math.round(30 + Math.random() * 80),
          crowd: idx === 1 ? "Low" : "Very Low",
          crowdScore: idx === 1 ? 34 : 20,
        });
      }

      setRouteCards(mappedRoutes);
      stableOnRoutesReady.current(mappedRoutes);
      setSelectedRouteId(mappedRoutes[0].id);
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("RouteOptimizer error:", err);
    } finally {
      setLoading(false);
    }
  }, [source, destination, sourceCoords, destCoords, setSelectedRouteId]);

  return (
    <section className="glass rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-slate-100">Smart Route Optimizer</h3>
      <p className="mt-1 text-sm text-slate-400">Enter any start & end location to find real routes.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <AutocompleteInput
          value={source}
          onChange={(val) => { setSource(val); setSourceCoords(null); }}
          placeholder="📍 Source (e.g. Bandra)"
          onSelect={(coords) => setSourceCoords(coords)}
        />
        <AutocompleteInput
          value={destination}
          onChange={(val) => { setDestination(val); setDestCoords(null); }}
          placeholder="🎯 Destination (e.g. Lower Parel)"
          onSelect={(coords) => setDestCoords(coords)}
        />
      </div>

      {error && (
        <div className="mt-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          ⚠️ {error}
        </div>
      )}

      <Motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={optimizeRoutes}
        disabled={loading || !source.trim() || !destination.trim()}
        className={`mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
          loading || !source.trim() || !destination.trim()
            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-900 shadow-[0_0_20px_rgba(77,196,255,0.3)]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            Finding routes…
          </span>
        ) : (
          "🔍 Optimize Routes"
        )}
      </Motion.button>

      <div className="mt-4 grid gap-2">
        {routeCards.map((route) => {
          const selected = selectedRouteId === route.id;
          return (
            <Motion.button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              whileHover={{ scale: 1.01 }}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                selected
                  ? "border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_12px_rgba(77,196,255,0.15)]"
                  : "border-white/10 bg-white/5 hover:border-violet-300/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm text-slate-100">
                  {route.icon} {route.title}
                </strong>
                <span className="text-xs font-semibold text-cyan-300">{route.eta}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {route.distance} • AQI {route.aqi} • Crowd: {route.crowd}
              </p>
            </Motion.button>
          );
        })}
      </div>
    </section>
  );
}

export default RouteOptimizer;
