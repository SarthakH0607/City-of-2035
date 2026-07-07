import { motion as Motion } from "framer-motion";
import { useState } from "react";

const menuItems = [
  { icon: "📊", label: "Dashboard", desc: "Overview & Status" },
  { icon: "🚗", label: "Mobility", desc: "Routes & Traffic" },
  { icon: "⚡", label: "EV Stations", desc: "Charging Network" },
  { icon: "💡", label: "AI Assistant", desc: "Smart Help" },
  { icon: "📈", label: "Analytics", desc: "Statistics" },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="glass glow-border h-full rounded-3xl p-4 sm:p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_24px_rgba(77,196,255,0.5)]" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">City OS</p>
          <h1 className="text-sm font-semibold text-slate-100">City of 2035</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          return (
            <Motion.button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.label)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`flex w-full flex-col gap-2 rounded-xl border px-3 py-3 text-left transition-all ${
                isActive
                  ? "border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_16px_rgba(77,196,255,0.2)]"
                  : "border-white/5 bg-white/[0.03] hover:border-cyan-300/30 hover:bg-cyan-300/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-semibold text-slate-100">{item.label}</span>
              </div>
              <span className="text-xs text-slate-400">{item.desc}</span>
            </Motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;


