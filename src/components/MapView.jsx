import { useMemo } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
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

// Enhanced EV stations with crowd levels
const EV_STATIONS = [
  { id: 1, name: "HyperCharge A", position: [19.082, 72.883], availability: 82, crowd: "low" },
  { id: 2, name: "Solar Dock B", position: [19.09, 72.895], availability: 54, crowd: "medium" },
  { id: 3, name: "MetroCharge C", position: [19.087, 72.889], availability: 68, crowd: "high" },
  { id: 4, name: "EcoHub D", position: [19.075, 72.871], availability: 91, crowd: "low" },
  { id: 5, name: "Nucleus E", position: [19.098, 72.905], availability: 45, crowd: "high" },
];

function trafficColor(level) {
  if (level === "high") return "#ef4444";
  if (level === "medium") return "#eab308";
  return "#22c55e";
}

function toLeafletLatLng(path) {
  return path.map(([lng, lat]) => [lat, lng]);
}

// Create custom EV station marker icon
function createEvStationIcon(crowd) {
  const colors = {
    low: "#2cf8c2",
    medium: "#facc15",
    high: "#f87171",
  };
  
  return L.divIcon({
    html: `
      <div style="
        background: ${colors[crowd] || '#2cf8c2'};
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px ${colors[crowd] || '#2cf8c2'}88;
        animation: pulse 2s infinite;
      " class="ev-marker">
        ⚡
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 15px ${colors[crowd] || '#2cf8c2'}88; }
          50% { box-shadow: 0 0 25px ${colors[crowd] || '#2cf8c2'}cc; }
        }
      </style>
    `,
    iconSize: [24, 24],
    className: "ev-station-icon",
  });
}

function MapView({ routes, selectedRouteId, mood }) {
  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || routes[0] || null;

  const selectedRoutePath = useMemo(() => {
    if (!selectedRoute) return [];
    return toLeafletLatLng(selectedRoute.path);
  }, [selectedRoute]);

  // Filter EV stations based on mood
  const filteredStations = useMemo(() => {
    if (mood === "stressed") {
      return EV_STATIONS.filter((s) => s.crowd === "low");
    }
    if (mood === "focused") {
      return [EV_STATIONS.reduce((a, b) => {
        const distA = Math.abs(a.position[0] - 19.084) + Math.abs(a.position[1] - 72.887);
        const distB = Math.abs(b.position[0] - 19.084) + Math.abs(b.position[1] - 72.887);
        return distA < distB ? a : b;
      })];
    }
    return EV_STATIONS;
  }, [mood]);

  const source = selectedRoutePath[0];
  const destination = selectedRoutePath[selectedRoutePath.length - 1];

  return (
    <section className="glass rounded-2xl p-4 flex flex-col h-full justify-between">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Live Mobility Grid</h3>
        <span className="text-xs text-slate-400">Dark Theme • {mood === "stressed" ? "Low Crowd Only" : mood === "focused" ? "Nearest Only" : "All Stations"}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 h-[380px] md:h-[450px] xl:h-[630px]">
        <MapContainer center={[19.084, 72.887]} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; CartoDB Positron'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <Polyline
                key={route.id}
                positions={toLeafletLatLng(route.path)}
                pathOptions={{
                  color: trafficColor(route.traffic),
                  weight: isSelected ? 7 : 4,
                  opacity: isSelected ? 0.95 : 0.45,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            );
          })}

          {source && (
            <Marker position={source}>
              <Popup>📍 Source Point</Popup>
            </Marker>
          )}

          {destination && (
            <Marker position={destination}>
              <Popup>🎯 Destination Point</Popup>
            </Marker>
          )}

          {filteredStations.map((station) => (
            <Marker 
              key={station.id} 
              position={station.position}
              icon={createEvStationIcon(station.crowd)}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{station.name}</strong><br />
                  Availability: {station.availability}%<br />
                  Crowd: {station.crowd}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedRoute && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">⏱ {selectedRoute.eta}</div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">💨 AQI {selectedRoute.aqi}</div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">Crowd: {selectedRoute.crowd}</div>
        </div>
      )}
    </section>
  );
}

export default MapView;
