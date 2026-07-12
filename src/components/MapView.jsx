import { useMemo, useEffect, useState, useRef } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-icon-2x.png";
import "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ──────────────────────────────────────────────
   Fetch real EV charging stations from Overpass
   (OpenStreetMap — free, no API key)
   ────────────────────────────────────────────── */
async function fetchEvStationsAlongRoute(routePath) {
  if (!routePath || routePath.length < 2) return [];

  // Calculate bounding box from route coordinates [lat, lng]
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const [lat, lng] of routePath) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  // Expand bbox slightly (~2km buffer) so we catch stations near the route
  const buffer = 0.02;
  minLat -= buffer;
  maxLat += buffer;
  minLng -= buffer;
  maxLng += buffer;

  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="charging_station"](${minLat},${minLng},${maxLat},${maxLng});
    );
    out body 30;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!res.ok) throw new Error("Overpass API error");
    const data = await res.json();

    if (!data.elements || !data.elements.length) return [];

    // Convert Overpass results to our station format
    return data.elements.map((el, idx) => {
      const tags = el.tags || {};
      const name = tags.name || tags.operator || tags.brand || `Charging Station ${idx + 1}`;
      const capacity = parseInt(tags.capacity || "0", 10);
      // Simulate availability and crowd based on capacity
      const availability = capacity > 0 ? Math.min(95, 40 + Math.round(Math.random() * 50)) : Math.round(40 + Math.random() * 55);
      const crowdOptions = ["low", "medium", "high"];
      const crowd = crowdOptions[Math.floor(Math.random() * 3)];

      return {
        id: el.id,
        name,
        position: [el.lat, el.lon],
        availability,
        crowd,
        capacity: capacity || null,
        socket: tags.socket || null,
        network: tags.network || tags.operator || null,
        real: true, // flag to distinguish from fallback
      };
    });
  } catch (err) {
    console.warn("Failed to fetch EV stations from Overpass:", err);
    return [];
  }
}

/* ──────────────────────────────────────────────
   Fallback: generate stations along route path
   if Overpass returns nothing
   ────────────────────────────────────────────── */
function generateFallbackStations(routePath) {
  if (!routePath || routePath.length < 2) return [];

  const stations = [];
  const step = Math.max(1, Math.floor(routePath.length / 5));

  for (let i = step; i < routePath.length - 1; i += step) {
    if (stations.length >= 4) break;
    const [lat, lng] = routePath[i];
    // Offset slightly so they don't sit on the road
    const jitterLat = lat + (Math.random() - 0.5) * 0.005;
    const jitterLng = lng + (Math.random() - 0.5) * 0.005;
    const crowdOptions = ["low", "medium", "high"];

    stations.push({
      id: `fallback-${i}`,
      name: `EV Station ${stations.length + 1}`,
      position: [jitterLat, jitterLng],
      availability: Math.round(40 + Math.random() * 55),
      crowd: crowdOptions[Math.floor(Math.random() * 3)],
      real: false,
    });
  }
  return stations;
}

function trafficColor(level) {
  if (level === "high") return "#ef4444";
  if (level === "medium") return "#eab308";
  return "#22c55e";
}

function toLeafletLatLng(path) {
  return path.map(([lng, lat]) => [lat, lng]);
}

/* ──────────────────────────────────────────────
   Custom marker icons for source & destination
   ────────────────────────────────────────────── */
function createSourceIcon() {
  return L.divIcon({
    html: `
      <div style="
        background: #22c55e;
        border: 3px solid rgba(255,255,255,0.7);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 0 18px rgba(34,197,94,0.7);
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(34,197,94,0.3);
          animation: sourcePulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes sourcePulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: "source-marker-icon",
  });
}

function createDestIcon() {
  return L.divIcon({
    html: `
      <div style="
        background: #ef4444;
        border: 3px solid rgba(255,255,255,0.7);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 0 18px rgba(239,68,68,0.7);
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(239,68,68,0.3);
          animation: destPulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes destPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: "dest-marker-icon",
  });
}

