import { useState, useMemo } from "react";
import { motion as Motion } from "framer-motion";

const INITIAL_STATIONS = [
  { id: "A", name: "HyperCharge Hub A", location: "Sector 1 (Downtown)", speed: "350 kW", price: "$0.28 / kWh", availability: 82, slots: 4, type: "Ultra-Fast" },
  { id: "B", name: "Solar Grid Dock B", location: "Sector 3 (Residential)", speed: "150 kW", price: "$0.19 / kWh", availability: 54, slots: 2, type: "Fast" },
  { id: "C", name: "MetroCharge Node C", location: "Sector 5 (Commercial)", speed: "50 kW", price: "$0.15 / kWh", availability: 68, slots: 3, type: "Standard" },
  { id: "D", name: "EcoHub D", location: "Sector 7 (Eco-Belt)", speed: "350 kW", price: "$0.22 / kWh", availability: 91, slots: 6, type: "Ultra-Fast" },
  { id: "E", name: "Nucleus E", location: "Sector 2 (Industrial)", speed: "150 kW", price: "$0.25 / kWh", availability: 45, slots: 1, type: "Fast" }
];

function EvStationsView({ palette }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFast, setFilterFast] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Booking state
  const [selectedStationId, setSelectedStationId] = useState("");
  const [evModel, setEvModel] = useState("");
  const [duration, setDuration] = useState("1 Hour");
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const filteredStations = useMemo(() => {
    return INITIAL_STATIONS.filter((station) => {
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            station.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFast = !filterFast || station.speed === "350 kW" || station.speed === "150 kW";
      const matchesAvail = !showOnlyAvailable || station.slots > 0;
      return matchesSearch && matchesFast && matchesAvail;
    });
  }, [searchQuery, filterFast, showOnlyAvailable]);

  function handleBooking(e) {
    e.preventDefault();
    const station = INITIAL_STATIONS.find((s) => s.id === selectedStationId);
    if (!station || !evModel.trim()) return;

    setBookingConfirmation({
      bookingId: `EV-${Math.floor(100000 + Math.random() * 900000)}`,
      stationName: station.name,
      speed: station.speed,
      evModel: evModel.trim(),
      duration,
      passcode: Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Reset form
    setSelectedStationId("");
    setEvModel("");
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
      {/* Station List Directory */}
      <section className="glass rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">EV Station Registry</h3>
          <p className="text-xs text-slate-400 mb-4">View available docking stations in real time</p>

          {/* Directory Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station or sector..."
              className="flex-grow rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
            />
            <button
              onClick={() => setFilterFast((prev) => !prev)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                filterFast ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300"
              }`}
            >
              🚀 Fast Charge (&gt;=150kW)
            </button>
            <button
              onClick={() => setShowOnlyAvailable((prev) => !prev)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                showOnlyAvailable ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300"
              }`}
            >
              🟢 Only Available
            </button>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-2">Station</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Output</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Docks Available</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map((station) => (
                  <tr key={station.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-slate-100">{station.name}</div>
                      <div className="text-[10px] text-slate-500">{station.location}</div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        station.type === "Ultra-Fast" ? "bg-cyan-500/10 text-cyan-300 border border-cyan-400/20" : "bg-violet-500/10 text-violet-300 border border-violet-400/20"
                      }`}>
                        {station.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono">{station.speed}</td>
                    <td className="py-3 text-slate-400">{station.price}</td>
                    <td className="py-3 text-right">
                      <span className={`font-semibold ${station.slots > 0 ? "text-[#2cf8c2]" : "text-rose-400"}`}>
                        {station.slots > 0 ? `${station.slots} slots` : "Full"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredStations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No stations match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Booking and Confirmation Column */}
      <div className="space-y-4">
        {/* Booking Form */}
        <section className="glass rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-slate-100">Reserve a Dock</h3>
          <p className="text-xs text-slate-400 mb-4">Book a charging slot for your electric vehicle</p>

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Select Station</label>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none text-slate-200 focus:border-cyan-300/45"
                required
              >
                <option value="" disabled className="bg-slate-900 text-slate-500">Choose a station...</option>
                {INITIAL_STATIONS.map((station) => (
                  <option 
                    key={station.id} 
                    value={station.id} 
                    disabled={station.slots === 0}
                    className="bg-slate-900 text-slate-200 disabled:text-slate-500"
                  >
                    {station.name} ({station.speed}) - {station.slots} left
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Vehicle Model</label>
              <input
                type="text"
                value={evModel}
                onChange={(e) => setEvModel(e.target.value)}
                placeholder="e.g. Model S Plaid"
                className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {["30 Min", "1 Hour", "2 Hours"].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setDuration(time)}
                    className={`rounded-xl border py-2 text-xs font-semibold transition ${
                      duration === time ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!selectedStationId || !evModel.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Charging Slot
            </Motion.button>
          </form>
        </section>

        {/* Confirmation Pass */}
        {bookingConfirmation && (
          <Motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-5 border-l-4 border-[#2cf8c2] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-16 w-16 bg-[#2cf8c2]/5 rounded-bl-full flex items-center justify-center font-bold text-xs text-[#2cf8c2]">
              PASS
            </div>

            <h3 className="text-sm font-bold text-[#2cf8c2] uppercase tracking-wider">Booking Successful</h3>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Pass ID:</span>
                <span className="font-mono font-semibold text-slate-100">{bookingConfirmation.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Station:</span>
                <span className="font-semibold text-slate-100">{bookingConfirmation.stationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="font-mono text-slate-100">{bookingConfirmation.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-slate-100">{bookingConfirmation.evModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Limit:</span>
                <span className="text-slate-100">{bookingConfirmation.duration}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-slate-400">Dock Activation Code:</span>
                <span className="font-mono font-bold text-lg text-slate-100 tracking-widest">{bookingConfirmation.passcode}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Activate charger slot within 15 minutes at terminal.</p>
            </div>
          </Motion.section>
        )}
      </div>
    </div>
  );
}

export default EvStationsView;
