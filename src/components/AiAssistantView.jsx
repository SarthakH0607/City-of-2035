import { useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const PRESETS = [
  { label: "🚦 Get Downtown Traffic Flow", query: "Show traffic in downtown" },
  { label: "🍃 Get City Air Quality Index", query: "How is the air quality?" },
  { label: "📍 Find Best Route to Central station", query: "Best route to central station" }
];

function getAiResponse(input) {
  const text = input.toLowerCase();

  if (text.includes("traffic")) {
    return "Traffic update: Central loop is at 78% capacity. Harbor corridor is smooth with green flow.";
  }
  if (text.includes("air")) {
    return "Air quality remains stable. Current city-wide AQI is 62 with cleaner zones in the north eco-sector.";
  }
  if (text.includes("route")) {
    return "Recommended route: Eco corridor via Solar Avenue. ETA 24 minutes with low pollution and medium crowd.";
  }

  return "I can help with traffic, air quality, and route planning. Try asking one of those keywords.";
}

function AiAssistantView() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageIdRef = useRef(2);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Welcome to City AI Portal. Query my intelligence core on municipal operations (traffic, air, routes, power grids).",
    },
  ]);

  const nextId = () => {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id;
  };

  const sendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: nextId(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          sender: "assistant",
          text: getAiResponse(textToSend),
        },
      ]);
    }, 950);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      {/* Messaging Pane */}
      <section className="glass rounded-2xl p-5 flex flex-col justify-between h-[600px]">
        {/* Terminal Header */}
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#2cf8c2] animate-pulse" />
            <h3 className="text-lg font-semibold text-slate-100">Municipal AI Intelligence</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">CORE v4.95</span>
        </div>

        {/* Messaging Box */}
        <div className="flex-grow space-y-4 overflow-y-auto rounded-xl border border-white/5 bg-black/15 p-4 mb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <Motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "ml-auto bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border border-cyan-400/20 text-cyan-100 rounded-tr-none"
                    : "border border-white/5 bg-slate-900/60 text-slate-200 rounded-tl-none"
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1 font-mono">
                  {msg.sender === "user" ? "CITIZEN_SYS" : "AI_CORE"}
                </div>
                {msg.text}
              </Motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-fit rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3 text-sm text-slate-400 rounded-tl-none"
            >
              <div className="text-[10px] text-slate-500 mb-1 font-mono">AI_CORE</div>
              <span className="flex gap-1.5 items-center">
                <span>Calculating response</span>
                <span className="flex gap-0.5">
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </span>
            </Motion.div>
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query city OS systems (e.g. traffic load, pollution index, energy output)..."
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300/45 transition"
          />
          <Motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_24px_rgba(77,196,255,0.35)]"
          >
            Transmit
          </Motion.button>
        </form>
      </section>

      {/* Preset Queries Panel */}
      <section className="glass rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-2">Preset Diagnostics</h3>
          <p className="text-xs text-slate-400 mb-4">Click any query vector to query the intelligence core</p>

          <div className="space-y-2">
            {PRESETS.map((preset) => (
              <Motion.button
                key={preset.label}
                whileHover={{ scale: 1.01, x: 2 }}
                onClick={() => sendMessage(preset.query)}
                className="w-full text-left rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100 transition"
              >
                {preset.label}
              </Motion.button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-6 text-xs text-slate-400">
          <p className="font-mono mb-1 text-slate-500">AI STATUS MATRIX:</p>
          <ul className="space-y-1 font-mono">
            <li>• Memory Core: 92% free</li>
            <li>• Response Latency: 12ms</li>
            <li>• Encryption: SHA-2035</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default AiAssistantView;