// Create custom EV station marker icon
function createEvStationIcon(crowd, isReal) {
  const colors = {
    low: "#2cf8c2",
    medium: "#facc15",
    high: "#f87171",
  };

  const color = colors[crowd] || "#2cf8c2";
  const ring = isReal ? `border: 3px solid rgba(255,255,255,0.5);` : `border: 3px dashed rgba(255,255,255,0.3);`;
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        ${ring}
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px ${color}88;
        animation: evPulse_${crowd} 2s infinite;
        font-size: 12px;
      " class="ev-marker">
        ⚡
      </div>
      <style>
        @keyframes evPulse_${crowd} {
          0%, 100% { box-shadow: 0 0 15px ${color}88; }
          50% { box-shadow: 0 0 25px ${color}cc; }
        }
      </style>
    `,
    iconSize: [24, 24],
    className: "ev-station-icon",
  });
}

/* ──────────────────────────────────────────────
   FitBounds — auto-zoom map to fit the route
   ────────────────────────────────────────────── */
function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;
    try {
      const bounds = L.latLngBounds(positions);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true, duration: 0.8 });
      }
    } catch (e) {
      console.warn("FitBounds error:", e);
    }
  }, [positions, map]);

  return null;
}

/* ══════════════════════════════════════════════
   Main MapView Component
   ══════════════════════════════════════════════ */
function MapView({ routes, selectedRouteId, mood }) {
  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || routes[0] || null;
  const [evStations, setEvStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const prevRouteKeyRef = useRef("");

  const selectedRoutePath = useMemo(() => {
    if (!selectedRoute) return [];
    return toLeafletLatLng(selectedRoute.path);
  }, [selectedRoute]);

  /* ── Fetch EV stations when route changes ── */
  useEffect(() => {
    if (!selectedRoutePath || selectedRoutePath.length < 2) {
      setEvStations([]);
      return;
    }

    // Build a key from first+last coords so we don't re-fetch when just switching route alternatives
    const first = selectedRoutePath[0];
    const last = selectedRoutePath[selectedRoutePath.length - 1];
    const routeKey = `${first[0].toFixed(3)},${first[1].toFixed(3)}-${last[0].toFixed(3)},${last[1].toFixed(3)}`;

    if (routeKey === prevRouteKeyRef.current) return;
    prevRouteKeyRef.current = routeKey;

    let cancelled = false;
    setStationsLoading(true);

    fetchEvStationsAlongRoute(selectedRoutePath).then((stations) => {
      if (cancelled) return;
      if (stations.length > 0) {
        setEvStations(stations);
      } else {
        // Fallback: generate stations along the route
        setEvStations(generateFallbackStations(selectedRoutePath));
      }
      setStationsLoading(false);
    });

    return () => { cancelled = true; };
  }, [selectedRoutePath]);

  // Filter EV stations based on mood
  const filteredStations = useMemo(() => {
    if (mood === "stressed") {
      return evStations.filter((s) => s.crowd === "low");
    }
    if (mood === "focused" && evStations.length > 0) {
      // Pick the station closest to route midpoint
      const mid = selectedRoutePath[Math.floor(selectedRoutePath.length / 2)] || selectedRoutePath[0];
      if (!mid) return evStations.slice(0, 1);
      return [evStations.reduce((a, b) => {
        const distA = Math.abs(a.position[0] - mid[0]) + Math.abs(a.position[1] - mid[1]);
        const distB = Math.abs(b.position[0] - mid[0]) + Math.abs(b.position[1] - mid[1]);
        return distA < distB ? a : b;
      })];
    }
    return evStations;
  }, [mood, evStations, selectedRoutePath]);

  const source = selectedRoutePath[0];
  const destination = selectedRoutePath[selectedRoutePath.length - 1];

  // Determine whether we have a real route to show
  const hasRoute = routes.length > 0 && selectedRoutePath.length > 0;

  // Memoize icons so they don't re-create every render
  const sourceIcon = useMemo(() => createSourceIcon(), []);
  const destIcon = useMemo(() => createDestIcon(), []);

  return (
    <section className="glass rounded-2xl p-4 flex flex-col h-full justify-between">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Live Mobility Grid</h3>
        <span className="text-xs text-slate-400">
          {hasRoute ? `${selectedRoute?.source || "—"} → ${selectedRoute?.destination || "—"}` : "Enter a route to begin"}
          {" • "}
          {stationsLoading ? "Loading stations…" : `${filteredStations.length} EV stations`}
          {" • "}
          {mood === "stressed" ? "Low Crowd Only" : mood === "focused" ? "Nearest Only" : "All Stations"}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 h-[380px] md:h-[450px] xl:h-[630px]">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
          <TileLayer
            attribution='&copy; CartoDB Dark'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Auto-zoom to fit route */}
          {hasRoute && <FitBounds positions={selectedRoutePath} />}

          {/* Draw all route polylines */}
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <Polyline
                key={route.id}
                positions={toLeafletLatLng(route.path)}
                pathOptions={{
                  color: trafficColor(route.traffic),
                  weight: isSelected ? 7 : 4,
                  opacity: isSelected ? 0.95 : 0.35,
                  lineCap: "round",
                  lineJoin: "round",
                  dashArray: isSelected ? undefined : "8 12",
                }}
              />
            );
          })}

          {/* Source marker — green pulsing */}
          {source && (
            <Marker position={source} icon={sourceIcon}>
              <Popup>
                <div style={{ textAlign: "center", fontFamily: "system-ui", fontSize: "13px" }}>
                  <strong>📍 Start</strong><br />
                  {selectedRoute?.source || "Source"}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination marker — red pulsing */}
          {destination && (
            <Marker position={destination} icon={destIcon}>
              <Popup>
                <div style={{ textAlign: "center", fontFamily: "system-ui", fontSize: "13px" }}>
                  <strong>🎯 Destination</strong><br />
                  {selectedRoute?.destination || "Destination"}
                </div>
              </Popup>
            </Marker>
          )}

          {/* EV Stations — dynamic, fetched along route */}
          {filteredStations.map((station) => (
            <Marker 
              key={station.id} 
              position={station.position}
              icon={createEvStationIcon(station.crowd, station.real)}
            >
              <Popup>
                <div style={{ fontFamily: "system-ui", fontSize: "13px", minWidth: "160px" }}>
                  <strong>⚡ {station.name}</strong><br />
                  <span style={{ color: "#666" }}>Availability: {station.availability}%</span><br />
                  <span style={{ color: "#666" }}>Crowd: {station.crowd}</span>
                  {station.network && <><br /><span style={{ color: "#888" }}>Network: {station.network}</span></>}
                  {station.capacity && <><br /><span style={{ color: "#888" }}>Capacity: {station.capacity} slots</span></>}
                  {!station.real && <><br /><span style={{ color: "#aaa", fontStyle: "italic" }}>Simulated station</span></>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedRoute && (
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <span className="block text-slate-400 text-[10px] uppercase">ETA</span>
            <span className="font-semibold text-cyan-300">⏱ {selectedRoute.eta}</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <span className="block text-slate-400 text-[10px] uppercase">Distance</span>
            <span className="font-semibold text-violet-300">📏 {selectedRoute.distance || "—"}</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <span className="block text-slate-400 text-[10px] uppercase">AQI</span>
            <span className="font-semibold text-amber-300">💨 {selectedRoute.aqi}</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
            <span className="block text-slate-400 text-[10px] uppercase">Crowd</span>
            <span className="font-semibold text-emerald-300">👥 {selectedRoute.crowd}</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default MapView;
